import { Component, OnInit } from '@angular/core';
import { ApiService } from '../providers/api.service';
import { AlertController, MenuController } from '@ionic/angular';
import { DataService } from "../services/data.service";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { element } from 'protractor';


@Component({
  selector: 'app-visualizza-domanda',
  templateUrl: './visualizza-domanda.page.html',
  styleUrls: ['./visualizza-domanda.page.scss'],
})
export class VisualizzaDomandaPage implements OnInit {
  numLike2: Array<number> = []
  numDislike2: Array<number> = []
  votoAttuale
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
  //profiliUtentiRisposte = new Array();
  descrizioneRispostaView;
  descrizioneRispostaToPass;
  risposta = {};
  rispostaCliccata;
  indexMigliorRisposta: number;
  rispostaVisible = false;
  private buttonColor: string = "#2a2a2a";
  private buttonColorBest: string = "gold";
  descrizione_risposta = "";

  //likes = new Array();
  coloriLikeDislike = new Array();

  categoria = {};
  codice_categoria: number;

  codice_valutazione;

  timerView2;


  giorni;
  ore;
  minuti;
  secondi;

  valutazioni = new Array();

  risposte2
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

    //this.storage.get('utente').then(data => { this.currentMailUser = data.email });
    this.visualizzaDomanda();
    this.showRisposte();

