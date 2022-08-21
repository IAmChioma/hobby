import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.dev';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  get name(){return this._authService.name};
  get isLoggedIn(){return this._authService.isLoggedIn};
  guest = environment.guest;
  constructor(private _authService:AuthenticationService) { }

  ngOnInit(): void {
  }

}
