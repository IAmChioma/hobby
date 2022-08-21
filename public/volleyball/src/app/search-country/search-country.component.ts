import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment.dev';
import { TeamsDataService } from '../teams-data.service';
import { Team } from '../teams/team';

@Component({
  selector: 'app-search-country',
  templateUrl: './search-country.component.html',
  styleUrls: ['./search-country.component.css']
})
export class SearchCountryComponent implements OnInit {

  search!:string;
  teams!: Team[];
  errorMessage = environment.initial_mesage;
  hasError = false;
  constructor(
    private _teamService: TeamsDataService
  ) { }

  ngOnInit(): void {
  }

  checkValue(): boolean{
    if(!this.search){
      this.errorMessage=environment.search_field_required;
      this.hasError=true;
      return true;
    }
    else{
      return false;
    }
  }
  searchByCountryName(){
    if(this.checkValue()){
      return;
    };
    this._teamService.getTeamsByCountryName(this.search).subscribe((teams)=>{
      this.teams = teams;
      this.hasError = false;
      this.errorMessage=environment.initial_mesage;
    })
  }
}
