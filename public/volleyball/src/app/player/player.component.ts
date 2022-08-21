import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from 'src/environments/environment.dev';
import { TeamsDataService } from '../teams-data.service';
import { Player } from '../teams/team';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  id!: string;
  playerId!: string;
  player:Player = new Player();
  edit=false;
  successMessage!: string;
  errorMessage!: string;
  hasSuccess = false;
  hasError = false;
  constructor(
    private _teamService:TeamsDataService, 
    private _route:ActivatedRoute,
    private _location: Location,
    private _router: Router

    ) { }

  ngOnInit(): void {
    this.id = this._route.snapshot.params["id"];
    this.playerId = this._route.snapshot.params["playerid"];
   this.getPlayer();
  }
  getPlayer(){
    this._teamService.getPlayer(this.id, this.playerId).subscribe(player=>{this.player=player;console.log(player) })
  }
  goBack(){
    return this._location.back();
  }
  deleteAPlayer(){
    return this._teamService.deletePlayer(this.id, this.playerId).subscribe(teams=> {
      this._router.navigate([`team/${this.id}`]);
    })
  }
  showEdit(){
    this.edit= !this.edit;
 }
 reloadPlayerAndHideForm($event:Player){
  this.setSuccessMessage()
  this.edit  = false;
  this.getPlayer();
}

setSuccessMessage(){
  this.successMessage=environment.player_success_message_update;
  this.hasSuccess=true; 
}
setErrorMessage(err:string){
  this.errorMessage=err;
  this.hasError=true; 
}
}
