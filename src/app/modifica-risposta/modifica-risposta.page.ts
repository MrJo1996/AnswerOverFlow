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
  
  descrizioneToPass: string; //param per le funzioni

  descrizioneView; //var per le view dei valori

  risposta = {};

  constructor(public alertController: AlertController,public apiService: ApiService ) { }


  ngOnInit() {

    this.codice_risposta = 6;
  
    this.showResponse();
    }

  async showResponse() {
    this.apiService.getRisposta(this.codice_risposta).then(
      (risposta) => {
        console.log('Visualizzato con successo');

        this.risposta = risposta['data']; //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
        this.descrizioneView = this.risposta['0'].descrizione; //setto var da visualizzare a video per risolvere il problema del crop schermo durante il serve dell'app ( problema stava nell'utilizzo di: ['0'] per accedere alla var da visualizzare)
        console.log('Risposta: ', this.risposta['0']);
        //il json di risposta della chiamata è così impostato-> Risposta: data: posizione{vari paramentri}
        //bisogna quindi accedere alla posizione del sondaggio da visualizzare
        //in apiservice accediamo già alla posizione 'Sondaggio'. Per sapere l'ordine di accesso ai dati ho stampato a video "data" da apiservice

      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  async popupModificaDescrizione() {
    const alert = await this.alertController.create({
      header: 'Modifica',
      inputs: [
        {
          name: 'descrizionePopUp',
          type: 'text',
          placeholder: this.descrizioneView //risposta del servizio visualizzarisposta
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.descrizioneView = this.risposta['0'].descrizione; //annullo modifiche
            console.log('Confirm cancel');
          }
        }, {
          text: 'Ok',
          handler: insertedData => {
            console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
            this.descrizioneView = insertedData.descrizionePopUp; //setto descrizioneView al valore inserito nel popUp una volta premuto ok così viene visualizzato
            this.descrizioneToPass = insertedData.descrizionePopUp; //setto descrizioneToPass al valore inserito nel popUp una volta premuto ok
          }
        }
      ]
    });

    await alert.present();
    //View Dati inseriti dopo click sul popup di modifica descrizione. Dal console log ho visto come accedere ai dati ricevuti.
    //this.descrizioneView = await (await alert.onDidDismiss()).data.values.descrizione;
  }

  async popupConfermaEliminaRisposta() {
    const alert = await this.alertController.create({
      header: 'Elimina risposta',
      message: 'Sicuro di voler eliminare questa risposta?',
      buttons: [
        {
          text: 'Elimina',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //TODO - Mettere qui funzione rimozione risposta passandogli il codice del risposta da rimuovere
            /* this.apiService.rimuoviRisposta(this.codice_risposta); */
          }
        }
      ]
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
    //console.log(result);

    this.modify();
  }

  async modify() {

    this.apiService.modificaRisposta(this.codice_risposta, this.descrizioneToPass).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('Modifica non effetutata'); //anche se va nel rej va bene, modifiche effettive nel db
      }
    );

  }

}
