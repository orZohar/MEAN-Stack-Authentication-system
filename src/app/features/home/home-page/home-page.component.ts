import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  jwtMessage: string;
  constructor(private httpClient: HttpClient) { }
  ngOnInit(): void {
    this.httpClient.get('http://localhost:3000/index').subscribe(result => { 
      this.jwtMessage = result['message'];
    })
  }
}