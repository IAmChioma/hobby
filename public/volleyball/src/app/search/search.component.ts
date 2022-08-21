import { Component, OnInit, ViewChild } from '@angular/core';

import { environment } from 'src/environments/environment.dev';
import { TeamsDataService } from '../teams-data.service';
import { Team } from '../teams/team';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  lat!:number;
  lng!:number;
  dist!:number;
  teams!: Team[];
  errorMessage = environment.initial_mesage;
  hasError = false;
  constructor(
    private _teamService: TeamsDataService
  ) { }

  ngOnInit(): void {
  }

  checkValue(): boolean{
    if(!this.lat || !this.lng ||!this.dist){
      this.errorMessage=environment.geosearch_field_required;
      this.hasError=true;
      return true;
    }
    else{
      return false;
    }
  }
  searchByLocation(){
    if(this.checkValue()){
      return;
    };
    this._teamService.getTeamsByLocation(this.lat,this.lng, this.dist).subscribe((teams)=>{
      this.teams = teams;
      this.hasError = false;
      this.errorMessage=environment.initial_mesage;
    })
  }
}
