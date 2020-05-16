import { Component, OnInit } from '@angular/core';

import {Router} from "@angular/router";
import { AlertController} from '@ionic/angular';
import { ApiService } from 'src/app/providers/api.service'; 
import { Chart } from 'chart.js';
import {NavController} from "@ionic/angular";


@Component({
  selector: 'app-visualizza-profilo',
  templateUrl: './visualizza-profilo.page.html',
  styleUrls: ['./visualizza-profilo.page.scss'],
})
export class VisualizzaProfiloPage implements OnInit {

  
  
  request: Promise<any>;
  result:  Promise<any>;
  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaProfilo'

  constructor(
    private alertController: AlertController,
    private apiService: ApiService,
    private navCtrl: NavController
    
    ){

     }

  ngOnInit() {
    this.selectProfile();
  }


  goBack(){
    this.navCtrl.back();
  }


  profilo: any;
  UserProfileViewId = "gmailverificata";
  Username = 'giotto';
  Email = 'matitinaCom'; //matitinaCom
  Nome = 'giovanni';
  Cognome = 'otto';
  Bio = 'disegno cazzi sui muri';
 

  
  async selectProfile() {
   /*  this.apiService.getProfilo(this.Email).then(
      (data) => {
        console.log('Visualizzato con successo');
        console.log(data);
        this.profilo = data[0];
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    ); */
  }


  segnalaUtente(){
    
        this.apiService.segnala_utente("giogiogio","piopiopio","nonononon").then(
          (result)=>{
            console.log("Segnalazione inviata con successo")
          }, (rej)=>{
            console.log("Invio segnalazione non riuscito")
          }
        );
      } 
    






async showAlertView() {
  const alert = await this.alertController.create({
    header: 'Segnale Utente',
    message: 'Per cosa vuoi segnalare questo utente?',
    buttons: [
      {
        text: 'Spam',
        cssClass: 'secondary',
        handler: () => {
          this.confirmSpamAlert();
          console.log('Conferma segnalazione: spam');
          console.log("provaprova");
        }
      }, {
        text: 'Altro',
        handler: () => {
          console.log('Carica alert "altro" ');
          this.confirmAboutAlert();
        }
      }
    ]
  });
  await alert.present();
}


async confirmSpamAlert() {
  const alert = await this.alertController.create({
    header: 'Segnale Utente',
    message: 'Confermi segnalazione di questo utente per spam?',
    animated: false,
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        handler: () => {
          console.log('Nega segnalazione: spam');
        }
      }, {
        text: 'Si',
        handler: () => {
          console.log('Invia segnalazione: spam');
          this.segnalaUtente();
        }
      }
    ]
  });
  await alert.present();
}

async confirmAboutAlert() {
  const alert = await this.alertController.create({
    header: 'Segnale Utente',
    message: 'Segnala utente per: ',
    animated: false,
    inputs: [
      {
        name: 'Segnala',
        type: 'textarea',
        placeholder:'Segnala utente',        
      }
    ],
    buttons: [
      {
        text: 'Chiudi',
        role: 'cancel',
        handler: () => {
          console.log('Nega segnalazione: altro');
        }
      }, {
        text: 'Conferma',
        handler: () => {
          console.log('Invia segnalazione: altro');
        }
      }
    ]
  });
  await alert.present();
}




}
