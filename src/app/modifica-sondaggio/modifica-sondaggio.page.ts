import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { ApiService } from 'src/app/providers/api.service';


@Component({
  selector: 'app-modifica-sondaggio',
  templateUrl: './modifica-sondaggio.page.html',
  styleUrls: ['./modifica-sondaggio.page.scss'],
})
export class ModificaSondaggioPage implements OnInit {

  sondaggio = {
    
  };

  codice_sondaggio: number;
  titolo: string;
  timer: string;

  constructor(private alertController: AlertController, public apiService: ApiService) { }


  ngOnInit() {

    this.showSurvey();

    this.timer = '03:20:30';
    this.codice_sondaggio = 13;
  }

  async modify() {

    this.apiService.modificaSondaggio(this.titolo, this.timer, this.codice_sondaggio).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
        /*  this.presentAlert();
         this.goToHome(); */
        console.log('Modifica avvenuta con successo: ',this.titolo,this.timer,this.codice_sondaggio);
      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('Modifica non effetutata');
        /* this.goToHome();
        this.presentAlertNegativo(); */
      }
    );

  }

  async showSurvey() {
    this.apiService.visualizzaSondaggio(this.codice_sondaggio).then(
      (result) => {
        this.sondaggio = result;
        console.log(this.codice_sondaggio);
        console.log(result);
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
          name: 'titolo',
          type: 'text',
          placeholder: this.titolo
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            //prendi titolo this.titolo=titolo scritto
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  //Pop-up Timer
  async popupModificaTimer() {
    const alert = await this.alertController.create({
      header: 'Modifica',
      inputs: [
        {
          name: 'name1',
          type: 'time',
          placeholder: 'Timer'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  //Pop-up Conferma Eliminazione
  async popupConfermaEliminaSondaggio() {
    const alert = await this.alertController.create({
      header: 'Elimina sondaggio',
      message: 'Sicuro di voler eliminare questo sondaggio?',
      buttons: ['Conferma']
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
      buttons: ['Conferma']
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
    console.log("CIAOOOOO");
    
    //LANCIO SERVIZIO MODIFICA UNA VOLTA CLICCATO "CONFERMA"
    this.modify();
  
  
  }

}
