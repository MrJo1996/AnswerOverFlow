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

  currentUser = " ";
 

  codice_sondaggio;
  sondaggio = {};
  sondaggioUser;
 
  thrashActive;

  codice_categoria;
  categoria;

  votato;
  voti_totali:  number = 0;
  hasVoted = false;

  scelte = new Array();
  codici_scelte = new Array();
  sceltaSelezionata = " ";
  index_scelta_selezionata: number;
  codice_scelta_selezionata;
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
    //this.storage.get('utente').then(data => { this.currentUser = data.email });

    this.visualizzaSondaggioSelezionato();
    this.visualizzaScelte();
    this.giaVotato();

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
        this.codice_categoria = sondaggio['data']['0'].cod_categoria;
        console.log('CODICE CATEGORIA: ', this.sondaggio);
        this.visualizzaCategoria();
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );



  }

  async visualizzaScelte() {

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

  async cancellaSondaggio() {

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

  async giaVotato() {
    

    this.currentUser = this.dataService.emailUtente;
    this.codice_sondaggio= this.dataService.codice_sondaggio;

    console.log("CONTROLLO MAIL: ", this.currentUser);

    this.apiService.controllaGiaVotato(this.currentUser, this.codice_sondaggio).then(
      (risultato) => {
      
        
        this.votato = risultato["0"]["data"];
        console.log("HA GIA VOTATO:", risultato);
        
        
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );

  }

  async inviaVoto(){
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


            this.apiService.inserisciVotante(this.codice_scelta_selezionata, this.currentUser, this.codice_sondaggio).then(
              (scelte) => {
              
                console.log('Votante inserito con successo');

              },
              (rej) => {
                console.log("C'è stato un errore durante l'inserimento");
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
            this.doRefresh(event);
            //this.router.navigate(['home']);
            
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

  doRefresh(event) {
    this.voti_totali = 0;
    this.votato = true;
    //this.visualizzaSondaggioSelezionato();
    this.visualizzaScelte();
    //this.giaVotato();
    this.hasVoted = false;
    setTimeout(() => {

      event.target.complete();
    }, 1000);
  }


  doNormalRefresh(event) {
    this.voti_totali = 0;
    this.votato = false;
    //this.visualizzaSondaggioSelezionato();
    this.visualizzaScelte();
    //this.giaVotato();
    this.hasVoted = false;
    setTimeout(() => {

      event.target.complete();
    }, 1000);
  }



  async visualizzaCategoria() {

    this.apiService.getCategoria(this.codice_categoria).then(
      (categoria) => {
        this.categoria = categoria['Categoria']['data']['0'].titolo;
        console.log("questa è datacategoria", categoria['Categoria']['data']['0'].titolo);
        console.log(this.categoria);
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }


}



