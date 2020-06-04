import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, AlertController, IonCheckbox } from '@ionic/angular';
import { PostServiceService } from "../services/post-service.service";
import { TransitiveCompileNgModuleMetadata, ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';
import { ApiService } from '../providers/api.service';
import { DataService } from '../services/data.service';
import {NavController} from "@ionic/angular";
import { element } from 'protractor';
import { Storage } from "@ionic/storage";

enum scelteEnum{};


@Component({
  selector: 'app-visualizza-sondaggio',
  templateUrl: './visualizza-sondaggio.page.html',
  styleUrls: ['./visualizza-sondaggio.page.scss'],
})
export class VisualizzaSondaggioPage implements OnInit {

  codice_sondaggio;
  sondaggio = {};
  scelte = new Array();
  currentUser = " ";
  sondaggioUser;
  sceltaSelezionata = " ";
  thrashActive;
  hasVoted = false;
  codici_scelte = new Array();
  index_scelta_selezionata: number;
  codice_scelta_selezionata;
  voti_totali:  number = 0;
  percentualiScelte = new Array();


  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/cancellaSondaggio/14'
  url2 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaSondaggio'
  url3 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaScelteSondaggio'

  constructor(private navCtrl:NavController,
              private service: PostServiceService, 
              private dataService: DataService,
              private router: Router, 
              public apiService: ApiService, 
              private storage: Storage,
              public alertController: AlertController) 
              { }

  ngOnInit() {
    this.visualizzaSondaggioSelezionato();
    this.visualizzaScelte();
    this.storage.get('utente').then(data => { this.currentUser = data.email });

  }

  @ViewChild('content', { read: IonContent, static: false }) myContent: IonContent;

  goModificaDomanda() {
    this.router.navigate(['modifica-sondaggio']);
  }

  async popUpEliminaSondaggio(){
    const alert = await this.alertController.create({
      header: 'Sei sicuro di voler eliminare questo sondaggio?',
      buttons: [
         {
          text: 'Si',
          handler: () => {
            console.log('sondaggio eliminato');
          this.cancellaSondaggio();
          }
        },
        {
          text: 'No',
          role: 'cancel',
          //cssClass: 'secondary',
          handler: () => {
            console.log('eliminazione annullata');
          }
        }
      ]
    });
    await alert.present();
  }

  async visualizzaSondaggioSelezionato() {
this.codice_sondaggio= this.dataService.codice_sondaggio;
    this.apiService.getSondaggio(this.codice_sondaggio).then(
      (sondaggio) => {
      
        console.log('Visualizzato con successo');
     
        this.sondaggio = sondaggio['data']['0']; 
        this.sondaggioUser = sondaggio['data']['0'].cod_utente;
        
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );



  }

  visualizzaScelte() {

    this.apiService.getScelteSondaggio(this.codice_sondaggio).then(
      (scelte) => {
      

        this.scelte = scelte['Scelte']['data'];
        console.log("log riga 112 scelte sondaggi:", scelte);
        console.log("log riga 113 scelte sondaggi:", this.scelte);
        
        let i = 0;
       this.scelte.forEach(element => {
        var x = +element.num_favorevoli ;
          this.voti_totali =  this.voti_totali + x ;
      });
      this.calcolaPercentualiScelte();
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );

  }

  calcolaPercentualiScelte(){

    this.scelte.forEach(element => {
        var x = +element.num_favorevoli ;
        var nuovaPercentuale: number = (x)/this.voti_totali;
        var nuovaPercentualeStringata = nuovaPercentuale.toFixed(1);
        var nuovaPercentualeNum = +nuovaPercentualeStringata;
        this.percentualiScelte.push(nuovaPercentualeNum);
      
    });
    console.log("PERCENTUALI SCELTE:", this.percentualiScelte);

  }

  cancellaSondaggio() {

    this.apiService.rimuoviSondaggio(this.codice_sondaggio).then(
      (scelte) => {
      
        console.log('Eliminato con successo');

        this.scelte = scelte['Scelte']['data'];
        
        
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );

  }

  inviaVoto(){
 this.codice_scelta_selezionata = this.scelte[this.index_scelta_selezionata]['codice_scelta'];
 console.log('codice scelta ->', this.codice_scelta_selezionata);
 console.log('codice sondaggio ->', this.codice_sondaggio);
   this.apiService.votaSondaggio(this.codice_scelta_selezionata, this.codice_sondaggio).then(
      (scelte) => {
      
        console.log('Votato con successo');

      },
      (rej) => {
        console.log("C'è stato un errore durante il voto");
      }
    );  

  }

 async goBack(){
    if(this.hasVoted === true){
    const alert = await this.alertController.create({
      header: 'Sei sicuro di voler uscire senza confermare il voto?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Si',
          handler: () => {
            console.log('Confirm Okay');
           
            this.navCtrl.pop();
          }
        }
      ]
    });
    
    await alert.present();
  }
  else{
    this.navCtrl.pop();
  }
}
  


   getScelta(scelta, i){

    this.sceltaSelezionata = scelta;
    if(!this.hasVoted)
    this.hasVoted = true;
    this.index_scelta_selezionata = i;
    console.log();

 
   
  }

  async confermaVoto(scelta){
    const alert = await this.alertController.create({
      header: 'Sei sicuro della tua scelta' ,
      buttons: [
         {
          text: 'Si',
          handler: () => {
            console.log('scelta confermata');
            this.inviaVoto();
            this.router.navigate(['home']);
            
          }
        },
        {
          text: 'No',
          role: 'cancel',
          //cssClass: 'secondary',
          handler: () => {
            console.log('eliminazione annullata');
          }
        }
      ]
    });
    await alert.present();
  }



}



