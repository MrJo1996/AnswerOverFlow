import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';

@Component({
  selector: 'app-modifica-risposta',
  templateUrl: './modifica-risposta.page.html',
  styleUrls: ['./modifica-risposta.page.scss'],
})
export class ModificaRispostaPage implements OnInit {

  constructor(public alertController: AlertController) { }

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
  }

  ngOnInit() {
  }

}
