import { Component, OnInit } from '@angular/core';

import {Router} from "@angular/router";

import {Promise} from "q";

import {PostServiceService} from "../Services/post-service.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  click = false;
  username = "";
  password = "";
  request: Promise<any>;
  result:  Promise<any>;
  url= 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/nomeEndPoint'

  constructor(private service: PostServiceService, private router : Router, private navctrl: NavController) {
    
  }  

  ngOnInit() {
  }

  postLogin(){
    if(this.password.length < 8){
      alert('password troppo corta');
    }else{
      let postData = {
        "email":this.username,
        "password": this.password
      };
      
      this.result = this.service.postService(postData, this.url).then((data) => {
        this.request = data;
        console.log(data);


        
      }, err => {
        console.log(err.message);
      })
    }
  }

}
