import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment.dev';
import { TeamsDataService } from '../teams-data.service';
import { Team } from '../teams/team';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.css']
})
export class EditTeamComponent implements OnInit {
  @Input() team:Team = new Team();
  edit = false;
  successMessage!: string;
  errorMessage!: string;
  hasSuccess = false;
  hasError = false;
  editTeamForm!: FormGroup;
  team_country_required=environment.team_country_required;
  team_year_required=environment.team_year_required;
  @Output() editTeamEventEmmiter : EventEmitter<Team> = new EventEmitter<Team>();
  
  constructor(
    private _teamService: TeamsDataService, 
    private _route: ActivatedRoute, private _formBuilder :FormBuilder) {
     }
  ngOnInit(): void {
    this.editTeamForm = this._formBuilder.group({
      country: new FormControl(this.team.country, Validators.required),
      year: new FormControl(this.team.year, Validators.required),
      latitude: new FormControl(this.team.coordinates[0]),
      longitude: new FormControl(this.team.coordinates[1]),
    });
  }

  showEdit(){
    this.edit= !this.edit;
 }

 editTeam(){

   console.log(this.editTeamForm.value);
   this._teamService.editTeam(this.team._id,this.editTeamForm.value).subscribe({
     next: (newTeam)=>{ 
      this.setSuccessMessage(newTeam);
      this.editTeamEventEmmiter.emit(newTeam); }, 
     error: (err)=>{
      this.setErrorMessage(err);
    }
   })
 }


setSuccessMessage(newTeam:Team){
  this.successMessage=newTeam.country + environment.success_message;
  this.hasSuccess=true; 
}
setErrorMessage(err:string){
  this.errorMessage=err;
  this.hasError=true; 
}
}
