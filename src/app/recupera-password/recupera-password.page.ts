import { Component, OnInit } from '@angular/core';

import { Promise } from "q";

import { PostServiceService } from "../services/post-service.service";
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-recupera-password',
  templateUrl: './recupera-password.page.html',
  styleUrls: ['./recupera-password.page.scss'],
})
export class RecuperaPasswordPage implements OnInit {
  
  email= '';
  request: Promise<any>;
  result: Promise<any>;
  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/recupero'

  constructor(private service: PostServiceService, private router: Router, private navctrl: NavController) { }

  ngOnInit() {
  }

  postInvio(){
    if(this.email.search('@') < 0){
      alert("Indirizzo e-mail non valido!")
    } else{
      let postData ={
        "email": this.email 
      };
      this.result = this.service.postService(postData, this.url).then((data) => {
        this.request = data;
        console.log(data);
      }, err => {
        console.log(err.message);
      });
    }
  }
}
