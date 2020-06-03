import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';
import { DataService } from "../services/data.service";
import { ApiService } from 'src/app/providers/api.service';
import { NavController } from '@ionic/angular';
import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";
import { ToastController } from '@ionic/angular';

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

  profilo = {};

  timerSettings: string[] = ["5 min", "15 min", "30 min", "1 ora", "3 ore", "6 ore", "12 ore", "1 giorno", "3 giorni"];
  
  constructor( private dataService: DataService, 
    public alertController: AlertController,
    public apiService: ApiService, 
    private pickerController: PickerController,
    public toastController: ToastController) { }
 
  ngOnInit() {
    //this.email = 'gmailverificata';
    //this.username = 'prova modifica';
    //this.password = 'prova modifica'
    //this.nome = 'prova modifica';
    //this.cognome = 'prova modifica';
    //this.bio = 'prova modifica';
    this.showSurvey();
  }

  async modify() {

    if( this.usernameToPass == null) {
      this.usernameToPass = this.usernameView;
    }
    if (this.nomeToPass == null) {
      this.nomeToPass = this.nomeView;
    }

    if (this.cognomeToPass == null) {
      this.cognomeToPass = this.cognomeView;
    }
    
    if (this.bioToPass == null) {
      this.bioToPass = this.bioView;
    }
    if (this.stringUsernameLengthChecker()) {
      this.popupInvalidUsername();
    } else if (this.stringNameLengthChecker()) {
      this.popupInvalidName();
    } else if (this.stringCognomeLengthChecker()) {
      this.popupInvalidSurname();
    } else if (this.stringBioLengthChecker()) {
      this.popupInvalidBio();
    } else {
    this.apiService.modificaProfilo(this.usernameToPass, this.password, this.nomeToPass, this.cognomeToPass, this.bioToPass, this.email).then(
      (result) => { 
        console.log('Modifica avvenuta con successo');
      },
      (rej) => {
        console.log('Modifica non effetutata');
  
      }
    );
    }
  }

  stringUsernameLengthChecker():boolean {
    if ((this.usernameToPass.length > 20) || !(this.usernameToPass.match(/[a-zA-Z0-9_]+/))) {
      return true;
    } else {
      return false;
    }
  }
  stringNameLengthChecker(): boolean {

    if ((this.nomeToPass.length > 20) || !(this.nomeToPass.match(/[a-zA-Z0-9_]+/))) {
      return true;
    } else {
      return false;
    }
  }
  stringCognomeLengthChecker(): boolean {

    if ((this.cognomeToPass.length > 20) || !(this.cognomeToPass.match(/[a-zA-Z0-9_]+/))) {
      return true;
    } else {
      return false;
    }
  }
  stringBioLengthChecker(): boolean {

    if ((this.bioToPass.length > 200) || !(this.bioToPass.match(/[a-zA-Z0-9_]+/))) {
      return true;
    } else {
      return false;
    }
  }
  async popupInvalidUsername(){
    const toast = document.createElement('ion-toast');
    toast.message = 'ERRORE! Hai lasciato l username vuoto o hai superato la lunghezza massima!';
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.color = 'danger';
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
    return toast.present();
  }
async popupInvalidName(){
  const toast = document.createElement('ion-toast');
  toast.message = 'ERRORE! Hai lasciato il nome vuoto o hai superato la lunghezza massima!';
  toast.duration = 2000;
  toast.position = "top";
  toast.style.fontSize = '20px';
  toast.color = 'danger';
  toast.style.textAlign = 'center';
  document.body.appendChild(toast);
  return toast.present();
}
async popupInvalidSurname(){
  const toast = document.createElement('ion-toast');
  toast.message = 'ERRORE! Hai lasciato il cognome vuoto o hai superato la lunghezza massima!';
  toast.duration = 2000;
  toast.position = "top";
  toast.style.fontSize = '20px';
  toast.color = 'danger';
  toast.style.textAlign = 'center';
  document.body.appendChild(toast);
  return toast.present();
}
async popupInvalidBio(){
  const toast = document.createElement('ion-toast');
  toast.message = 'ERRORE! Hai lasciato la bio vuota o hai superato la lunghezza massima!';
  toast.duration = 2000;
  toast.position = "top";
  toast.style.fontSize = '20px';
  toast.color = 'danger';
  toast.style.textAlign = 'center';
  document.body.appendChild(toast);
  return toast.present();
}




  async showSurvey() {
    this.email = this.dataService.email;
    this.apiService.getProfilo(this.email).then(
      (profilo) => {
        console.log('Visualizzato con successo');

        this.profilo = profilo['data']; //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
        
        this.usernameView = this.profilo['0'].username;
        this.nomeView = this.profilo['0'].nome;
        this.cognomeView = this.profilo['0'].cognome;
        this.bioView = this.profilo['0'].bio;
        this.password = this.profilo['0'].password;
        console.log('Profilo: ', this.profilo['0']);
        
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  async popupModificaUsername() {
    const alert = await this.alertController.create({
      header: 'Modifica username',
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

            if (insertedData.usernamePopUp == "") { //CHECK CAMPO VUOTO
              this.usernameView = this.profilo['0'].username;
              this.usernameToPass = this.profilo['0'].username;
            }
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
      header: 'Modifica nome',
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
            this.usernameView = this.profilo['0'].nome; //annullo modifiche
            console.log('Confirm cancel');
          }
        }, {
          text: 'Ok',
          handler: insertedData => {
            console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
            this.nomeView = insertedData.nomePopUp; 
            this.nomeToPass = insertedData.nomePopUp;

            if (insertedData.nomePopUp == "") { //CHECK CAMPO VUOTO
              this.nomeView = this.profilo['0'].nome;
              this.nomeToPass = this.profilo['0'].nome;
            }
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
      header: 'Modifica cognome',
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
            this.usernameView = this.profilo['0'].cognome; //annullo modifiche
            console.log('Confirm cancel');
          }
        }, {
          text: 'Ok',
          handler: insertedData => {
            console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
            this.cognomeView = insertedData.cognomePopUp; 
            this.cognomeToPass = insertedData.cognomePopUp;

            if (insertedData.cognomePopUp == "") { //CHECK CAMPO VUOTO
              this.cognomeView = this.profilo['0'].cognome;
              this.cognomeToPass = this.profilo['0'].cognome;
            }
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
      header: 'Modifica bio',
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

            if (insertedData.bioPopUp == "") { //CHECK CAMPO VUOTO
              this.bioView = this.profilo['0'].bio;
              this.bioToPass = this.profilo['0'].bio;
            }
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

            this.presentAlert();

          }
        }
      ],
    });
   
    await alert.present();
    let result = await alert.onDidDismiss();
  }

  async presentAlert() { // Funzione per mostrare a video finestrina che specifica "l'errore"
    const alert = await this.alertController.create({
      header: 'Modifica effettuaTa',
      message: 'Il profilo è stato modificato con successo',
      buttons: [

        {
          text: 'Ok',
          handler: (value: any) => {

          }
        }
      ],
    });

    await alert.present();
  }

}
