import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';

@Component({
  selector: 'app-modifica-profilo',
  templateUrl: './modifica-profilo.page.html',
  styleUrls: ['./modifica-profilo.page.scss'],
})
export class ModificaProfiloPage implements OnInit {

  constructor(public alertController: AlertController) { }

  async popupConfermaModificaProfilo() {
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
