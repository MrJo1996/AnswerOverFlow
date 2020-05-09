import { Component, OnInit } from '@angular/core';

import {Router} from "@angular/router";

import {Promise} from "q";

import { Chart } from 'chart.js';

import {PostServiceService} from "../Services/post-service.service";
import {NavController} from "@ionic/angular";


@Component({
  selector: 'app-visualizza-profilo',
  templateUrl: './visualizza-profilo.page.html',
  styleUrls: ['./visualizza-profilo.page.scss'],
})
export class VisualizzaProfiloPage implements OnInit {

  Username = 'giotto';
  Email = 'matitinaCom';
  Nome = 'giovanni';
  Cognome = 'otto';
  Bio = 'disegno cazzi sui muri';

  request: Promise<any>;
  result:  Promise<any>;
  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaProfilo'

  constructor(private service: PostServiceService) { }

  ngOnInit() {
  }

  ConfermaVisualizzaProfilo()  {

    let postData = {
    sername :this.Username,
    email :this.Email,
    nome :this.Nome,
    cognome :this.Cognome,
    bio  :this.Bio

    };
    this.result = this.service.postService(postData, this.url).then((data) => {
      this.request = data;
      console.log(data);

  },err => {
    console.log(err.message);
  })
}
}