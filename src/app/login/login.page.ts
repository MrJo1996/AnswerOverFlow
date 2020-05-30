import { Component, OnInit } from '@angular/core';

import {Router} from "@angular/router";

import {Promise} from "q";
import {Storage} from '@ionic/storage';

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

  constructor( private dataService: DataService ,private service: PostServiceService, private router : Router, private navctrl: NavController, private storage: Storage) {
    
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
        this.clickLogin(!data.error, data);


        
      }, err => {
        console.log(err.message);
      })
    }
  }

  clickLogin(condizione, data){

    if (condizione) {

      this.storage.set('utente', data.data[0]);
      this.storage.set('session', true);
      console.log('false', data);
      this.click = true;

      this.storage.set('session', true);

      setTimeout(() => {
        this.storage.get('session').then(data => {
          console.log('login ha settato bene' + data)
        });
      }, 3000); 

      this.storage.get('session').then(data => {
          this.storage.set('session', true);
          console.log('login ha settato bene' + data)
      });
      this.router.navigate(['home']);
  } else {
      console.log('error');



   /* this.dataService.setUtente(this.email, this.username, this.password, this.nome, this.cognome,this.bio);
    this.router.navigate(['home']);
    console.log(this.dataService.utente);*/

}
}

}



