import { Component, OnInit } from '@angular/core';
import { TransitiveCompileNgModuleMetadata, ThrowStmt } from '@angular/compiler';
import { NOMEM } from 'dns';

import { ApiService } from '../providers/api.service';
import { AlertController, MenuController } from '@ionic/angular';
import { DataService } from "../services/data.service";
import { NavController } from "@ionic/angular";
import { resolve } from 'url';
import { Storage } from "@ionic/storage";
import { ToastController } from '@ionic/angular';
import { element } from 'protractor';
import { LoadingController } from '@ionic/angular';
import { __await } from 'tslib';

@Component({
  selector: 'app-visualizza-domanda',
  templateUrl: './visualizza-domanda.page.html',
  styleUrls: ['./visualizza-domanda.page.scss'],
})
export class VisualizzaDomandaPage implements OnInit {


  allVisible: boolean = false;

  codice_domanda;

  currentMailUser = "";//mail dell'utente corrente
  domandaMailUser: string;//mail di chi ha fatto la domanda

  domanda = {};
  profiloUserDomanda = {};//profilo dell'utente che ha fatto la domanda
  dataeoraView: any;
  timerView: any;
  titoloView: any;
  descrizioneView: any;
  cod_preferita: any;
 

  risposte = new Array();
  profiliUtentiRisposte = new Array();
  descrizioneRispostaView;
  descrizioneRispostaToPass;
  risposta = {};
  rispostaCliccata;
  indexMigliorRisposta: number;
  rispostaVisible = false;
  private buttonColor: string = "#2a2a2a";
  private buttonColorBest: string = "gold";
  descrizione_risposta = "";

  likes = new Array();
  coloriLikeDislike = new Array();

  categoria = {};
  codice_categoria: number;

  codice_valutazione;

  timerView2;


  giorni;
  ore;
  minuti;
  secondi;



  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    public apiService: ApiService,
    //private router: Router,
    public alertController:
      AlertController,
    private storage: Storage,
    private menuCtrl: MenuController,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {

    this.storage.get('utente').then(data => { this.currentMailUser = data.email });
    this.visualizzaDomanda();
    this.showRisposte();
    console.log(this.currentMailUser);
    this.allVisible = true;
    
  }

                                                                                                  //TOASTTTTTTTTTTTTTTTTTTTTTTTTTTTTT

  goModificaDomanda() {
    if (this.risposte.length > 0)
      this.showErrorToast();
    else
      //this.router.navigate(['modifica-domanda']);
      this.navCtrl.navigateForward(['modifica-domanda']);
  }


