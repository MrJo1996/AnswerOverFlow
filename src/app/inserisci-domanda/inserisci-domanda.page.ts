import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/providers/api.service';
import { PostServiceService } from "../Services/post-service.service";
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-inserisci-domanda',
  templateUrl: './inserisci-domanda.page.html',
  styleUrls: ['./inserisci-domanda.page.scss'],
})

export class InserisciDomandaPage implements OnInit {

  titolo = '';
  dataeora;
  timer = '';
  descrizione = '';
  cod_utente= 'gmailverificata';
  cod_categoria = 1;
  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/inserisciDomanda'

  constructor(public apiService: ApiService, public alertController: AlertController) { }

  ngOnInit() {

  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Confermi la domanda?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            console.log('Confirm Okay');
            this.postInvio();
          }
        }
      ]
    });
    await alert.present();
  }

  async postInvio() {
    this.apiService.inserisciDomanda(this.timer, this.titolo, this.descrizione, this.cod_utente, this.cod_categoria).then(
      (result) => { 
         
        console.log('Inserimento avvenuto con successo:', this.titolo, this.timer, this.descrizione, this.cod_utente, this.cod_categoria);
      },
      (rej) => {
        console.log('Inserimento non riuscito!');
        
      }
    );
  }

}
