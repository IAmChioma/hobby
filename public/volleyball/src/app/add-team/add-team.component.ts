import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.dev';
import { TeamsDataService } from '../teams-data.service';
import { Team, Player } from '../teams/team';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css']
})
export class AddTeamComponent implements OnInit {
  team:Team = new Team();
  successMessage!: string;
  errorMessage!: string;
  hasSuccess = false;
  hasError = false;
  team_country_required=environment.team_country_required;
  team_year_required=environment.team_year_required;

  @Output() addEventEmmiter : EventEmitter<Team> = new EventEmitter<Team>();
  constructor(private _teamService:TeamsDataService, private _router:Router) { }

  ngOnInit(): void {
  }


  checkValidForm(form:NgForm){
    if(!form.valid){
      this.setErrorMessage(environment.country_required_fields);
      return false;
    }else{
      return true;
    }
  }
  addTeam(form:NgForm){
    if(!this.checkValidForm(form)){
      return;
    }
    console.log(form.value);
    this._teamService.createTeam(form.value).subscribe({
      next: (newTeam)=>{ 
       this.addEventEmmiter.emit(newTeam); 
      },
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
