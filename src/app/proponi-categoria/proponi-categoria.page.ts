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
  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/proponi_cat_o_sottocat';
  bad_words = new Array (/fancul/i, /cazz/i, /zoccol/i, /stronz/i, /bastard/i, /coglion/i, /puttan/i);

  constructor(private service: PostServiceService, private router: Router, private navctrl: NavController) { }

  ngOnInit() {
  }

  controllo_parole(){
    var i: number;
    var cod: number;
    var array_length: number;

    array_length = this.bad_words.length;

    for(i=0;i<array_length;i++){
      cod = this.proposta.search(this.bad_words[i]);
      if(cod>=0){
        return true;
      }
    }
    return false;
  }

  post_invio(){
    if(this.proposta.length>15){
      alert("Il nome proposto per la nuova categoria/sottocategoria è troppo lungo!");
    } else{
      if(this.controllo_parole()==false){
        let postData={
          "selezione": this.selezione,
          "proposta": this.proposta
        };
        this.result=this.service.postService(postData, this.url).then((data)=>{
          this.request=data;
          console.log(data);
        }, (err)=>{
          console.log(err.message)
        });
      } else{
        alert("Hai inserito una parola scorretta! Rimuoverla per continuare");
      }
    }
  }
}