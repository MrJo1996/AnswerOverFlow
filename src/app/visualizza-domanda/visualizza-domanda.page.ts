import { Component, OnInit } from '@angular/core';
import { Promise } from "q";
import { PostServiceService } from "../services/post-service.service";
import { TransitiveCompileNgModuleMetadata, ThrowStmt } from '@angular/compiler';
import { NOMEM } from 'dns';
import { Router } from '@angular/router';

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

  requestRispostaPost: Promise<any>;
  resultRispostaPost: Promise<any>;


  
  codice_domanda = 34
  currentMailUser = "gmailverificata"//mail dell'utente corrente
  domanda = {};
  risposte;
  domandaMailUser ;//mail dell'utente che ha fatto la domanda
  domandaNomeUser = " ";//nome e cognome dell'utente che ha fatto la domanda

  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/cancellaDomanda/28'
  url2 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzadomanda'
  url3 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzarisposteperdomanda'
  url4 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaProfilo'

  constructor(private service: PostServiceService, private router: Router) { }

  ngOnInit() {
    this.visualizzaDomanda();
    this.visualizzaRisposte();
    //this.trovaUtenteDomanda();
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
  this.domanda = data['Domande']['data']['0'];
  this.domandaMailUser =  data['Domande']['data']['0'].cod_utente

  
  console.log(this.domanda);
  }, err => {
  console.log(err.message);
  });
  

  }

  visualizzaRisposte(){
    let postData ={
      "cod_domanda" : this.codice_domanda
  
  }
  
  this.resultPost = this.service.postService(postData, this.url3 ).then((data) =>{
  this.requestPost = data;
  this.risposte = data.Risposte.data;;
  
  console.log(this.risposte);
  }, err => {
  console.log(err.message);
  });
  

  }

  goModificaDomanda(){
    this.router.navigate(['modifica-domanda']);
    }
  

/* trovaUtenteDomanda(){
  let postData ={
    "email" : this.domandaMailUser

}

this.resultPost = this.service.postService(postData, this.url4 ).then((data) =>{
this.requestPost = data;
this.domandaNomeUser = data['Profilo']['0'].nome;


console.log(data);
}, err => {
console.log(err.message);
});
 
}
*/
}
