import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

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

  
  constructor() { }

  ngOnInit() {
  }
  
  @ViewChild('content', {read:IonContent,static: false}) myContent: IonContent;


}
