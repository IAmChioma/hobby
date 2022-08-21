import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment.dev';
import { TeamsDataService } from '../teams-data.service';
import { Player } from '../teams/team';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.css']
})
export class EditPlayerComponent implements OnInit {

  @Input() player:Player = new Player();
  edit = false;
  successMessage!: string;
  errorMessage!: string;
  hasSuccess = false;
  hasError= false;
  editPlayerForm!: FormGroup;
  id!: string;
  playerId!: string;
  player_name_required = environment.player_name_required;
  @Output() editPlayerEventEmmiter : EventEmitter<Player> = new EventEmitter<Player>();
  
  constructor(
    private _teamService: TeamsDataService, 
    private _route: ActivatedRoute, private _formBuilder :FormBuilder) {
     }
  ngOnInit(): void {
    this.id = this._route.snapshot.params["id"];
    this.playerId = this._route.snapshot.params["playerid"];
    this.editPlayerForm = this._formBuilder.group({
      name: new FormControl(this.player.name, Validators.required),
      start_date: new FormControl(),
    });
    
  }

  showEdit(){
    this.edit= !this.edit;
 }
 checkValidForm(form:FormGroup){
  if(!form.valid){
    this.setErrorMessage(environment.player_name_required);
    return false;
  }else{
    return true;
  }
}

addDays(str:string, days:number) {
  const myDate = new Date(str);
  myDate.setDate(myDate.getDate() + days);
  console.log(myDate);
  return myDate;
}
 editPlayer(){
  if(!this.checkValidForm(this.editPlayerForm)){
    return;
  }
   console.log(this.editPlayerForm.value);

   this.editPlayerForm.value.start_date = this.editPlayerForm.value.start_date? this.addDays(this.editPlayerForm.value.start_date, 1).toISOString(): new Date();
   this._teamService.editPlayer(this.id, this.playerId,this.editPlayerForm.value).subscribe({
     next: (newPlayer)=>{ 
     
      this.editPlayerEventEmmiter.emit(newPlayer); }, 
     error: (err)=>{
      this.setErrorMessage(err);
     }
   })
 }


 setErrorMessage(err:string){
  this.errorMessage=err;
  this.hasError=true; 
}
}
