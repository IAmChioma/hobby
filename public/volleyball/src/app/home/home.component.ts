import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = environment.start_message;
  constructor() { }

  ngOnInit(): void {
  }

}
