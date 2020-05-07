import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';

import { ApiService } from 'src/app/providers/api.service';

@Component({
  selector: 'app-modifica-domanda',
  templateUrl: './modifica-domanda.page.html',
  styleUrls: ['./modifica-domanda.page.scss'],
})
export class ModificaDomandaPage implements OnInit {
  codice_domanda: number;
  dataeora: string;
  timer: string;
  titolo: string;
  descrizione: string;
  cod_categoria: number;
 
  request: Promise<any>;
  result: Promise<any>; 

  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/modificaDomanda'; 

  constructor(public alertController: AlertController, public apiService: ApiService) { }

  ngOnInit() {
    this.cod_categoria = 2;
    this.dataeora = '10:20:20';
    this.codice_domanda = 5;
    this.timer = '00:20:00';
    this.descrizione = "Io non ho un cane";
    this.titolo = "PROVA MODIFICA";
  }

  async modify() {

    this.apiService.modificaDomanda(this.codice_domanda, this.dataeora, this.timer, this.titolo, this.descrizione, this.cod_categoria).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
         // this.presentAlert();
         //this.goToHome(); 
        console.log('Modifica avvenuta con successo: ',this.codice_domanda, this.dataeora, this.timer, this.titolo, this.descrizione, this.cod_categoria);
      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('Modifica non effetutata');
        /* this.goToHome();
        this.presentAlertNegativo(); */
      }
    );

  }

  async popupModificaTitolo() {
    const alert = await this.alertController.create({
      header: 'Modifica',
      inputs: [
        {
          name: 'Titolo',
          type: 'text',
          placeholder: 'Nuovo titolo'
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

  async popupModificaDescrizione() {
    const alert = await this.alertController.create({
      header: 'Modifica',
      inputs: [
        {
          name: 'Descrizione',
          type: 'text',
          placeholder: 'Nuova descrizione'
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
      buttons: ['Conferma']
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
    console.log("PROVA");

    this.modify();
  }


}
