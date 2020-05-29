import { Component, OnInit } from '@angular/core';
import { TransitiveCompileNgModuleMetadata, ThrowStmt } from '@angular/compiler';
import { NOMEM } from 'dns';
import { Router } from '@angular/router';
import { ApiService } from '../providers/api.service';
import { AlertController } from '@ionic/angular';
import { DataService } from "../services/data.service";
import {NavController} from "@ionic/angular";
import { resolve } from 'url';
@Component({
  selector: 'app-visualizza-domanda',
  templateUrl: './visualizza-domanda.page.html',
  styleUrls: ['./visualizza-domanda.page.scss'],
})
export class VisualizzaDomandaPage implements OnInit {
  
  codice_domanda ; 

  currentMailUser = "gmailverificata"//mail dell'utente corrente
  userNameUserDomanda: string;
  domandaMailUser: string;//mail di chi ha fatto la domanda

  domanda = {};
  profiloUserDomanda = {};//profilo dell'utente che ha fatto la domanda
  dataeoraView: any;
  timerView: any;
  titoloView: any;
  descrizioneView: any;
  cod_preferita: any;
  codice_categoria = 1;

  risposte = new Array();
  profiliUtentiRisposte = new Array();

  descrizioneRispostaView;
  descrizioneRispostaToPass;
  risposta = {};
  rispostaCliccata;
  indexMigliorRisposta: number;
  private buttonColor: string = "#000";
  categoria = {};

  constructor(private navCtrl:NavController, private dataService: DataService, public apiService: ApiService, private router: Router, public alertController: AlertController) { }

  ngOnInit() {
    this.visualizzaDomanda(); 
    this.showRisposte();
  }


