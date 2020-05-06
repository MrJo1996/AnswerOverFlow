import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { Promise } from 'q';

import { PostServiceService } from '../services/post-service.service';

@Component({
  selector: 'app-modifica-sondaggio',
  templateUrl: './modifica-sondaggio.page.html',
  styleUrls: ['./modifica-sondaggio.page.scss'],
})
export class ModificaSondaggioPage implements OnInit {

  codice_sondaggio = 0;
  titolo = '';
  timer = '';
  request: Promise<any>;
  result: Promise<any>;
  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/modificaSondaggio';

  constructor(public alertController: AlertController, public service: PostServiceService) { }

  async popupModificaTitolo() {
    const alert = await this.alertController.create({
      header: 'Modifica',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Titolo'
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

  async popupConfermaModificheSondaggio() {
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

  public postModificaSondaggio() {

    let postData = {
      'titolo': this.titolo,
      'timer': this.timer,
      'codice_sondaggio': this.codice_sondaggio
    };

    this.result = this.service.postService(postData, this.url).then((data) => {
      this.result = data;
      console.log(data);
    }, err => {
      console.log(err.message);
    });
  }

}
