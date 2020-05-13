import { Component, OnInit } from '@angular/core';

import {Router} from "@angular/router";

import {Promise} from "q";

import { Chart } from 'chart.js';

import {PostServiceService} from "../services/post-service.service";
import {NavController} from "@ionic/angular";


@Component({
  selector: 'app-visualizza-profilo',
  templateUrl: './visualizza-profilo.page.html',
  styleUrls: ['./visualizza-profilo.page.scss'],
})
export class VisualizzaProfiloPage implements OnInit {

 
  Email = 'matitinaCom';
  Profilo =  {};
  
  request: Promise<any>;
  result:  Promise<any>;
  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaProfilo'

  constructor(private service: PostServiceService) { }

  ngOnInit() {
  }

  ConfermaVisualizzaProfilo()  {

    let postData = {
    
    "email" :this.Email,
    
    };

    this.result = this.service.postService(postData, this.url).then((data) => {
      this.request = data;
      this.Profilo = data['Profilo']['data']['0'];

    //  console.log(this.Profilo.username);

  },err => {
    console.log(err.message);
  })
}
}
