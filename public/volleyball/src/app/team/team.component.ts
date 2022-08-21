import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from 'src/environments/environment.dev';
import { AuthenticationService } from '../authentication.service';
import { TeamsDataService } from '../teams-data.service';
import { Player, Team } from '../teams/team';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  team:Team = new Team();
  id!: string;
  edit = false;
  successMessage!: string;
  errorMessage!: string;
  hasSuccess = false;
  hasError = false;
  addPlayer = false;
  get isLoggedIn(){return this._authService.isLoggedIn};
  login_to_view= environment.login_to_view;
  constructor(
    private _teamService: TeamsDataService, 
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthenticationService
    ) {
     }

  ngOnInit(): void {
    this.id = this._route.snapshot.params["id"];
    if(this.isLoggedIn){this.getTeam(this.id);}
  }

  deleteATeam(id:string){
    return this._teamService.deleteTeam(id).subscribe(teams=> {
      this._router.navigate(["teams"]);
    })
  }
  getTeam(id:string) {
    this._teamService.getTeam(this.id).subscribe(team=> {
        this.team= team;
        console.log(team);
      });
  }
  showEdit(){
     this.edit= !this.edit;
     this.addPlayer = false;
  }


  showAddPlayerForm(){
    this.addPlayer = true;
    this.edit = false;
  }
  hideAddPlayerForm($event:Player){
    this.setSuccessMessageAfterPlayerCreation();
    this.addPlayer  = false;
    this.getTeam(this.id);
  }
  reloadTeamAndHideForm($event:Team){
   this.setSuccessMessage($event);
    this.edit  = false;
    this.getTeam(this.id);
  }
  setSuccessMessage(newTeam:Team){
    this.successMessage=newTeam.country + environment.success_message_update;
    this.hasSuccess=true; 
  }
  setSuccessMessageAfterPlayerCreation(){
    this.successMessage=environment.player_success_message;
    this.hasSuccess=true; 
  }
  setErrorMessage(err:string){
    this.errorMessage=err;
    this.hasError=true; 
  }
}