  goModificaDomanda(){
    this.router.navigate(['modifica-domanda']);
    }
  

async visualizzaDomanda() {
  console.log(this.dataService.codice_domanda);
  this.codice_domanda = this.dataService.codice_domanda;
  this.apiService.getDomanda(this.codice_domanda).then(
    (domanda) => {

      
      this.domanda = domanda['data']; 
      
      
      this.dataeoraView = this.domanda['0'].dataeora;  
      this.timerView = this.domanda['0'].timer;
      this.titoloView = this.domanda['0'].titolo;
      this.descrizioneView = this.domanda['0'].descrizione;
      this.domandaMailUser = this.domanda['0'].cod_utente;
      this.cod_preferita = this.domanda['0'].cod_preferita;
      console.log('Domanda: ', this.domanda['0']);
      this.getUserDomanda();
      this.visualizzaCategoria();
      
  
    },
    (rej) => {
      console.log("C'è stato un errore durante la visualizzazione");
    }
  );

}

async popUpEliminaDomanda(){
  const alert = await this.alertController.create({
    header: 'Sei sicuro di voler eliminare questa domanda?',
    buttons: [
       {
        text: 'Si',
        handler: () => {
          console.log('domanda eliminata');
        this.cancellaDomanda();
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

async showRisposte() {
  this.codice_domanda = this.dataService.codice_domanda;
  this.apiService.getRispostePerDomanda(this.codice_domanda).then(
    (risposte) => {
      console.log('Visualizzato con successo');

      this.risposte = risposte['Risposte']['data'];
      this.risposte.forEach(element => {
        this.trovaProfiliUtentiRisposte(element.cod_utente);
      });
      
      
      console.log(risposte) 
    },
    (rej) => {
      console.log("C'è stato un errore durante la visualizzazione");
    }
  );
}

async trovaProfiliUtentiRisposte(mailUtenteRisposta){
  this.apiService.getProfilo(mailUtenteRisposta).then(
    (profilo) => {
      this.profiliUtentiRisposte.push(profilo['data']);
      console.log('profilo trovato con successo', this.profiliUtentiRisposte);

    },
    (rej) => {
      console.log("C'è stato un errore durante la visualizzazione del profilo");
    }
  );

}



async visualizzaCategoria() {
  
  this.apiService.getCategoria(this.codice_categoria).then(
    (categoria) => {
      this.categoria = categoria['Categoria']['data']['0'].titolo;
     console.log("questa è datacategoria",categoria['Categoria']['data']['0'].titolo );
     console.log(this.categoria );
    },
    (rej) => {
      console.log("C'è stato un errore durante la visualizzazione");
    }
  );
}

async cancellaDomanda() {
  this.apiService.rimuoviDomanda(this.codice_domanda).then(
    (risultato) => {
      //console.log('eliminata');

    },
    (rej) => {
      //console.log("C'è stato un errore durante l'eliminazione");
    }
  );
}

async getUserDomanda(){
  this.apiService.getProfilo(this.domandaMailUser).then(
    (profilo) => {
      this.profiloUserDomanda = profilo['data']['0'];
      //console.log('profilo trovato con successo', this.profiloUserDomanda);

    },
    (rej) => {
      //console.log("C'è stato un errore durante la visualizzazione del profilo");
    }
  );

}

goback() {
  this.navCtrl.pop();
}

async modify() {

  if (!this.checkIfThereAreEnglishBadWords(this.descrizioneRispostaView) && !this.checkIfThereAreItalianBadWords(this.descrizioneRispostaView)) {
  this.apiService.modificaRisposta(this.dataService.codice_risposta, this.descrizioneRispostaToPass).then(
    (result) => { // nel caso in cui va a buon fine la chiamata
    },
    (rej) => {// nel caso non vada a buon fine la chiamata
      console.log('Modifica non effetutata'); //anche se va nel rej va bene, modifiche effettive nel db
    }
  );
  } else {
    this.popupParolaScorretta();
  }

}

async popupModificaDescrizioneRisposta() {

  const alert = await this.alertController.create({
    header: 'Modifica',
    inputs: [
      {
        name: 'descrizionePopUp',
        type: 'text',
        placeholder: this.rispostaCliccata.descrizione
      }
    ],
    buttons: [
      {
        text: 'Annulla',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm cancel');
        }
      }, {
        text: 'Ok',
        handler: insertedData => {
          console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
          this.descrizioneRispostaView = insertedData.descrizionePopUp; //setto descrizioneView al valore inserito nel popUp una volta premuto ok così viene visualizzato
          this.descrizioneRispostaToPass = insertedData.descrizionePopUp; //setto descrizioneToPass al valore inserito nel popUp una volta premuto ok

          this.modify();
        }
      }
    ]
  });

  await alert.present();
  //View Dati inseriti dopo click sul popup di modifica descrizione. Dal console log ho visto come accedere ai dati ricevuti.
  //this.descrizioneView = await (await alert.onDidDismiss()).data.values.descrizione;
  }

clickRisposta(risposta, i){
  if(this.risposte[i]['cod_utente'] === this.currentMailUser){

  this.dataService.codice_risposta = risposta.codice_risposta;
 

  this.rispostaCliccata = risposta;

  this.popupModificaDescrizioneRisposta();

  }
  }

  checkIfThereAreEnglishBadWords(string: string): boolean {

    var Filter = require('bad-words'),
    filter = new Filter();
  
    return filter.isProfane(string)
  
    }

  checkIfThereAreItalianBadWords(string: string): boolean {

    let list = require('italian-badwords-list');
    
    let array = list.array

    return array.includes(string);
  }


  async popupParolaScorretta() {
    const alert = await this.alertController.create({
      header: 'ATTENZIONE',
      subHeader: 'Subtitle',
      message: 'Hai inserito una parola scorretta',
      buttons: ['OK']
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  changeColor(){
    if(this.buttonColor === "#000")
    this.buttonColor = "#fff";
    else
    this.buttonColor = "#000";

  }



/*   async showDescrizioneRisposta() {
    this.apiService.getRisposta(this.dataService.getCodiceRisposta()).then(
      resolve => {
        this.descrizioneRispostaView = resolve['data']['0'].descrizione;
        console.log(this.descrizioneRispostaView);
      },
      (rej) => {
        console.log("C'è stato un errore durante il recupero dei dati");
      }
    )
  } */

}