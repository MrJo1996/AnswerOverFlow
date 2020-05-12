import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Promise } from "q";
import { PostServiceService } from "../services/post-service.service";
import { TransitiveCompileNgModuleMetadata } from '@angular/compiler';
import { Router } from '@angular/router';



@Component({
  selector: 'app-visualizza-sondaggio',
  templateUrl: './visualizza-sondaggio.page.html',
  styleUrls: ['./visualizza-sondaggio.page.scss'],
})
export class VisualizzaSondaggioPage implements OnInit {
  
  codice_sondaggio = 15
  sondaggio = {};
  scelte={};
  currentUser = "giotto"
  sondaggioUser;


  requestPost: Promise<any>;
  resultPost: Promise<any>;

  requestPostScelte: Promise<any>;
  resultPostScelte: Promise<any>;

  requestDelete: Promise<any>;
  resultDelete: Promise<any>;

  thrashActive;

  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/cancellaSondaggio/14'
  url2 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaSondaggio'
  url3= 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaScelteDelSondaggio'
  
  constructor(private service: PostServiceService, private router: Router) { }

  ngOnInit() {
    this.visualizzaSondaggioSelezionato();  
    this.visualizzaScelte();

  }
  
  @ViewChild('content', {read:IonContent,static: false}) myContent: IonContent;

elimina(){

  let deleteData ={
      "codice_sondaggio" : this.codice_sondaggio

  }

this.resultDelete = this.service.deleteService(this.url, deleteData ).then((data) =>{
  this.requestDelete = data;
  

  console.log(data);
}, err => {
  console.log(err.message);
});
}

visualizzaSondaggioSelezionato(){


  let postData ={
    "codice_sondaggio" : this.codice_sondaggio

}

this.resultPost = this.service.postService(postData, this.url2  ).then((data) =>{
this.requestPost = data;
this.sondaggio = data['Sondaggio']['data']['0'];
this.sondaggioUser = data['Sondaggio']['data']['0'].cod_utente;

console.log(this.sondaggio);
}, err => {
console.log(err.message);
});

}

visualizzaScelte(){

  let postDataScelta ={
    "codice_sondaggio" : this.codice_sondaggio

}

this.resultPostScelte = this.service.postService(postDataScelta, this.url3 ).then((data) =>{
this.requestPostScelte = data;


console.log(data);
}, err => {
console.log(err.message);
});

}

goModificaDomanda(){
  this.router.navigate(['modifica-domanda']);
  }



}





