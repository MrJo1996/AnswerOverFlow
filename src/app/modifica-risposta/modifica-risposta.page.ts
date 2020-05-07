import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';

import { ApiService } from 'src/app/providers/api.service';

@Component({
  selector: 'app-modifica-risposta',
  templateUrl: './modifica-risposta.page.html',
  styleUrls: ['./modifica-risposta.page.scss'],
})
export class ModificaRispostaPage implements OnInit {

  codice_risposta: Number;
  descrizione: string;

  constructor(public alertController: AlertController,public apiService: ApiService ) { }

  async popupModificaDescrizione() {
    const alert = await this.alertController.create({
      header: 'Modifica',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Descrizione'
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

  async popupConfermaEliminaRisposta() {
    const alert = await this.alertController.create({
      header: 'Elimina risposta',
      message: 'Sicuro di voler eliminare questa risposta?',
      buttons: ['Conferma']
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  async popupConfermaModificheRisposta() {
    const alert = await this.alertController.create({
      header: 'Conferma modifiche',
      message: 'Vuoi confermare le modifiche effettuate?',
      buttons: ['Conferma']
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);

    this.modify();
  }

  ngOnInit() {

  this.codice_risposta = 6;
  this.descrizione = 'descrzione di prova';
  }


  async modify() {

    this.apiService.modificaRisposta(this.codice_risposta, this.descrizione).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
        /*  this.presentAlert();
         this.goToHome(); */
        console.log('Modifica avvenuta con successo: ',this.codice_risposta, this.descrizione);
      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('Modifica non effetutata');
        /* this.goToHome();
        this.presentAlertNegativo(); */
      }
    );

  }

}
