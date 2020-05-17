import { Component, OnInit } from '@angular/core';
import { TransitiveCompileNgModuleMetadata, ThrowStmt } from '@angular/compiler';
import { NOMEM } from 'dns';
import { Router } from '@angular/router';
import { ApiService } from '../providers/api.service';
import { AlertController } from '@ionic/angular';
import { DataService } from "../services/data.service";
import {NavController} from "@ionic/angular";
@Component({
  selector: 'app-visualizza-domanda',
  templateUrl: './visualizza-domanda.page.html',
  styleUrls: ['./visualizza-domanda.page.scss'],
})
export class VisualizzaDomandaPage implements OnInit {
  

  
  codice_domanda ; 

  currentMailUser = "gmailverificata"//mail dell'utente corrente
  domanda = {};
  risposte;
  domandaMailUser ;//mail dell'utente che ha fatto la domanda
  domandaNomeUser = " ";//nome e cognome dell'utente che ha fatto la domanda

  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/cancellaDomanda/28'
  url2 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzadomanda'
  url3 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzarisposteperdomanda'
  url4 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaProfilo'
  dataeoraView: any;
  timerView: any;
  titoloView: any;
  descrizioneView: any;
  cod_preferita: any;

  constructor(private navCtrl:NavController, private dataService: DataService, public apiService: ApiService, private router: Router, public alertController: AlertController) { }

  ngOnInit() {
    this.visualizzaDomanda(); 
    this.showRisposte();
    
    //this.trovaUtenteDomanda();
  }


  goModificaDomanda(){
    this.router.navigate(['modifica-domanda']);
    }
  

async visualizzaDomanda() {
  console.log(this.dataService.codice_domanda);
  this.codice_domanda = this.dataService.codice_domanda;
  this.apiService.getDomanda(this.codice_domanda).then(
    (domanda) => {
      console.log('Visualizzato con successo');
      
      this.domanda = domanda['data']; //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
      
      
      this.dataeoraView = this.domanda['0'].dataeora;  //setto var da visualizzare a video per risolvere il problema del crop schermo durante il serve dell'app ( problema stava nell'utilizzo di: ['0'] per accedere alla var da visualizzare)
      this.timerView = this.domanda['0'].timer;
      this.titoloView = this.domanda['0'].titolo;
      this.descrizioneView = this.domanda['0'].descrizione;
      this.domandaMailUser = this.domanda['0'].cod_utente;
      this.cod_preferita = this.domanda['0'].cod_preferita;
      console.log('Domanda: ', this.domanda['0']);
    
      this.mappingIncrement(this.domanda['0'].timer);

      var auxData = []; //var ausialiaria per parsare la data di creazionej
      auxData['0'] = (this.domanda['0'].dataeora.substring(0, 10).split("-")[0]); //anno
      auxData['1'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[1]; //mese [0]=gennaio
      auxData['2'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[2]; //gg
      auxData['3'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[0]; //hh
      auxData['4'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[1]; //mm
      //metto dati parsati nella var dataCreazioneToview così da creare una nuova var da poter stampare nel formato adatto
      var dataCreazioneToView = new Date(auxData['0'], parseInt(auxData['1'], 10) - 1, auxData['2'], auxData['3'], auxData['4']);
      //stampo la var appena creata nell'elemento con id="dataOraCreazione"
     // document.getElementById("dataOraCreazione").innerHTML = dataCreazioneToView.toLocaleString();
    
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

      this.risposte = risposte;
      console.log(risposte) 
    },
    (rej) => {
      console.log("C'è stato un errore durante la visualizzazione");
    }
  );
}

async cancellaDomanda() {
  this.apiService.rimuoviDomanda(this.codice_domanda).then(
    (risultato) => {
      console.log('eliminata');

    },
    (rej) => {
      console.log("C'è stato un errore durante l'eliminazione");
    }
  );
}


mappingIncrement(valueToMapp) {
  //creo nuova data di scadenza settata in base al timer impostato
  //case in base a timerToPass -> hh:mm (ossia la selezione dell'utente)

  switch (valueToMapp) {
    case ("00:05:00"):
      console.log("Selezionata scelta 5 min");
      this.countDown(0, 0, 0, 0, 5);

      break;
    case ("00:15:00"):

      this.countDown(0, 0, 0, 0, 15);

      break;
    case ("00:30:00"):

      this.countDown(0, 0, 0, 0, 30);

      break;
    case ("01:00:00"):

      this.countDown(0, 0, 0, 1, 0);

      break;
    case ("03:00:00"):

      this.countDown(0, 0, 0, 3, 0);

      break;
    case ("06:00:00"):

      this.countDown(0, 0, 0, 6, 0);

      break;
    case ("12:00:00"):

      this.countDown(0, 0, 0, 12, 0);

      break;
    case ("24:00:00"):

      this.countDown(0, 0, 1, 0, 0);

      break;
    case ("72:00:00"):

      this.countDown(0, 0, 3, 0, 0);

      break;
  }
}

async countDown(incAnno, incMese, incGG, incHH, incMM) {

  var auxData = []; //get dati dal sondaggio
  auxData['0'] = (this.domanda['0'].dataeora.substring(0, 10).split("-")[0]); //anno
  auxData['1'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[1]; //mese [0]=gennaio
  auxData['2'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[2]; //gg
  auxData['3'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[0]; //hh
  auxData['4'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[1]; //mm

  // Setto data scadenza aggiungendo l'incremento stabilito da mappingInc al momento del confermaModifiche
  var countDownDate = new Date(parseInt(auxData['0'], 10) + incAnno, parseInt(auxData['1'], 10) - 1 + incMese, parseInt(auxData['2'], 10) + incGG, parseInt(auxData['3'], 10) + incHH, parseInt(auxData['4'], 10) + incMM).getTime();
  // var countDownDateTEST = new Date(parseInt(auxData['0'], 10) + 1, parseInt(auxData['1'], 10) - 1, parseInt(auxData['2'], 10), parseInt(auxData['3'], 10), parseInt(auxData['4'], 10))/* .getTime() */;


  // Aggiorno timer ogni 1000ms (1000ms==1s)
  var x = setInterval(function () {

    //Timestamp Attuale (data + orario)
    var now = new Date().getTime();

    // Calcolo differenza, tempo mancante
    var distance = countDownDate - now;

    // conversioni
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Risultato delle conversioni messo nell'elemento con id="timeLeft"
    //TODO non mostrare valori se non avvalorati o pari a zero
   // document.getElementById("timeLeft").innerHTML = days + "d " + hours + "h "
      + minutes + "m " + seconds + "s ";

    this.timerView = days + "d " + hours + "h "
      + minutes + "m " + seconds + "s ";

    // Se finisce il countDown viene mostrato "Domanda scaduta."
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("timeLeft").innerHTML = "Domanda scaduta.";
      this.timerView = "OMBO TIMER,SCADUTA";
    }
  }, 1000);

}

goback() {
  this.navCtrl.pop();
}
}
