import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Promise } from "q";
import { PostServiceService } from "../services/post-service.service";
import { TransitiveCompileNgModuleMetadata } from '@angular/compiler';



@Component({
  selector: 'app-visualizza-sondaggio',
  templateUrl: './visualizza-sondaggio.page.html',
  styleUrls: ['./visualizza-sondaggio.page.scss'],
})
export class VisualizzaSondaggioPage implements OnInit {
  
//titolo: string = ' ';
/*
  data_e_ora = "18-09-2019"
  categoria = "curiosita"
  descrizione = "voglio sapere il tuo nome"
  */

  codice_sondaggio = 14 
  sondaggio = {};


  scelte = [{
                  num_favorevoli: 1,
                  descrizione: 'michele'
                },
                {
                  num_favorevoli: 1,
                  descrizione: 'giovanni'
                },
                {
                  num_favorevoli: 1,
                  descrizione: 'giuseppe'
                },
                {
                  num_favorevoli: 1,
                  descrizione: 'fausto'
                }] 

  voti_totali = this.scelte[0].num_favorevoli + 
                this.scelte[1].num_favorevoli + 
                this.scelte[2].num_favorevoli + 
                this.scelte[3].num_favorevoli 


  requestPost: Promise<any>;
  resultPost: Promise<any>;

  requestDelete: Promise<any>;
  resultDelete: Promise<any>;


  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/cancellaSondaggio/4'
  url2 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaSondaggio'
  
  constructor(private service: PostServiceService) { }

  ngOnInit() {
    this.visualizzaSondaggioSelezionato();  
  
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

console.log(this.sondaggio);
}, err => {
console.log(err.message);
});

}
}




