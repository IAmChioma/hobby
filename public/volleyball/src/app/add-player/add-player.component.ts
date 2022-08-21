import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment.dev';
import { TeamsDataService } from '../teams-data.service';
import { Player, Team } from '../teams/team';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.css']
})
export class AddPlayerComponent implements OnInit {

  @ViewChild('playerForm') playerForm!: NgForm;
  @Input() team!: Team;
  player = new Player();
  players : Player[] = [];
  showAddPlayerField = false;
  errorMessage!: string;
  hasError= false;
  player_name_required = environment.player_name_required;
  @Output() addPlayerEventEmmiter : EventEmitter<Player> = new EventEmitter<Player>();
  constructor(private _teamService:TeamsDataService) { }

  ngOnInit(): void {
  }


  checkValidForm(){
    if(!this.playerForm.valid){
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
  
  createPlayer(){
    if(!this.checkValidForm()){
      return;
    }
    this.playerForm.value.start_date =this.playerForm.value.start_date?  this.addDays(this.playerForm.value.start_date, 1).toISOString(): new Date();
    console.log(this.playerForm.value);
    this._teamService.createPlayer(this.team._id,this.playerForm.value).subscribe({
      next: (newPlayer)=>{ 
        this.addPlayerEventEmmiter.emit(newPlayer);
       },
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