  async visualizzaDomanda() {
    console.log(this.dataService.codice_domanda);
    this.codice_domanda = this.dataService.codice_domanda;
    this.apiService.getDomanda(this.codice_domanda).then(
      (domanda) => {


        this.domanda = domanda['data'];
        this.dataeoraView = this.domanda['0'].dataeora;
        this.timerView2 = this.domanda['0'].timer;
        this.titoloView = this.domanda['0'].titolo;
        this.descrizioneView = this.domanda['0'].descrizione;
        this.domandaMailUser = this.domanda['0'].cod_utente;
        this.cod_preferita = this.domanda['0'].cod_preferita;
        this.codice_categoria = this.domanda['0'].cod_categoria;
        console.log('Domanda: ', this.domanda['0']);
        console.log("TIMER VIEW: ", this.timerView2);
        this.getUserDomanda();
        this.visualizzaCategoria();

       this.mappingIncrement(this.domanda['0'].timer);

      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );

  }

  async popUpEliminaDomanda() {                                                        
    const alert = await this.alertController.create({
      header: 'Sei sicuro di voler eliminare questa domanda?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            console.log('domanda eliminata');
            this.showDeleteToast();
            this.cancellaDomanda();
            //this.router.navigate(['home']);        
            this.navCtrl.navigateBack(['home']);                                 
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
        let i = 0;
        this.risposte.forEach(element => {
          console.log('CHECK CONSOLE LOG', element);
          if (element.codice_risposta === this.cod_preferita) {
            let aux = this.risposte[0];
            this.risposte[0] = this.risposte[i];
            this.risposte[i] = aux;
            for (let j = 1; j < i; j++) {
              let aux = this.risposte[j];
              this.risposte[j] = this.risposte[i];
              this.risposte[i] = aux;
            }
          }

          i++;

        });

        let j = 0;
        this.likes = new Array();

        this.risposte.forEach(element => {
          console.log("CONSOLE LOG PER VEDERE cod risposta: ", element.codice_risposta);
            this.cercaValutazione(this.currentMailUser, element.codice_risposta);

        });


        console.log("CONSOLE LOG PER VEDERE DOVE STANNO I LIKES: ", this.likes);
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  async trovaProfiliUtentiRisposte(mailUtenteRisposta) {
    this.apiService.getProfilo(mailUtenteRisposta).then(
      (profilo) => {
        this.profiliUtentiRisposte.push(profilo['data']['0']);
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
        console.log(categoria);
        console.log("questa è datacategoria", categoria['Categoria']['data']['0'].titolo);
        console.log(this.categoria);
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



  async getUserDomanda() {
    this.apiService.getProfilo(this.domandaMailUser).then(
      (profilo) => {
        this.profiloUserDomanda = profilo['data']['0'];
        console.log(profilo['data']['0'])
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

  async scegliPreferita() {
    this.apiService.scegliRispostaPreferita(this.codice_domanda, this.cod_preferita).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('Modifica non effetutata'); //anche se va nel rej va bene, modifiche effettive nel db
      }
    );
  }


  clickInviaRisposta() {

    this.inserisciRisposta();
    this.rispostaVisible = false;

    this.doRefresh(event);

  }



  async inserisciRisposta() {
    this.apiService.inserisciRisposta(this.descrizione_risposta, this.currentMailUser, this.codice_domanda).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('Modifica non effetutata'); //anche se va nel rej va bene, modifiche effettive nel db
      }
    );

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
            
            this.showModifyToast();
            this.modify();
           
                                                                                   //TOASTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
          }
        }
      ]
    });

    await alert.present();
    //View Dati inseriti dopo click sul popup di modifica descrizione. Dal console log ho visto come accedere ai dati ricevuti.
    //this.descrizioneView = await (await alert.onDidDismiss()).data.values.descrizione;
  }

  clickRisposta(risposta, i) {
    if (this.risposte[i]['cod_utente'] === this.currentMailUser) {

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

    console.log(array);

    let stringArray = [];
    let stringPassed = string.split(' ');
    stringArray = stringArray.concat(stringPassed);

    console.log(stringArray);

    var check;

    stringArray.forEach( element => {
      if (array.includes(element))
      check = true; 
    });

    console.log(check);

    return check;

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

  changeColor(cod_nuova_preferita) {
    if (this.cod_preferita === cod_nuova_preferita) {
      this.cod_preferita = " ";
      this.scegliPreferita();

    }
    else {
      this.cod_preferita = cod_nuova_preferita;
      this.scegliPreferita();
    }

  }

  setRispostaVisible() {
    if (this.rispostaVisible === false)
      this.rispostaVisible = true;
    else
      this.rispostaVisible = false;

  }

  doRefresh(event) {
    clearInterval(this.interval)
    this.visualizzaDomanda();
    this.showRisposte();

    setTimeout(() => {

      event.target.complete();
    }, 2000);
  }


  async  handleLoading() {
    const loading = await this.loadingController.create({
      message: 'Stiamo risolvendo i tuoi dubbi...',
      duration: 750
    });

    {

      await loading.present();


    }


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



  //TOAST----------------------------------------

  async showDeleteToast() {
    const toast = document.createElement('ion-toast');
    toast.message = 'Domanda eliminata con successo!';
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.color = 'success';
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
    return toast.present();
  }

  async showErrorToast() {
    const toast = document.createElement('ion-toast');
    toast.message = 'Operazione non consentita!';
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.color = 'danger';
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
    return toast.present();
  }

  async showModifyToast() {
    const toast = document.createElement('ion-toast');
    toast.message = 'Modifica avvenuta con successo!';
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.color = 'success';
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
    return toast.present();
  }


  //AZIONI CHE RIGUARDANO I LIKE
  async modificaLike(codice_risposta, i){
    // L'UTENTE VUOLE TOGLIERE IL LIKE
    if(this.likes[i]===1  ){
      this.risposte[i].num_like = this.risposte[i].num_like - 1;
      this.likes[i] = -1;
      this.cancellaValutazione(this.codice_valutazione);
      
      console.log(this.codice_valutazione);

      this.togliLike(codice_risposta);
    }
    // VUOLE METTERE IL LIKE MA GIA' C'E' IL DISLIKE
    else if(this.likes[i]===2){
      this.risposte[i].num_like = this.risposte[i].num_like + 1;
      this.risposte[i].num_dislike = this.risposte[i].num_dislike - 1;
      this.likes[i] = 1;
      this.cancellaValutazione(this.codice_valutazione);
      this.togliDislike(codice_risposta);
      this.inserisciValutazione(codice_risposta, 1);
      this.cercaValutazione(this.currentMailUser, codice_risposta);
      console.log(this.codice_valutazione);

      this.apiService.modificaNumLike(codice_risposta).then(
        (result) => {
          
        },
        (rej) => {
          console.log('like non effetutata', codice_risposta, this.currentMailUser); 
        }
      );

    }
    else{ 
      // VUOLE METTERE IL LIKE E ANCORA NON HA MESSO NULLA
      this.risposte[i].num_like = this.risposte[i].num_like + 1;
      this.likes[i] = 1;
      this.inserisciValutazione(codice_risposta, 1);
      this.cercaValutazione(this.currentMailUser, codice_risposta);
      console.log(this.codice_valutazione);
      this.apiService.modificaNumLike(codice_risposta).then(
        (result) => {
          
        },
        (rej) => {
          console.log('like non effetutata', codice_risposta, this.currentMailUser); 
        }
      );}

  }



//AZIONI CHE RIGUARDANO I DISLIKE
 async modificaDislike(codice_risposta, i){
   // L'UTENTE VUOLE TOGLIERE IL DISLIKE
  if(this.likes[i]===2){
    this.risposte[i].num_dislike = this.risposte[i].num_dislike - 1;
    this.likes[i] = -1;
    this.cancellaValutazione(this.codice_valutazione);
    this.togliDislike(codice_risposta);

    console.log(this.codice_valutazione);

  } 
  // VUOLE METTERE IL DISLIKE MA GIA' C'E' IL LIKE
  else if(this.likes[i]===1){
    this.risposte[i].num_like = this.risposte[i].num_like - 1;
    this.risposte[i].num_dislike = this.risposte[i].num_dislike + 1;
    this.likes[i] = 2;
    this.cancellaValutazione(this.codice_valutazione);
    this.togliLike(codice_risposta);
    this.inserisciValutazione(codice_risposta, 2);
    this.cercaValutazione(this.currentMailUser, codice_risposta);

    console.log(this.codice_valutazione);
    this.apiService.modificaNumDislike(codice_risposta).then(
      (result) => { 
        
      },
      (rej) => {
        console.log('dislike non effetutata', codice_risposta, this.currentMailUser); 
      }
    );
  }
  else{
     // VUOLE METTERE IL DISLIKE E ANCORA NON HA MESSO NULLA
    this.risposte[i].num_dislike = this.risposte[i].num_dislike + 1;
    this.likes[i] = 2;
    this.inserisciValutazione(codice_risposta, 2);
    this.cercaValutazione(this.currentMailUser, codice_risposta);

    console.log(this.codice_valutazione);
    this.apiService.modificaNumDislike(codice_risposta).then(
      (result) => { 
        
      },
      (rej) => {
        console.log('dislike non effetutata', codice_risposta, this.currentMailUser); 
      }
    );}
  }



   inserisciValutazione(cod_risposta, tipo_like){
    this.apiService.inserisciValutazione(cod_risposta, this.currentMailUser, tipo_like).then(
      (result) => { 

       
      },
      (rej) => {
        console.log('Modifica non effetutata'); 
      }
    );

  }



   cercaValutazione(cod_utente, cod_risposta){
    this.apiService.controllaGiaValutatoRisposta(cod_utente, cod_risposta).then(
      (result) => { 
       
        if(result["0"]["data"] !== null){
          this.codice_valutazione =  result["0"]["data"]["0"]["codice_valutazione"];      
          console.log("valutazione effettuata: ", result);
          console.log("codice valutazione", this.codice_valutazione)  ;
                }

        if(result["0"]["data"] === null){
          this.likes.push(-1);
        }
         else if(result["0"]["data"]["0"]["tipo_like"] === 1)
             this.likes.push(1);

        else if(result["0"]["data"]["0"]["tipo_like"] === 2)
              this.likes.push(2);
      },
      (rej) => {
        console.log("Non c'è valutazione"); 
      }
    );

  }



   cancellaValutazione(codice_valutazione) {
    this.apiService.rimuoviValutazione(codice_valutazione).then(
      (risultato) => {
        console.log('eliminata');

      },
      (rej) => {
        console.log("C'è stato un errore durante l'eliminazione", rej);
      }
    );
  }



   togliLike(codice_risposta){
    this.apiService.togliLike(codice_risposta).then(
      (risultato) => {
        console.log('eliminata');

      },
      (rej) => {
        console.log("C'è stato un errore durante l'eliminazione", rej);
      }
    );
  }



   togliDislike(codice_risposta){
    this.apiService.togliDislike(codice_risposta).then(
      (risultato) => {
        console.log('eliminata');

      },
      (rej) => {
        console.log("C'è stato un errore durante l'eliminazione", rej);
      }
    );
  }





  interval
  async countDown(incAnno, incMese, incGG, incHH, incMM) {

    var auxData = new Array(); //get dati dal sondaggio
    auxData['0'] = (this.domanda['0'].dataeora.substring(0, 10).split("-")[0]); //anno
    auxData['1'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[1]; //mese [0]=gennaio
    auxData['2'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[2]; //gg
    auxData['3'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[0]; //hh
    auxData['4'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[1]; //mm

    // Setto data scadenza aggiungendo l'incremento stabilito da mappingInc al momento del confermaModifiche
    var countDownDate = new Date(parseInt(auxData['0'], 10) + incAnno, parseInt(auxData['1'], 10) - 1 + incMese, parseInt(auxData['2'], 10) + incGG, parseInt(auxData['3'], 10) + incHH, parseInt(auxData['4'], 10) + incMM).getTime();
    


    // Aggiorno timer ogni 1000ms (1000ms==1s)
    this.interval = setInterval(function () {

      //Timestamp Attuale (data + orario)
      var now = new Date().getTime();

      // Calcolo differenza, tempo mancante
      var distance = countDownDate - now;

      // conversioni
    /*   var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
 */

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        console.log("GIORNI ORE MINUTI SECONDI: ", days, hours, minutes, seconds);
      // Risultato delle conversioni messo nell'elemento con id="timeLeft"
      //TODO non mostrare valori se non avvalorati o pari a zero
     document.getElementById("timeLeft").innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

      this.timerView = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

      //Se finisce il countDown viene mostrato "Domanda scaduta."
      if (distance < 0) {
        clearInterval(this.interval);
        document.getElementById("timeLeft").innerHTML = "Domanda scaduta.";
        this.timerView = "OMBO TIMER,SCADUTA";
      } 
   },  1000);


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

  clickProfilo(cod_utente) {
    this.dataService.setEmailOthers(cod_utente);
    console.log(this.dataService.setEmailOthers);
   // this.router.navigate(['/visualizza-profilo']);
    this.navCtrl.navigateForward(['/visualizza-profilo']);
  }


  ionViewDidLeave() {
    clearInterval(this.interval)
  } 

 

  openMenu(){
    this.menuCtrl.open();
  }
  ionViewDidEnter(){
    clearInterval(this.interval);
    this.mappingIncrement(this.timerView2);
  } 
 


/*   ionViewWillLeave() {
    clearInterval(this.interval)
  }

  ngOnDestroy(){
    clearInterval(this.interval)
  }
 */


  goChat(){
    this.dataService.setEmailOthers(this.domandaMailUser);
    this.navCtrl.navigateForward(['/chat'])

  }
  }

  