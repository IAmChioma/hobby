import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TeamsComponent } from './teams/teams.component';
import { TeamComponent } from './team/team.component';
import { HomeComponent } from './home/home.component';
import { PlayerComponent } from './player/player.component';
import { ErrorComponent } from './error/error.component';
import { EditTeamComponent } from './edit-team/edit-team.component';
import { AddTeamComponent } from './add-team/add-team.component';
import { EditPlayerComponent } from './edit-player/edit-player.component';
import { AddPlayerComponent } from './add-player/add-player.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import { SearchCountryComponent } from './search-country/search-country.component';

@NgModule({
  declarations: [
    AppComponent,
    TeamsComponent,
    TeamComponent,
    NavigationComponent,
    HomeComponent,
    PlayerComponent,
    EditTeamComponent,
    AddTeamComponent,
    EditPlayerComponent,
    AddPlayerComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    SearchComponent,
    SearchCountryComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path:"",component:HomeComponent},
      {path:"teams",component:TeamsComponent},
      {path:"team/:id",component:TeamComponent},
      {path:"team/:id/players/:playerid",component:PlayerComponent},
      {path:"register",component: RegisterComponent},
      {path:"profile",component: ProfileComponent},
      {path:"search",component: SearchCountryComponent},
      {path:"geosearch",component: SearchComponent},
      {path:'**', component:ErrorComponent}
    ])
  ],
  providers: [{
    provide: JWT_OPTIONS, useValue: JWT_OPTIONS}, JwtHelperService],
 
  bootstrap: [AppComponent]
})
export class AppModule { }
