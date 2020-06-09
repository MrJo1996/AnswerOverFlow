import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController} from '@ionic/angular';
import { Router } from "@angular/router";
import { ApiService } from 'src/app/providers/api.service';
import { DataService } from "../services/data.service";

import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";

import { NavController } from '@ionic/angular';

import { __await } from 'tslib';

@Component({
  selector: 'app-modifica-domanda',
  templateUrl: './modifica-domanda.page.html',
  styleUrls: ['./modifica-domanda.page.scss'],
})
export class ModificaDomandaPage implements OnInit {
  urlCategorie = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaCategorie'


  codice_domanda: number;
  cod_preferita: number;
  cod_categoria: number;

  dataeoraToPass: string;
  timerToPass: string;
  titoloToPass: string;
  descrizioneToPass: string;
  categoriaToPass;
  
  categoriaScelta;
  categoriaSettings: any = [];
  codCategoriaScelta;
  codice_categoria;
  
  cod_categoriaView;
  categoriaView;
  dataeoraView;
  timerView;
  titoloView;
  descrizioneView;

  domanda = {};
  categories = {};

  timerSettings: string[] = ["5 min", "15 min", "30 min", "1 ora", "3 ore", "6 ore", "12 ore", "1 giorno", "3 giorni"]; //scelte nel picker


  
  constructor( private dataService: DataService, 
    public alertController: AlertController, 
    public apiService: ApiService,
    private pickerController: PickerController,
    public toastController: ToastController,
    public navCtrl: NavController) { }

  ngOnInit() {
    
    this.apiService.prendiCategorie(this.urlCategorie).then(
      (categories) => {
        this.categoriaSettings = categories;
        console.log('Categorie visualizzate con successo.', this.categoriaSettings);
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione delle categorie.");
      }
    );

    this.showSurvey();
  }

  async modify() {

    if( this.titoloToPass == null) {
      this.titoloToPass = this.titoloView;
    }
    if (this.descrizioneToPass == null) {
      this.descrizioneToPass = this.descrizioneView;
    }

    if (this.dataeoraToPass == null) {
      this.dataeoraToPass = this.dataeoraView;
    }
    
    if (this.timerToPass == null) {
      this.timerToPass = this.timerView;
    }

    if (this.stringDescriptionChecker()) {
      this.popupInvalidDescription();
    } else if (this.stringTitleLengthChecker()) {
      this.popupInvalidTitle();
    } else if (this.deadlineCheck()) {
      this.popupDomandaScaduta();
    } else if (this.checkIfThereAreEnglishBadWords(this.descrizioneToPass)
    || this.checkIfThereAreItalianBadWords(this.descrizioneToPass)
    || this.checkIfThereAreEnglishBadWords(this.titoloToPass)
    || this.checkIfThereAreItalianBadWords(this.titoloToPass)) {
      this.toastParolaScoretta();
    }
    else {
    this.apiService.modificaDomanda(this.codice_domanda, this.dataeoraToPass, this.timerToPass, this.titoloToPass, this.descrizioneToPass, this.categoriaToPass||this.categoriaView, this.cod_preferita).then(
      (result) => {  
        console.log(result)
        console.log('categoria',this.categoriaToPass)
        console.log('categoria',this.categoriaScelta)
        console.log(this.codice_domanda)
        console.log('Modifica avvenuta con successo: ');
        
      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('Modifica non effetutata');
        
      }
    );
    }
  }

