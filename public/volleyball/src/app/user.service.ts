import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Credential } from './login/credential';
import { User } from './register/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl="http://localhost:3000/api";
  constructor(private _http:HttpClient) { }


  login(user:Credential):Observable<any>{
    return this._http.post<User>(`${this.baseUrl}/users/login`,user);
  }
  addUser(user:User):Observable<any>{
    return this._http.post<User>(`${this.baseUrl}/users`,user);
  }
  editUser(id:string,user:User):Observable<any>{
    return this._http.put<User>(`${this.baseUrl}/users/${id}`,user);
  }
}
