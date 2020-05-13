import { Component, OnInit } from '@angular/core';
import { Promise } from "q";
import { PostServiceService } from "../services/post-service.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-recupera-password',
  templateUrl: './recupera-password.page.html',
  styleUrls: ['./recupera-password.page.scss'],
})

export class RecuperaPasswordPage implements OnInit {
  
  email= '';
  request: Promise<any>;
  result: Promise<any>;
  url= 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/recupero'

  constructor(private service: PostServiceService, private router: Router) { }

  ngOnInit(){
  }

  is_email_valid(email: string){
    var formato: RegExp;

    formato = /^([a-zA-z0-9_.\-/])+\@([a-zA-z0-9_.\-/])+\.([a-zA-Z]{2,4})$/;
    if(!formato.test(email)){
      return false;
    }
    return true;
  }

  post_invio(){
    let postData ={
      "email": this.email
    };
    this.result = this.service.postService(postData, this.url).then((data) => {
      this.request = data;
      console.log(data);
    }, err => {
      console.log(err.message);
    });
    this.goToConfirm();
  }

  goback(){
    this.router.navigate(['login']);
  }

  goToConfirm(){
    this.router.navigate(['conferma-recupero']);
  }
}
