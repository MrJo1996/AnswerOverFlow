import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { ApiService } from 'src/app/providers/api.service';

@Component({
  selector: 'app-modifica-sondaggio',
  templateUrl: './modifica-sondaggio.page.html',
  styleUrls: ['./modifica-sondaggio.page.scss'],
})
export class ModificaSondaggioPage implements OnInit {



  codice_sondaggio: number;
  titolo: string;
  timer: string;

  sondaggio = {}; //conterrà tutti i dati del sondaggio da visualizzare

  constructor(private alertController: AlertController, public apiService: ApiService) { }


  ngOnInit() {
/*     this.titolo = 'test modificasondaggio';
    this.timer = '03:20:30'; */

    //Assegnazione forzata per ora
    this.codice_sondaggio = 14;
    
    
    this.showSurvey();

  }

  async modify() {

    this.apiService.modificaSondaggio(this.titolo, this.timer, this.codice_sondaggio).then(
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
    //console.log(result.data);
    //LANCIO SERVIZIO MODIFICA UNA VOLTA CLICCATO "CONFERMA"
    this.modify();
  }

}
