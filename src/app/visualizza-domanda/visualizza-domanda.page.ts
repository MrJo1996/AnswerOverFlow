import { Component, OnInit } from '@angular/core';
import { Promise } from "q";
import { PostServiceService } from "../services/post-service.service";
import { TransitiveCompileNgModuleMetadata, ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-visualizza-domanda',
  templateUrl: './visualizza-domanda.page.html',
  styleUrls: ['./visualizza-domanda.page.scss'],
})
export class VisualizzaDomandaPage implements OnInit {
  
  
  
  requestDelete: Promise<any>;
  resultDelete: Promise<any>;

  requestPost: Promise<any>;
  resultPost: Promise<any>;

  codice_domanda = 22
  currentUser = "giotto"
  domanda;

  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/cancellaDomanda/5'
  url2 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzadomanda'

  constructor(private service: PostServiceService) { }

  ngOnInit() {
    this.visualizzaDomanda();
  }

  elimina(){

    let deleteData ={
      'codice_domanda' : this.codice_domanda
  
    }
  
  this.resultDelete = this.service.deleteService(this.url, deleteData ).then((data) =>{
    this.requestDelete = data;
    
  
    console.log(data);
  }, err => {
    console.log(err.message);
  });
  }


  visualizzaDomanda(){
    let postData ={
      "codice_domanda" : this.codice_domanda
  
  }
  
  this.resultPost = this.service.postService(postData, this.url2  ).then((data) =>{
  this.requestPost = data;
  this.domanda = data;

  
  console.log(data);
  }, err => {
  console.log(err.message);
  });
  

  }

}
