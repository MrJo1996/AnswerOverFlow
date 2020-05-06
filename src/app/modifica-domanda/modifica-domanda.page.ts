import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';

@Component({
  selector: 'app-modifica-domanda',
  templateUrl: './modifica-domanda.page.html',
  styleUrls: ['./modifica-domanda.page.scss'],
})
export class ModificaDomandaPage implements OnInit {

  constructor(public alertController: AlertController) { }

  async popupConfermaModificheDomanda() {
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
