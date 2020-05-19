import { Component, OnInit } from '@angular/core';

import {Router} from "@angular/router";

import {Promise} from "q";

import {PostServiceService} from "../services/post-service.service";
import {NavController} from "@ionic/angular";
import { DataService } from "../services/data.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  click = false;
  email = '';
  username = "";
  password = "";
  nome = '';
  cognome = '';
  bio = '';
 
  request: Promise<any>;
  result:  Promise<any>;
  url= 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/login'

  constructor( private dataService: DataService ,private service: PostServiceService, private router : Router, private navctrl: NavController) {
    
  }  

  ngOnInit() {
  }

  public reg(){
    this.router.navigate(['registrazione']);
  }

  postLogin(){
    if(this.password.length < 8){
      alert('password troppo corta');
    }else{
      let postData = {
        "username":this.username,
        "password": this.password
      };
      
      this.result = this.service.postService(postData, this.url).then((data) => {
        this.request = data;
        console.log(data);
        this.clickLogin();


        
      }, err => {
        console.log(err.message);
      })
    }
  }

  clickLogin(){
    this.dataService.setUtente(this.email, this.username, this.password, this.nome, this.cognome,this.bio);
    this.router.navigate(['home']);
    console.log(this.dataService.utente);

}
}










