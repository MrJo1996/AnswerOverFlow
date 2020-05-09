import { Component, OnInit } from '@angular/core';
import {PostServiceService} from '../services/post-service.service';
import {Promise} from "q";
import {Router} from "@angular/router";
@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.page.html',
  styleUrls: ['./registrazione.page.scss'],
})
export class RegistrazionePage implements OnInit {
  check;
  table;
  nome = '' ;
  cognome = '' ;
  email ='';
  username ='';
  password ='';
  bio;
  confermapassword;
  numeri: Array<number>;
  request: Promise<any>;
  result: Promise<any>;
  url= 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/registrazione'


  constructor(private service: PostServiceService, private router: Router) { }
  ngOnInit() {

  }

  postRegistrazione(){
    let list: number[];
    if((this.nome.length <1)||(this.cognome.length <1)||(this.email.length <1)||(this.username.length <1)){
      alert('Compilare tutti i campi contrasseganti da *');
    }else  
    if(this.password.length < 8){
      alert('password troppo corta');
    }
    else
    if(this.password != this.confermapassword){
      alert('password non coincidono');
    }
    else{
      let postData = {
        "nome": this.nome,
        "cognome": this.cognome,
        "email": this.email,
        "username": this.username,
        "password": this.password,
        "bio": this.bio}; 
      
      
      this.result = this.service.postService(postData, this.url).then((data) => {
        this.request = data;
        console.log(data.error);
      }, err => {
        console.log(err.message);
      }
      );
      console.log(postData);
      this.router.navigate(['benvenuto']);
      }
    }
    login(){
      this.router.navigate(['login']);
      }
      termini(){
        this.router.navigate(['termini']);
      }
  }
