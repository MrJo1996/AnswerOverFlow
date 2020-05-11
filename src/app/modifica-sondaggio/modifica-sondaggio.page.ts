import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { ApiService } from 'src/app/providers/api.service';

//Picker - import e poi definire nel constructor
import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";

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
  public SCAD;
  constructor(private alertController: AlertController, public apiService: ApiService, private pickerController: PickerController,
    public navCtrl: NavController) { }


  ngOnInit() {

    //Assegnazione codice forzata per ora
    this.codice_sondaggio = 18;

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

        var auxData = []; //var ausialiaria per parsare la data di creazione
        auxData['0'] = (this.sondaggio['0'].dataeora.substring(0, 10).split("-")[0]); //anno
        auxData['1'] = this.sondaggio['0'].dataeora.substring(0, 10).split("-")[1]; //mese [0]=gennaio
        auxData['2'] = this.sondaggio['0'].dataeora.substring(0, 10).split("-")[2]; //gg
        auxData['3'] = this.sondaggio['0'].dataeora.substring(11, 18).split(":")[0]; //hh
        auxData['4'] = this.sondaggio['0'].dataeora.substring(11, 18).split(":")[1]; //mm
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
  }

  //Pop-up Conferma Modifiche
  async popupConfermaModificheSondaggio() {
    var header = "Conferma modifiche";
    var message = "Vuoi confermare le modifiche effettuate?";
    
    console.log("da mod: ", this.SCAD);
   
    /* if (this.SCAD) {
      header = "Sondaggio scaduto";
      message = "Impossibile modificare, sondaggio scaduto.";
    } */

    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: "Annulla",
          role: 'cancel'
        },
        {
          text: 'Conferma',
          handler: (value: any) => {
            //LANCIO SERVIZIO MODIFICA UNA VOLTA CLICCATO "CONFERMA" e se non è scaduto il countdown
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

    //Check dei valori ammissibili da mostrare nel picker in base all'orario di creazione del sondaggio
    var auxDataPicker = []; //get dati dal sondaggio
    auxDataPicker['0'] = (this.sondaggio['0'].dataeora.substring(0, 10).split("-")[0]); //anno
    auxDataPicker['1'] = this.sondaggio['0'].dataeora.substring(0, 10).split("-")[1]; //mese [0]=gennaio
    auxDataPicker['2'] = this.sondaggio['0'].dataeora.substring(0, 10).split("-")[2]; //gg
    auxDataPicker['3'] = this.sondaggio['0'].dataeora.substring(11, 18).split(":")[0]; //hh
    auxDataPicker['4'] = this.sondaggio['0'].dataeora.substring(11, 18).split(":")[1]; //mm
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

      //se datasondaggio + incremento maggiore di ora attuale allora è possibile impostare il timer per quella scelta
      // e quindi viene mostrata nel picker aggiungendo la scelta alla lista delle opzioni mostrate
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


   countDown(incAnno, incMese, incGG, incHH, incMM) {

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
      document.getElementById("timeLeft").innerHTML = days + "giorni " + hours + "ore "
        + minutes + "min " + seconds + "s ";
      console.log(distance);

      // Se finisce il countDown viene mostrato "Sondaggio scaduto."
      if (distance < 0) {
        /* this.SCAD = true;
        console.log("SCAD in countdown() ", this.SCAD); */
        clearInterval(x);
        document.getElementById("timeLeft").innerHTML = "Sondaggio scaduto.";
      }
    }, 1000);

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

}