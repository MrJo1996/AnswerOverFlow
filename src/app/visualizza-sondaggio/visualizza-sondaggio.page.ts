import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Promise } from "q";
import { PostServiceService } from "../Services/post-service.service";



@Component({
  selector: 'app-visualizza-sondaggio',
  templateUrl: './visualizza-sondaggio.page.html',
  styleUrls: ['./visualizza-sondaggio.page.scss'],
})
export class VisualizzaSondaggioPage implements OnInit {
  
  titolo = "Come ti chiami?"
  data_e_ora = "18-09-2019"
  categoria = "curiosita"
  descrizione = "voglio sapere il tuo nome"
  codice_sondaggio = 4
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


  request: Promise<any>;
  result: Promise<any>;

  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/cancellaSondaggio/4'

  
  constructor(private service: PostServiceService) { }

  ngOnInit() {
  }
  
  @ViewChild('content', {read:IonContent,static: false}) myContent: IonContent;

elimina(){

  let deleteData ={
      "codice_sondaggio" : this.codice_sondaggio

  }

this.result = this.service.deleteService(this.url, deleteData ).then((data) =>{
  this.request = data;
  console.log(data);
}, err => {
  console.log(err.message);
});
}
}




