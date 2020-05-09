import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';

import { ApiService } from 'src/app/providers/api.service';

import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";

@Component({
  selector: 'app-modifica-profilo',
  templateUrl: './modifica-profilo.page.html',
  styleUrls: ['./modifica-profilo.page.scss'],
})
export class ModificaProfiloPage implements OnInit {
  email: string;
  
  /*username: string;
  password: string;
  nome: string;
  cognome: string;
  bio: string;
  */
password: string;
  usernameToPass: string;
  nomeToPass: string;
  cognomeToPass: string;
  bioToPass: string;

  usernameView: string;
  nomeView: string;
  cognomeView: string;
  bioView: string;

  /*request: Promise<any>;
  result: Promise<any>; 

  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/modificaProfilo'; 
  */

  profilo = {};

  timerSettings: string[] = ["5 min", "15 min", "30 min", "1 ora", "3 ore", "6 ore", "12 ore", "1 giorno", "3 giorni"];
  constructor(public alertController: AlertController,public apiService: ApiService, private pickerController: PickerController) { }
 
  ngOnInit() {
    this.email = 'gmailverificata';
    //this.username = 'prova modifica';
    this.password = 'prova modifica'
    //this.nome = 'prova modifica';
    //this.cognome = 'prova modifica';
    //this.bio = 'prova modifica';
    this.showSurvey();
  }

  async modify() {

    this.apiService.modificaProfilo(this.usernameToPass, this.password, this.nomeToPass, this.cognomeToPass, this.bioToPass, this.email).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
         // this.presentAlert();
         //this.goToHome(); 
        //console.log('Modifica avvenuta con successo: ',this.username, this.password, this.nome, this.cognome, this.bio, this.email);
      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('Modifica non effetutata');
        /* this.goToHome();
        this.presentAlertNegativo(); */
      }
    );

  }

  async showSurvey() {
    this.apiService.getProfilo(this.email).then(
      (profilo) => {
        console.log('Visualizzato con successo');

        this.profilo = profilo['data']; //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
        
        this.usernameView = this.profilo['0'].username;
        this.nomeView = this.profilo['0'].nome;
        this.cognomeView = this.profilo['0'].cognome;
        this.bioView = this.profilo['0'].bio;
        console.log('Profilo: ', this.profilo['0']);
        //il json di risposta della chiamata è così impostato-> Sondaggio: data: posizione{vari paramentri}
        //bisogna quindi accedere alla posizione del sondaggio da visualizzare
        //in apiservice accediamo già alla posizione 'Sondaggio'. Per sapere l'ordine di accesso ai dati ho stampato a video "data" da apiservice

      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  async popupModificaUsername() {
    const alert = await this.alertController.create({
      header: 'Modifica',
      inputs: [
        {
          name: 'usernamePopUp',
          type: 'text',
          placeholder: this.usernameView //risposta del servizio visualizzaProfilo
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.usernameView = this.profilo['0'].username; //annullo modifiche
            console.log('Confirm cancel');
          }
        }, {
          text: 'Ok',
          handler: insertedData => {
            console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
            this.usernameView = insertedData.usernamePopUp; 
            this.usernameToPass = insertedData.usernamePopUp;
          }
        }
      ]
    });

    await alert.present();
    //View Dati inseriti dopo click sul popup di modifica username. Dal console log ho visto come accedere ai dati ricevuti.
    //this.titoloView = await (await alert.onDidDismiss()).data.values.titolo;
  }

  async popupModificaNome() {
    const alert = await this.alertController.create({
      header: 'Modifica',
      inputs: [
        {
          name: 'nomePopUp',
          type: 'text',
          placeholder: this.nomeView //risposta del servizio visualizzaProfilo
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.nomeView = this.profilo['0'].nome; //annullo modifiche
            console.log('Confirm cancel');
          }
        }, {
          text: 'Ok',
          handler: insertedData => {
            console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
            this.nomeView = insertedData.nomePopUp; 
            this.nomeToPass = insertedData.nomePopUp;
          }
        }
      ]
    });

    await alert.present();
    //View Dati inseriti dopo click sul popup di modifica username. Dal console log ho visto come accedere ai dati ricevuti.
    //this.titoloView = await (await alert.onDidDismiss()).data.values.titolo;
  }

  async popupModificaCognome() {
    const alert = await this.alertController.create({
      header: 'Modifica',
      inputs: [
        {
          name: 'cognomePopUp',
          type: 'text',
          placeholder: this.cognomeView //risposta del servizio visualizzaProfilo
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.cognomeView = this.profilo['0'].cognome; //annullo modifiche
            console.log('Confirm cancel');
          }
        }, {
          text: 'Ok',
          handler: insertedData => {
            console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
            this.cognomeView = insertedData.cognomePopUp; 
            this.cognomeToPass = insertedData.cognomePopUp;
          }
        }
      ]
    });

    await alert.present();
    //View Dati inseriti dopo click sul popup di modifica username. Dal console log ho visto come accedere ai dati ricevuti.
    //this.titoloView = await (await alert.onDidDismiss()).data.values.titolo;
  }

  async popupModificaBio() {
    const alert = await this.alertController.create({
      header: 'Modifica',
      inputs: [
        {
          name: 'bioPopUp',
          type: 'text',
          placeholder: this.bioView //risposta del servizio visualizzaProfilo
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.bioView = this.profilo['0'].bio; //annullo modifiche
            console.log('Confirm cancel');
          }
        }, {
          text: 'Ok',
          handler: insertedData => {
            console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
            this.bioView = insertedData.bioPopUp; 
            this.bioToPass = insertedData.bioPopUp;
          }
        }
      ]
    });

    await alert.present();
    //View Dati inseriti dopo click sul popup di modifica username. Dal console log ho visto come accedere ai dati ricevuti.
    //this.titoloView = await (await alert.onDidDismiss()).data.values.titolo;
  }

  async popupConfermaModificaProfilo() {
    const alert = await this.alertController.create({
      header: 'Conferma modifiche',
      message: 'Vuoi confermare le modifiche effettuate?',
      buttons: ['Conferma']
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    //console.log(result);
    //console.log("PROVA");

    this.modify();
  }

  

  

}
