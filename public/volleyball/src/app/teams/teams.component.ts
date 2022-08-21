import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment.dev';
import { TeamsDataService } from '../teams-data.service';
import { Team } from './team';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  teams!: Team[];
  team:Team = new Team();
  successMessage!: string;
  hasSuccess = false;
  addFormVisible = false;
  totalCount = 0;
  offset = 0;
  count = 5;
  constructor(private _teamService: TeamsDataService) { }

  ngOnInit(): void {
    this.getTeams();
    this.getTotalTeamCount();
  }


  getTeams(){
    return this._teamService.getTeams().subscribe(teams=> {this.teams = teams;});
 
  }
  getTotalTeamCount(){
    return this._teamService.getTotalTeam().subscribe(totalCount=> {this.totalCount = totalCount;});
 
  }
  showAddForm(){
    this.addFormVisible = !this.addFormVisible;
  }
  resetoffset(){
    this.offset=0;
  }
  hideAddForm($event:Team){
    this.resetoffset();
    this.addFormVisible = false;
    this.getTeams();
    this.getTotalTeamCount();
    this.setSuccessMessage($event);
  
   
  
  }
  setSuccessMessage(newTeam:Team){
    this.successMessage=newTeam.country + environment.success_message;
    this.hasSuccess=true; 
  }
  getPrev(): void {
    this.offset-=this.count;
    if(this.offset < 0){
      this.offset=0;
    }
    
    this._teamService.getTeamsByCountAndOffset(this.count, this.offset).subscribe(teams=> {this.teams = teams;});
  }
  getNext(): void {
    this.offset+=this.count;
    this._teamService.getTeamsByCountAndOffset(this.count, this.offset).subscribe(teams=> {this.teams = teams;});
  }
  getTeamsBySelectingCount($event:any){
    console.log($event.target.value);
    this.count=parseInt($event.target.value);
    this._teamService.getTeamsByCountAndOffset(this.count, this.offset).subscribe(teams=>
      {
        this.teams=teams;
        console.log(teams);
        console.log(this.offset);
      });
  }  
}
