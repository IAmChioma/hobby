import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  page_not_found=environment.page_not_found;
  constructor() { }

  ngOnInit(): void {
  }

}
