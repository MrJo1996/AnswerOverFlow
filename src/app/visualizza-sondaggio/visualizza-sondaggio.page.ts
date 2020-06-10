import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, AlertController, IonCheckbox, MenuController } from '@ionic/angular';
import { PostServiceService } from "../services/post-service.service";
import { TransitiveCompileNgModuleMetadata, ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';
import { ApiService } from '../providers/api.service';
import { DataService } from '../services/data.service';
import {NavController} from "@ionic/angular";
import { element } from 'protractor';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-visualizza-sondaggio',
  templateUrl: './visualizza-sondaggio.page.html',
  styleUrls: ['./visualizza-sondaggio.page.scss'],
})
export class VisualizzaSondaggioPage implements OnInit {

  currentUser = " ";
 

  codice_sondaggio;
  sondaggio = {};
  sondaggioUser: string;
 
  thrashActive;

  codice_categoria;
  categoria;

  votato;
  voti_totali:  number = 0;
  hasVoted: boolean;

  scelte = new Array();
  codici_scelte = new Array();
  sceltaSelezionata = " ";
  index_scelta_selezionata: number;
  codice_scelta_selezionata;
  percentualiScelte = new Array();

  profiloUserSondaggio = {};
  distanceTimer;

  isSondaggioActive;
  interval;
  timerView2;

  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/cancellaSondaggio/14'
  url2 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaSondaggio'
  url3 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaScelteSondaggio'

  constructor(private navCtrl:NavController,
              private service: PostServiceService, 
              private dataService: DataService,
              private router: Router,
              private menuCtrl: MenuController, 
              public apiService: ApiService, 
              private storage: Storage,
              public alertController: AlertController) 
              { }

  ngOnInit() {
    //this.storage.get('utente').then(data => { this.currentUser = data.email });

    this.visualizzaSondaggioSelezionato();
    this.visualizzaScelte();
    this.giaVotato();
    
    console.log("mail utente corrente: ", this.currentUser);
    

    if(this.distanceTimer < 0)
      this.isSondaggioActive = false;

    else
      this.isSondaggioActive = true;

  }

  @ViewChild('content', { read: IonContent, static: false }) myContent: IonContent;