  async showSurvey() {
    this.codice_domanda = this.dataService.codice_domanda;

    this.apiService.getDomanda(this.codice_domanda).then(
      (domanda) => {
        console.log('Visualizzato con successo');
        
        this.domanda = domanda['data']; //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
        
        
        this.dataeoraView = this.domanda['0'].dataeora;  //setto var da visualizzare a video per risolvere il problema del crop schermo durante il serve dell'app ( problema stava nell'utilizzo di: ['0'] per accedere alla var da visualizzare)
        this.timerView = this.domanda['0'].timer;
        this.titoloView = this.domanda['0'].titolo;
        this.descrizioneView = this.domanda['0'].descrizione;
        this.cod_preferita = this.domanda['0'].cod_preferita;
        this.cod_categoriaView = this.domanda['0'].cod_categoria;

        this.getCategoriaView();
        
        
        console.log('Domanda: ', this.domanda['0']);
      
        this.mappingIncrement(this.domanda['0'].timer);

        var auxData = []; //var ausialiaria per parsare la data di creazione
        auxData['0'] = (this.domanda['0'].dataeora.substring(0, 10).split("-")[0]); //anno
        auxData['1'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[1]; //mese [0]=gennaio
        auxData['2'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[2]; //gg
        auxData['3'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[0]; //hh
        auxData['4'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[1]; //mm
        //metto dati parsati nella var dataCreazioneToview così da creare una nuova var da poter stampare nel formato adatto
        var dataCreazioneToView = new Date(auxData['0'], parseInt(auxData['1'], 10) - 1, auxData['2'], auxData['3'], auxData['4']);
        //stampo la var appena creata nell'elemento con id="dataOraCreazione"
        document.getElementById("dataOraCreazione").innerHTML = dataCreazioneToView.toLocaleString();
      
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );

  }

  getCategoriaView() {
    for (let j = 0; j < this.categoriaSettings.length; j++) {

      if (this.cod_categoriaView == this.categoriaSettings[j].codice_categoria)
        this.categoriaView = this.categoriaSettings[j].titolo;
    }
  }
  async showCategoriaPicker() {

    let options: PickerOptions = {
      buttons: [
        {
          text: "Annulla",
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: (value: any) => {
            console.log(value);

            this.categoriaView = value['ValoreCategoriaSettata'].text;
            this.categoriaToPass = this.categoriaView;
            this.cod_categoria = value['ValoreCategoriaSettata'].value;
            this.codCategoriaScelta = this.cod_categoria;
            this.categoriaToPass=this.codCategoriaScelta
            console.log('Codice catgoria settata: ', this.codCategoriaScelta);

          }
        }
      ],
      columns: [{
        name: 'ValoreCategoriaSettata', //nome intestazione json dato 
        options: this.getCategorieOptions()
      }]

    };

    let picker = await this.pickerController.create(options);
    picker.present()
  }

  getCategorieOptions() {
    let options = [];
    this.categoriaSettings.forEach(x => {
      options.push({ text: x.titolo, value: x.codice_categoria });
    });
    return options;
  }

  stringDescriptionChecker():boolean {
    if ((this.descrizioneToPass.length > 200) || !(this.descrizioneToPass.match(/[a-zA-Z0-9_]+/))) {
      return true;
    } else {
      return false;
    }
  }
  stringTitleLengthChecker():boolean {

    if ((this.titoloToPass.length > 200) || !(this.titoloToPass.match(/[a-zA-Z0-9_]+/))) {
    return true;
  } else {
    return false;
  }
}
async popupInvalidDescription(){
  const toast = document.createElement('ion-toast');
  toast.message = 'ERRORE! Hai lasciato la descrizione vuota o hai superato la lunghezza massima!';
  toast.duration = 2000;
  toast.position = "top";
  toast.style.fontSize = '20px';
  toast.color = 'danger';
  toast.style.textAlign = 'center';
  document.body.appendChild(toast);
  return toast.present();
}
async popupInvalidTitle(){
    const toast = document.createElement('ion-toast');
    toast.message = 'ERRORE! Hai lasciato il titolo vuoto o hai superato la lunghezza massima!';
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.color = 'danger';
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
    return toast.present();
  }

  async popupModificaTitolo() {
    const alert = await this.alertController.create({
      header: 'Modifica titolo',
      inputs: [
        {
          name: 'titoloPopUp',
          type: 'text',
          placeholder: this.titoloView //risposta del servizio visualizzaSondaggio
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.titoloView = this.domanda['0'].titolo; //annullo modifiche
            console.log('Confirm cancel');
          }
        }, {
          text: 'Ok',

            handler: insertedData => {
            console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
            this.titoloView = insertedData.titoloPopUp; 
            this.titoloToPass = insertedData.titoloPopUp;

            if (insertedData.titoloPopUp == "") { //CHECK CAMPO VUOTO
              this.titoloView = this.domanda['0'].titolo;
              this.titoloToPass = this.domanda['0'].titolo;
            }
          }
        }
      ]
    });

    await alert.present();
    //View Dati inseriti dopo click sul popup di modifica titolo. Dal console log ho visto come accedere ai dati ricevuti.
    //this.titoloView = await (await alert.onDidDismiss()).data.values.titolo;
  }

  async popupDomandaScaduta() {
    const alert = await this.alertController.create({
      header: 'ATTENZIONE',
      subHeader: '',
      message: 'Domanda scaduta! !mpossibile effettuare le modifiche!',
      buttons: ['OK']
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  deadlineCheck(): boolean {
    var date = new Date(this.domanda['0'].dataeora.toLocaleString());
    console.log(date.getTime());
    var timer = this.domanda['0'].timer;
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
  
  async popupModificaDescrizione() {
    const alert = await this.alertController.create({
      header: 'Modifica descrizione',
      inputs: [
        {
          name: 'descrizionePopUp',
          type: 'text',
          placeholder: this.descrizioneView //risposta del servizio visualizzaSondaggio
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.descrizioneView = this.domanda['0'].descrizione; //annullo modifiche
            console.log('Confirm cancel');
          }
        }, {
          text: 'Ok',
          handler: insertedData => {
            console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
            this.descrizioneView = insertedData.descrizionePopUp; //setto titoloView al valore inserito nel popUp una volta premuto ok così viene visualizzato
            this.descrizioneToPass = insertedData.descrizionePopUp; //setto titoloToPass al valore inserito nel popUp una volta premuto ok

            if (insertedData.descrizionePopUp == "") { //CHECK CAMPO VUOTO
              this.descrizioneView = this.domanda['0'].descrizione;
              this.descrizioneToPass = this.domanda['0'].descrizione;
            }
          }
        }
      ]
    });

    await alert.present();
    //View Dati inseriti dopo click sul popup di modifica titolo. Dal console log ho visto come accedere ai dati ricevuti.
    //this.titoloView = await (await alert.onDidDismiss()).data.values.titolo;
  }


  async popupConfermaEliminaDomanda() {
    const alert = await this.alertController.create({
      header: 'Elimina domanda',
      message: 'Sicuro di voler eliminare questa domanda?',
      buttons: ['Conferma']
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }


  async popupConfermaModificheDomanda() {
    const alert = await this.alertController.create({
      header: 'Conferma modifiche',
      message: 'Vuoi confermare le modifiche effettuate?',
      buttons: [
        {
          text: "Annulla",
          role: 'cancel'
        },
        {
          text: 'Conferma',
          handler: (value: any) => {

            //LANCIO SERVIZIO MODIFICA UNA VOLTA CLICCATO "CONFERMA"
            this.modify();

          //TODO mostrare messaggio di avvenuta modifica e riportare alla home
            if (this.deadlineCheck()) {
              this.navCtrl.navigateRoot('/visualizza-domanda');
            } else
            this.presentAlert();

          }
        }
      ],
    });
   
    await alert.present();
    let result = await alert.onDidDismiss();
  }

  async showTimerPicker() {
    let options: PickerOptions = {
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: (value: any) => {
            /*   console.log(value); */
            this.timerView = value['ValoreTimerSettato'].value; //setto timerPopUp al valore inserito nel popUp una volta premuto ok così viene visualizzato
            //this.timerToPass = value['ValoreTimerSettato'].value; //setto timerPopUp al valore inserito nel popUp una volta premuto ok 
            /* this.timerToPass = this.timerToPass.split(" ")[0]; //taglio la stringa dopo lo spazio e prendo a partira da carattere zero */
            this.mappingTimerValueToPass(value['ValoreTimerSettato'].value);
            console.log('timer to pass: ', this.timerToPass);
          }
        }
      ],
      columns: [{
        name: 'ValoreTimerSettato', //nome intestazione json dato 
        options: this.getColumnOptions()
      }]
    };

    let picker = await this.pickerController.create(options);
    picker.present()
  }

  getColumnOptions() {
    let options = [];

    //Check dei valori ammissibili da mostrare nel picker in base all'orario di creazione del sondaggio
    var auxDataPicker = []; 
    auxDataPicker['0'] = (this.domanda['0'].dataeora.substring(0, 10).split("-")[0]); //anno
    auxDataPicker['1'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[1]; //mese [0]=gennaio
    auxDataPicker['2'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[2]; //gg
    auxDataPicker['3'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[0]; //hh
    auxDataPicker['4'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[1]; //mm
    var dataPicker = new Date(parseInt(auxDataPicker['0'], 10), parseInt(auxDataPicker['1'], 10) - 1, parseInt(auxDataPicker['2'], 10), parseInt(auxDataPicker['3'], 10), parseInt(auxDataPicker['4'], 10));

    var nowPicker = new Date(); //ora

    var increment; //avvalorata nello switch, incremmento in millisecondi della scelta
    this.timerSettings.forEach(x => {
      console.log("x ", x);
      switch (x) {
        case (this.timerSettings['0']):
          increment = 5 * 60 * 1000;
          break;

        case (this.timerSettings['1']):
          increment = 15 * 60 * 1000;
          break;

        case (this.timerSettings['2']):
          increment = 30 * 60 * 1000;
          break;

        case (this.timerSettings['3']):
          increment = 60 * 60 * 1000;
          break;

        case (this.timerSettings['4']):
          increment = 3 * 60 * 60 * 1000;
          break;

        case (this.timerSettings['5']):
          increment = 6 * 60 * 60 * 1000;
          break;

        case (this.timerSettings['6']):
          increment = 12 * 60 * 60 * 1000;
          break;

        case (this.timerSettings['7']):
          increment = 24 * 60 * 60 * 1000;
          break;

        case (this.timerSettings['8']):
          increment = 72 * 60 * 60 * 1000;
          break;

      }

       if ((dataPicker.getTime() + increment) > (nowPicker.getTime())) {
        options.push({ text: x, value: x });
      }

    });
    return options;
  }

  mappingTimerValueToPass(valueToMapp) {
    //converto valore timer da passare nel formato giusto per il db
    //inoltre converto valore del timer impostato in millisecondi così da poter calcolare tempo rimanente
    //creo nuova data di scadenza settata in base al timer impostato
    switch (valueToMapp) {
      case (this.timerSettings['0']):
        this.timerToPass = "00:05:00";

        break;
      case (this.timerSettings['1']):
        this.timerToPass = "00:15:00";

        break;
      case (this.timerSettings['2']):
        this.timerToPass = "00:30:00";

        break;
      case (this.timerSettings['3']):
        this.timerToPass = "01:00:00";

        break;
      case (this.timerSettings['4']):
        this.timerToPass = "03:00:00";

        break;
      case (this.timerSettings['5']):
        this.timerToPass = "06:00:00";

        break;
      case (this.timerSettings['6']):
        this.timerToPass = "12:00:00";

        break;
      case (this.timerSettings['7']):
        this.timerToPass = "24:00:00";

        break;
      case (this.timerSettings['8']):
        this.timerToPass = "72:00:00";

        break;
    }
  }

   interval
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
     this.interval = setInterval(function () {

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
      document.getElementById("timeLeft").innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

      this.timerView = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

      // Se finisce il countDown viene mostrato "Domanda scaduta."
      if (distance < 0) {
        clearInterval(this.interval);
        document.getElementById("timeLeft").innerHTML = "Domanda scaduta.";
        this.timerView = "OMBO TIMER,SCADUTA";
      }
    }, 1000);
console.log(this.interval)
  }
  ionViewDidLeave() {
    clearInterval(this.interval)
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

  async presentAlert() { // Funzione per mostrare a video finestrina che specifica "l'errore"
    const alert = await this.alertController.create({
      header: 'Domanda modificata',
      message: 'La tua domanda scadrà tra:' + this.timerView ,
      buttons: [

        {
          text: 'Ok',
          handler: (value: any) => {

            //Porta a "visualizza domanda" dopo avvenuta modifica
            this.navCtrl.navigateRoot('/visualizza-domanda');

          }
        }
      ],
    });

    await alert.present();
  }

  goBack() {
    this.navCtrl.navigateRoot(['/visualizza-domanda']);
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
