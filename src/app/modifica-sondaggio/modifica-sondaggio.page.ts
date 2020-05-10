import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { ApiService } from 'src/app/providers/api.service';

//Picker - import e poi definire nel constructor
import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";
import { async } from '@angular/core/testing';
import { Time } from '@angular/common';
import { NavController } from '@ionic/angular';

import { __await } from 'tslib';

@Component({
  selector: 'app-modifica-sondaggio',
  templateUrl: './modifica-sondaggio.page.html',
  styleUrls: ['./modifica-sondaggio.page.scss'],
})
export class ModificaSondaggioPage implements OnInit {

  codice_sondaggio: number;//assegnazione forza al momento

  titoloToPass: string; //param per le funzioni
  timerToPass: string; //param per le funzioni

  titoloView; //var per la view dei valori
  timerView; //var per la view dei valori

  sondaggio = {}; //conterrà tutti i dati del sondaggio da visualizzare

  timerSettings: string[] = ["5 min", "15 min", "30 min", "1 ora", "3 ore", "6 ore", "12 ore", "1 giorno", "3 giorni"]; //scelte nel picker


  constructor(private alertController: AlertController, public apiService: ApiService, private pickerController: PickerController,
    public navCtrl: NavController) { }


  ngOnInit() {
    //Assegnazione codice forzata per ora
    this.codice_sondaggio = 15;

    this.showSurvey();

  }

  async modify() {
    //se l'utente decide di modificare solo un campo il servizio non effettuava le modifiche. 
    //In questo modo si settano i paramentri non settati al valore che già avevano.

    if (this.timerToPass == null) {
      this.timerToPass = this.timerView;
    }
    if (this.titoloToPass == null) {
      this.titoloToPass = this.titoloView;
    }
    this.apiService.modificaSondaggio(this.titoloToPass, this.timerToPass, this.codice_sondaggio).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('Modifica effetutata'); //anche se va nel rej va bene, modifiche effettive nel db

      }
    );

  }

  async showSurvey() {
    this.apiService.getSondaggio(this.codice_sondaggio).then(
      (sondaggio) => {
        console.log('Visualizzato con successo');

        this.sondaggio = sondaggio['data']; //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
        this.titoloView = this.sondaggio['0'].titolo;  //setto var da visualizzare a video per risolvere il problema del crop schermo durante il serve dell'app ( problema stava nell'utilizzo di: ['0'] per accedere alla var da visualizzare)
        this.timerView = this.sondaggio['0'].timer;

        console.log('Sondaggio: ', this.sondaggio['0']);
        //il json di risposta della chiamata è così impostato-> Sondaggio: data: posizione{vari paramentri}
        //bisogna quindi accedere alla posizione del sondaggio da visualizzare
        //in apiservice accediamo già alla posizione 'Sondaggio'. Per sapere l'ordine di accesso ai dati ho stampato a video "data" da apiservice

        //stampo tempo mancante -> passare come parametri gli incrementi che ha già settati nel campo timer
        this.mappingIncrement(this.sondaggio['0'].timer);
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );

  }

  //Pop-up Titolo
  async popupModificaTitolo() {
    const alert = await this.alertController.create({
      header: 'Modifica',
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
            this.titoloView = this.sondaggio['0'].titolo; //annullo modifiche
            console.log('Confirm cancel');
          }
        }, {
          text: 'Ok',
          handler: insertedData => {
            console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
            this.titoloView = insertedData.titoloPopUp; //setto titoloView al valore inserito nel popUp una volta premuto ok così viene visualizzato
            this.titoloToPass = insertedData.titoloPopUp; //setto titoloToPass al valore inserito nel popUp una volta premuto ok

            if (insertedData.titoloPopUp == "") { //CHECK CAMPO VUOTO
              this.titoloView = this.sondaggio['0'].titolo;
              this.titoloToPass = this.sondaggio['0'].titolo;
            }
          }
        }
      ]
    });

    await alert.present();
    //View Dati inseriti dopo click sul popup di modifica titolo. Dal console log ho visto come accedere ai dati ricevuti.
    //this.titoloView = await (await alert.onDidDismiss()).data.values.titolo;
  }

  //Pop-up Conferma Modifiche
  async popupConfermaModificheSondaggio() {
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



          }
        }
      ],
    });

    await alert.present();
    let result = await alert.onDidDismiss();
  }

  //PICKER Timer
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
    this.timerSettings.forEach(x => {
      options.push({ text: x, value: x });
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


  async countDown(incAnno, incMese, incGG, incHH, incMM) {

    var auxData = []; //get dati dal sondaggio
    auxData['0'] = (this.sondaggio['0'].dataeora.substring(0, 10).split("-")[0]); //anno
    auxData['1'] = this.sondaggio['0'].dataeora.substring(0, 10).split("-")[1]; //mese [0]=gennaio
    auxData['2'] = this.sondaggio['0'].dataeora.substring(0, 10).split("-")[2]; //gg
    auxData['3'] = this.sondaggio['0'].dataeora.substring(11, 18).split(":")[0]; //hh
    auxData['4'] = this.sondaggio['0'].dataeora.substring(11, 18).split(":")[1]; //mm

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
      document.getElementById("timeLeft").innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

      this.timerView = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

      // Se finisce il countDown viene mostrato "Sondaggio scaduto."
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("timeLeft").innerHTML = "Sondaggio scaduto.";
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


  async presentAlert() { // Funzione per mostrare a video finestrina che specifica "l'errore"
    const alert = await this.alertController.create({
      header: 'Sondaggio modificato',
      message: 'Il tuo sondaggio scadrà tra:' + this.timerView ,
      buttons: [
        {
          text: "OK",
          role: 'ok'
        },
        {
          text: 'Ok',
          handler: (value: any) => {

            //Porta a "visualizza sondaggio" dopo avvenuta modifica
            this.navCtrl.navigateRoot('/visualizza-sondaggio');

          }
        }
      ],
    });

    await alert.present();
  }
  /*
  Trasforma in linguaggio umanizzato, aggiunta per prove. Potrebbe tornare utile. Non eliminare.
  parseMillisecondsIntoReadableTime(milliseconds) {
    //da millis a hh
    var hours = milliseconds / (1000 * 60 * 60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

    //Trasformo resto in mm
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

    //Trasformo resto in ss
    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;


    return h + ':' + m + ':' + s;
  }
 */
}