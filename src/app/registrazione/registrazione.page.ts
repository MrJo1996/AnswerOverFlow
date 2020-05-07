import { Component, OnInit } from '@angular/core';
import {PostServiceService} from '../services/post-service.service';
import {Promise} from "q";

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.page.html',
  styleUrls: ['./registrazione.page.scss'],
})
export class RegistrazionePage implements OnInit {
  check;
  table;
  nome ;
  cognome ;
  email ='';
  username ='';
  password ='';
  confermapassword;
  bio;
  request: Promise<any>;
  result: Promise<any>;
  url: 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/registrazione'


  constructor(private service: PostServiceService) { }
  ngOnInit() {

  }
  postRegistrazione(){

    if(this.password.length < 8){
      alert('password troppo corta')
    }
    else{
      if (this.check) this.table = 2; else this.table = 4;
      let postData = {
        "nome": this.nome,
        "cognome": this.cognome,
        "email": this.email,
        "username": this.username,
        "password": this.password,
        "bio": this.bio

      }; 

      if(this.password != this.confermapassword){
        alert('password non coincidono');
      }
      else{
      this.result = this.service.postService(postData, this.url).then((data) => {
        this.request = data;
        console.log(data.error);
      }, err => {
        console.log(err.message);
      
      });}

      }

    }
  }
