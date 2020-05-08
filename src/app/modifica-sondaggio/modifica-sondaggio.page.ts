import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { ApiService } from 'src/app/providers/api.service';

//Picker - import e poi definire nel constructor
import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";

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

  constructor(private alertController: AlertController, public apiService: ApiService, private pickerController: PickerController) { }


  ngOnInit() {
    //Assegnazione codice forzata per ora
    this.codice_sondaggio = 14;


    this.showSurvey();

  }

  async modify() {

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
        this.titoloView = this.sondaggio['0'].titolo; //setto var da visualizzare a video per risolvere il problema del crop schermo durante il serve dell'app ( problema stava nell'utilizzo di: ['0'] per accedere alla var da visualizzare)
        this.timerView = this.sondaggio['0'].timer;;
        console.log('Sondaggio: ', this.sondaggio['0']);
        //il json di risposta della chiamata è così impostato-> Sondaggio: data: posizione{vari paramentri}
        //bisogna quindi accedere alla posizione del sondaggio da visualizzare
        //in apiservice accediamo già alla posizione 'Sondaggio'. Per sapere l'ordine di accesso ai dati ho stampato a video "data" da apiservice

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
          }
        }
      ]
    });

    await alert.present();
    //View Dati inseriti dopo click sul popup di modifica titolo. Dal console log ho visto come accedere ai dati ricevuti.
    //this.titoloView = await (await alert.onDidDismiss()).data.values.titolo;
  }

  //Pop-up Conferma Eliminazione
  async popupConfermaEliminaSondaggio() {
    const alert = await this.alertController.create({
      header: 'Elimina sondaggio',
      message: 'Sicuro di voler eliminare questo sondaggio?',
      buttons: [
        {
          text: 'Elimina',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //TODO - Mettere qui funzione rimozione sondaggio passandogli il codice del sondaggio da rimuovere
            /* this.apiService.rimuoviSondaggio(this.codice_sondaggio); */
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  //Pop-up Conferma Modifiche
  async popupConfermaModificheSondaggio() {
    const alert = await this.alertController.create({
      header: 'Conferma modifiche',
      message: 'Vuoi confermare le modifiche effettuate?',
      buttons: ['Conferma'],
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    //console.log(result.data);
    //LANCIO SERVIZIO MODIFICA UNA VOLTA CLICCATO "CONFERMA"
    this.modify();
  }

  //PICKER PROVA
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
            console.log(value);

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
    switch (valueToMapp) {
      case (this.timerSettings['0']):
        this.timerToPass = "00:05";
        break;
      case (this.timerSettings['1']):
        this.timerToPass = "00:15";
        break;
      case (this.timerSettings['2']):
        this.timerToPass = "00:30";
        break;
      case (this.timerSettings['3']):
        this.timerToPass = "01:00";
        break;
      case (this.timerSettings['4']):
        this.timerToPass = "03:00";
        break;
      case (this.timerSettings['5']):
        this.timerToPass = "06:00";
        break;
      case (this.timerSettings['6']):
        this.timerToPass = "12:00";
        break;
      case (this.timerSettings['7']):
        this.timerToPass = "24:00";
        break;
      case (this.timerSettings['8']):
        this.timerToPass = "72:00";
        break;
    }


  }
}
