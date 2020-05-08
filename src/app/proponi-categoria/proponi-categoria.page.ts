import { Component, OnInit } from '@angular/core';
import { Promise } from "q";

import { PostServiceService } from "../services/post-service.service";
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-proponi-categoria',
  templateUrl: './proponi-categoria.page.html',
  styleUrls: ['./proponi-categoria.page.scss'],
})
export class ProponiCategoriaPage implements OnInit {

  selezione = '';
  proposta =  '';
  request: Promise<any>;
  result: Promise<any>;
  url= 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/proponi_cat_o_sottocat';

  constructor(private service: PostServiceService, private router: Router, private navctrl: NavController) { }

  ngOnInit() {
  }

  postInvio(){
    let postData={
      "selezione": this.selezione,
      "proposta": this.proposta
    };
    this.result = this.service.postService(postData, this.url).then((data) =>{
      this.request = data;
      console.log(data);
    }, err =>{
      console.log(err.message);
    });
  }

}