  goModificaSondaggio() {
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
          this.goBack();
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
        this.timerView2 = sondaggio['data']['0'].timer;
        this.mappingIncrement(sondaggio['data']['0'].timer);
        console.log('CODICE CATEGORIA: ', this.sondaggio);
        console.log("Email utente del sondaggio: ", this.sondaggioUser);
        this.getUserSondaggio();
        this.visualizzaCategoria();
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );



  }

  async  visualizzaScelte() {

    this.apiService.getScelteSondaggio(this.codice_sondaggio).then(
      (scelte) => {
      
        
        this.scelte = scelte['Scelte']['data'];
        console.log("log riga 112 scelte sondaggi:", scelte);
        console.log("log riga 113 scelte sondaggi:", this.scelte);
        
        let i = 0;
        this.voti_totali = 0;
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

    this.percentualiScelte = new Array();
    this.scelte.forEach(element => {
        var x = +element.num_favorevoli ;
        var nuovaPercentuale: number = (x)/this.voti_totali;
        var nuovaPercentualeStringata = nuovaPercentuale.toFixed(1);
        var nuovaPercentualeNum = +nuovaPercentualeStringata;
        this.percentualiScelte.push(nuovaPercentualeNum);
      
    });
    console.log("PERCENTUALI SCELTE:", this.percentualiScelte);

  }

  async  cancellaSondaggio() {

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
        console.log("HA GIA VOTATO:", risultato, this.votato);
        
        
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );

  }


  async  inviaVoto(){
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

  async doRefresh(event) {
    clearInterval(this.interval);
    this.voti_totali = 0;
    this.votato = true;
    //this.visualizzaSondaggioSelezionato();

    this.ngOnInit();
    //this.visualizzaScelte();

    //this.giaVotato();
    this.hasVoted = false;
    setTimeout(() => {

      event.target.complete();
    }, 1000);
  }


  async doNormalRefresh(event) {
    clearInterval(this.interval);
    this.voti_totali = 0;
    this.votato = false;
    //this.visualizzaSondaggioSelezionato();
    
    this.ngOnInit();
    //this.visualizzaScelte();

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

  async  getUserSondaggio() {
    this.apiService.getProfilo(this.sondaggioUser).then(
      (profilo) => {
        
        this.profiloUserSondaggio = profilo['data']['0'];;
        
        console.log('profilo trovato con successo', this.sondaggioUser, profilo);

      },
      (rej) => {
        //console.log("C'è stato un errore durante la visualizzazione del profilo");
      }
    );


  }

  mappingIncrement(valueToMapp) {
    //creo nuova data di scadenza settata in base al timer impostato
    //case in base a timerToPass -> hh:mm (ossia la selezione dell'utente)
  
    switch (valueToMapp) {
      case ("00:05:00"):
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
  
  
  countDown(incAnno, incMese, incGG, incHH, incMM) {
  
    var auxData = []; //get dati dal sondaggio
    auxData['0'] = (this.sondaggio['dataeora'].substring(0, 10).split("-")[0]); //anno
    auxData['1'] = this.sondaggio['dataeora'].substring(0, 10).split("-")[1]; //mese [0]=gennaio
    auxData['2'] = this.sondaggio['dataeora'].substring(0, 10).split("-")[2]; //gg
    auxData['3'] = this.sondaggio['dataeora'].substring(11, 18).split(":")[0]; //hh
    auxData['4'] = this.sondaggio['dataeora'].substring(11, 18).split(":")[1]; //mm
  
    // Setto data scadenza aggiungendo l'incremento stabilito da mappingInc al momento del confermaModifiche
    var countDownDate = new Date(parseInt(auxData['0'], 10) + incAnno, parseInt(auxData['1'], 10) - 1 + incMese, parseInt(auxData['2'], 10) + incGG, parseInt(auxData['3'], 10) + incHH, parseInt(auxData['4'], 10) + incMM).getTime();
    // var countDownDateTEST = new Date(parseInt(auxData['0'], 10) + 1, parseInt(auxData['1'], 10) - 1, parseInt(auxData['2'], 10), parseInt(auxData['3'], 10), parseInt(auxData['4'], 10))/* .getTime() */;
  
    // Aggiorno timer ogni 1000ms (1000ms==1s)
    this.interval = setInterval(function () {
  
      //Timestamp Attuale (data + orario)
      var now = new Date().getTime();
  
      // Calcolo differenza, tempo mancante
      this.distanceTimer = countDownDate - now;
  
      // conversioni
      var days = Math.floor(this.distanceTimer / (1000 * 60 * 60 * 24));
      var hours = Math.floor((this.distanceTimer % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((this.distanceTimer % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((this.distanceTimer % (1000 * 60)) / 1000);
  
      // Risultato delle conversioni messo nell'elemento con id="timeLeft"
      //TODO non mostrare valori se non avvalorati o pari a zero
      document.getElementById("timeLeft").innerHTML = days + "giorni " + hours + "ore "
        + minutes + "min " + seconds + "s ";

      console.log(this.distanceTimer);
    
      // Se finisce il countDown viene mostrato "Sondaggio scaduto."
      if (this.distanceTimer < 0) {
        /* this.SCAD = true;
        console.log("SCAD in countdown() ", this.SCAD); */
        clearInterval(this.interval);
        this.isSondaggioActive = false;
        console.log("il sondaggio è aperto: ", this.isSondaggioActive);
     document.getElementById("timeLeft").innerHTML = "Sondaggio scaduto.";
  
        //TODO Provare generazione allert da qui che al conferma riporta al visualizza
        //TODO se non va sol. di sopra METTERE ROUTE AL VISUALIZZA
      }
    }, 1000);
  
  }

  openMenu(){
    this.menuCtrl.open();
  }

  ionViewDidLeave(){

    clearInterval(this.interval);
  }

  ionViewDidEnter(){
    clearInterval(this.interval);
    this.mappingIncrement(this.timerView2);
  } 

  goChat(){
    this.dataService.setEmailOthers(this.sondaggioUser);
    this.navCtrl.navigateForward(['/chat'])

  }


  clickProfilo(cod_utente) {
    this.dataService.setEmailOthers(cod_utente);
    console.log(this.dataService.setEmailOthers);
   // this.router.navigate(['/visualizza-profilo']);
    this.navCtrl.navigateForward(['/visualizza-profilo']);
  }

  
}

