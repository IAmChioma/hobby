import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Player, Team } from './teams/team';

@Injectable({
  providedIn: 'root'
})
export class TeamsDataService {
  baseUrl = "http://localhost:3000/api"
  constructor(private _http:HttpClient, private _authService: AuthenticationService) { }

  getTeams():Observable<Team[]>{
    return this._http.get<Team[]>(`${this.baseUrl}/teams`);
  }

  getTeam(id:string):Observable<Team>{
    return this._http.get<Team>(`${this.baseUrl}/teams/${id}`, {headers: {"authorization":"Bearer "+ this._authService.token}});
  }

  deleteTeam(id:string):Observable<any>{
    return this._http.delete<any>(`${this.baseUrl}/teams/${id}`,  {headers: {"authorization":"Bearer "+ this._authService.token}});
  }

  createTeam(team:Team):Observable<Team>{
    return this._http.post<Team>(`${this.baseUrl}/teams`, team);
  }
  editTeam(id:string,team:Team):Observable<Team>{
    return this._http.put<Team>(`${this.baseUrl}/teams/${id}`, team);
  };
  getTotalTeam():Observable<number>{
    return this._http.get<number>(`${this.baseUrl}/teams/totalCount`);
  }
  getTeamsByCountAndOffset(count:number, offset:number): Observable<Team[]> {
    return this._http.get<Team[]>(`${this.baseUrl}/teams?count=${count}&offset=${offset}`);
  }
  getTeamsByLocation(lat:number, lng:number, dist:number): Observable<Team[]> {
    return this._http.get<Team[]>(`${this.baseUrl}/teams?lat=${lat}&lng=${lng}&maxDist=${dist}`);
  }
  getTeamsByCountryName(name:string): Observable<Team[]> {
    return this._http.get<Team[]>(`${this.baseUrl}/teams?search=${name}`);
  }

  createPlayer(id:string, player:Player):Observable<Player>{
    return this._http.post<Player>(`${this.baseUrl}/teams/${id}/players`, player);
  }
  getPlayer(id:string, playerId:string):Observable<Player>{
    return this._http.get<Player>(`${this.baseUrl}/teams/${id}/players/${playerId}`);
  }
  editPlayer(id:string,playerId:string, player:Player):Observable<Player>{
    return this._http.put<Player>(`${this.baseUrl}/teams/${id}/players/${playerId}`, player);
  }
  deletePlayer(id:string, playerId:string):Observable<Player>{
    return this._http.delete<Player>(`${this.baseUrl}/teams/${id}/players/${playerId}`,  {headers: {"authorization":"Bearer "+ this._authService.token}});
  }

}