    this.allVisible = true;

  }

  //TOASTTTTTTTTTTTTTTTTTTTTTTTTTTTTT

  goModificaDomanda() {
    if (this.risposte.length > 0)
      this.showErrorToast();
    if (this.deadlineCheck()) {
      this.toastModificaDomandaScaduta();
    }
    else {
      //Visualizza il frame di caricamento
      const loading = document.createElement('ion-loading');
      loading.cssClass = 'loading';
      loading.spinner = 'crescent';
      loading.duration = 5000;
      document.body.appendChild(loading);
      loading.present();
      //this.router.navigate(['modifica-domanda']);
      this.navCtrl.navigateForward(['modifica-domanda']);
      this.doRefresh(event);
    }
  }


  async visualizzaDomanda() {

    this.codice_domanda = this.dataService.codice_domanda;
    this.currentMailUser = this.dataService.getEmail_Utente();
    console.log(this.currentMailUser)
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
            //Visualizza il frame di caricamento
            const loading = document.createElement('ion-loading');
            loading.cssClass = 'loading';
            loading.spinner = 'crescent';
            loading.duration = 3500;
            document.body.appendChild(loading);
            loading.present();
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
        //Prendo le risposte dal db
        this.risposte = risposte['Risposte']['data'];
        this.risposte2 = risposte['Risposte']['data']
        let temp: Array<Number> = []
        this.risposte2.forEach(element => {
          this.numLike2.push(element.num_like)
          this.numDislike2.push(element.num_dislike)


          this.apiService.controllaGiaValutatoRisposta(this.currentMailUser, element.codice_risposta).then((data) => {
            this.votoType.push(data[0]['data'][0].tipo_like)
            console.log(data)
          })



        });

        for (let i = 0; i < this.risposte.length; i++) {

          if (this.risposte[i].codice_risposta === this.cod_preferita) {
            let aux = this.risposte[0];
            this.risposte[0] = null;
            this.risposte[0] = this.risposte[i];
            this.risposte[i] = null;
            this.risposte[i] = aux;



            for (let j = 1; j < i; j++) {
              let aux = this.risposte[j];
              this.risposte[j] = this.risposte[i];
              this.risposte[i] = aux;
            }
          }

        }

        for (let i = 0; i < this.risposte.length; i++) {

          this.cercaValutazione(this.currentMailUser, this.risposte, i);

        }


        for (let i = 0; i < this.risposte.length; i++) {
          this.trovaProfiliUtentiRisposte(this.risposte[i].cod_utente, i);

        }


      },
      (rej) => {
        //console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  async trovaProfiliUtentiRisposte(mailUtenteRisposta, i) {
    this.apiService.getProfilo(mailUtenteRisposta).then(
      (profilo) => {
        //this.profiliUtentiRisposte.push(profilo['data']['0']);
        this.risposte[i]['avatar'] = profilo['data']['0']['avatar'];
        this.risposte[i]['username'] = profilo['data']['0']['username'];


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

      },
      (rej) => {
        //console.log("C'è stato un errore durante la visualizzazione del profilo");
      }
    );

  }

  goback() {
    //Visualizza il frame di caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3500;
    document.body.appendChild(loading);
    loading.present();

    this.navCtrl.pop();
  }

  async modify() {

    if (this.checkIfThereAreEnglishBadWords(this.descrizioneRispostaToPass) || this.checkIfThereAreItalianBadWords(this.descrizioneRispostaToPass)) {
      this.toastParolaScoretta();
    } else if (this.stringLengthChecker(this.descrizioneRispostaToPass)) {
      this.toastInvalidString();
    } else if (this.deadlineCheck()){
      this.toastModificaDomandaScaduta();
     } else {
      this.apiService.modificaRisposta(this.dataService.codice_risposta, this.descrizioneRispostaToPass).then(
        (result) => { // nel caso in cui va a buon fine la chiamata
        },
        (rej) => {// nel caso non vada a buon fine la chiamata
          console.log('Modifica non effetutata'); //anche se va nel rej va bene, modifiche effettive nel db
        }
      );
      this.showModifyToast();
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
    if (this.checkIfThereAreItalianBadWords(this.descrizione_risposta) || this.checkIfThereAreEnglishBadWords(this.descrizione_risposta)) {
      this.toastParolaScoretta();
    } else if (this.stringLengthChecker(this.descrizione_risposta)) {
      this.toastInvalidString();
    } else {
      this.apiService.inserisciRisposta(this.descrizione_risposta, this.currentMailUser, this.codice_domanda).then(
        (result) => { // nel caso in cui va a buon fine la chiamata
        },
        (rej) => {// nel caso non vada a buon fine la chiamata
          console.log('Modifica non effetutata'); //anche se va nel rej va bene, modifiche effettive nel db
        }
      );

      this.showModifyToast();
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

    stringArray.forEach(element => {
      if (array.includes(element))
        check = true;
    });

    console.log(check);

    return check;

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
    if (!this.deadlineCheck()) {
      if (this.rispostaVisible === false)
        this.rispostaVisible = true;

      else
        this.rispostaVisible = false;

    }
    else {

      this.toastDomandaScaduta();
    }


  }

  doRefresh(event) {
    clearInterval(this.interval)
    this.visualizzaDomanda();
    this.showRisposte();

    setTimeout(() => {

      event.target.complete();
    }, 2000);
  }


  async handleLoading() {
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  votoType: Array<number> = []
  modificaLike(i, value) {
    console.log('value' + value)

    if (value == 1) {
      if (this.votoType[i] == 2)
        this.numDislike2[i] -= 1
      this.votoType[i] = 1
    }
    if (value == -1) this.votoType[i] = null
  //  console.log(this.risposte2)
    this.numLike2[i] = this.numLike2[i] + value || 0
    clearTimeout(this.timeoutHandle);
   // console.log(this.numLike2)
  //  console.log(this.numDislike2[i] + '       ', this.numLike2[i] + '' + this.votoType[i])
    this.timeoutHandle = setTimeout(function(vototype){

      console.log('sparoiserviziiiiiiiiiiiiiiiiiiiiiiiiii'+vototype)
    }
    ,700,this.votoType[i]);
//    clearTimeout(timeoutHandle);

    // in your click function, call clearTimeout
 
    
    // then call setTimeout again to reset the timer
    
  }
  
  timeoutHandle
  modificaDislike(i, value) {
    var temp=true
    console.log('value' + value)
    if (value == 1) {
      if (this.votoType[i] == 1) this.numLike2[i] -= 1
      this.votoType[i] = 2

    }
    if (value == -1) this.votoType[i] = null
    this.numDislike2[i] += value
   // console.log(this.numDislike2[i] + '       ', this.numLike2[i] + '' + this.votoType[i])
   // console.log(this.numDislike2)
   // console.log(this.risposte2)
   
    clearTimeout(this.timeoutHandle);
    this.timeoutHandle = setTimeout(function(vototype){
      console.log('sparoiserviziiiiiiiiiiiiiiiiiiiiiiiiii'+vototype)
    }
    ,700,this.votoType[i]);
    //clearTimeout(timeoutHandle);

    // in your click function, call clearTimeout
    
  }
  cercaValutazione(cod_utente, risposte, i) {
    this.apiService.controllaGiaValutatoRisposta(cod_utente, risposte[i].codice_risposta).then(
      (result) => {
        if (result["0"]["data"] !== null) {
          this.codice_valutazione = result["0"]["data"]["0"]["codice_valutazione"];
          this.valutazioni.push(result["0"]["data"]["0"]);

        }

        if (result["0"]["data"] === null) {
          risposte[i]['tipo_like'] = -1;

        }
        else if (result["0"]["data"]["0"]["tipo_like"] === 1)
          risposte[i]['tipo_like'] = 1;

        else if (result["0"]["data"]["0"]["tipo_like"] === 2)
          risposte[i]['tipo_like'] = 2;
      },
      (rej) => {

      }
    );

  }




  /*  cancellaValutazione(codice_valutazione) {
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
 
 
 */


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

      //console.log("GIORNI ORE MINUTI SECONDI: ", days, hours, minutes, seconds);
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
    }, 1000);


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
    //Visualizza il frame di caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3000;
    document.body.appendChild(loading);
    loading.present();

    this.dataService.setEmailOthers(cod_utente);
    console.log(this.dataService.setEmailOthers);
    // this.router.navigate(['/visualizza-profilo']);
    this.navCtrl.navigateForward(['/visualizza-profilo']);
  }


  ionViewDidLeave() {
    clearInterval(this.interval);
    //this.likes = new Array();
  }



  openMenu() {
    this.menuCtrl.open();
  }
  ionViewDidEnter() {
    clearInterval(this.interval);
    this.mappingIncrement(this.timerView2);

  }




  goChat() {
    //Visualizza il frame di caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 2000;
    document.body.appendChild(loading);
    loading.present();

    this.dataService.setEmailOthers(this.domandaMailUser);
    this.navCtrl.navigateForward(['/chat'])

  }

  deadlineCheck(): boolean {
    var date = new Date(this.dataeoraView.toLocaleString());
    console.log(date.getTime());
    var timer = this.timerView2;
    console.log(timer);
    var dateNow = new Date().getTime();


    // Since the getTime function of the Date object gets the milliseconds since 1970/01/01, we can do this:
    var time2 = date.getTime();
    var seconds = new Date('1970-01-01T' + timer + 'Z').getTime();

    var diff = dateNow - time2;

    console.log(seconds);
    console.log(time2);
    console.log(diff);

    return diff > seconds;
  }

  async toastDomandaScaduta() {
    const toast = await this.toastController.create({
      message: 'Domanda scaduta! Impossibile rispondere!',
      duration: 2000
    });
    toast.color = 'danger';
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.style.textAlign = 'center';
    toast.present();
  }

  async toastModificaDomandaScaduta() {
    const toast = await this.toastController.create({
      message: 'Domanda scaduta! Non puoi più modificarla!',
      duration: 2000
    });
    toast.color = 'danger';
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.style.textAlign = 'center';
    toast.present();
  }




  stringLengthChecker(string: String): boolean {

    if ((string.length > 1000) || !(string.match(/[a-zA-Z0-9_]+/))) {
      return true;
    } else {
      return false;
    }
  }

  async toastInvalidString() {
    const toast = await this.toastController.create({
      message: 'ATTENZIONE! Hai lasciato un campo vuoto oppure hai superato la lunghezza massima!',
      duration: 2000
    });
    toast.color = 'danger';
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.style.textAlign = 'center';
    toast.present();
  }

  async toastParolaScoretta() {
    const toast = await this.toastController.create({
      message: 'Hai inserito una parola scorretta!',
      duration: 2000
    });
    toast.color = 'danger';
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.style.textAlign = 'center';
    toast.present();
  }

}

