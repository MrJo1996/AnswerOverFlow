import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";
import { AlertController, MenuController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api.service';
import { Chart } from 'chart.js';
import { NavController } from "@ionic/angular";
import { DataService } from '../services/data.service';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-visualizza-profilo',
  templateUrl: './visualizza-profilo.page.html',
  styleUrls: ['./visualizza-profilo.page.scss'],
})
export class VisualizzaProfiloPage implements OnInit {


  ngOnInit() { }
  ionViewWillEnter() {
    //visualizza frame caricamento

    this.userProfileId = this.dataService.getEmailOthers();
    this.userId = this.dataService.getEmail_Utente();
    console.log("JOOOOOOO", this.userId);
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 800;
    document.body.appendChild(loading);
    loading.present();




    //console.log(this.userProfileId);
    setTimeout(() => {
      if (window.location.pathname === '/visualizza-profiloutente') {
        this.selectProfile(this.userId);
      } else {
        this.selectProfile(this.userProfileId);
      }
    }, 800)

  }


  request: Promise<any>;
  result: Promise<any>;
  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaProfilo'

  constructor(
    private router: Router,
    private alertController: AlertController,
    private apiService: ApiService,
    private navCtrl: NavController,
    private dataService: DataService,
    private storage: Storage,
    private menuCrtl: MenuController

  ) {

    this.userProfileId = this.dataService.getEmailOthers();
    this.userId = this.dataService.getEmail_Utente();

  }



  goBack() {
    //visualizza frame caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3500;
    document.body.appendChild(loading);
    loading.present();

    this.navCtrl.back();
  }

  goToChat() {
    //visualizza frame caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 1500;
    document.body.appendChild(loading);
    loading.present();

    this.dataService.emailOthers = this.profilo.email;
    this.router.navigateByUrl("/chat");
  }

  stats() {
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 2500;
    document.body.appendChild(loading);
    loading.present();

    this.dataService.emailOthers = this.profilo.email;
    this.router.navigate(['visualizza-statistiche']);
  }


  userProfileId: string;
  userId: string;
  profilo: any;
  segnalazione: string;
  selectedProfile: string;
  selectId


  async selectProfile(id) {

    console.log(this.userProfileId + " userIDProfilo");
    console.log(this.userId + " userID");
    console.log(id + " fiofifoifo");

    this.apiService.getProfilo(id).then(
      (data) => {
        console.log('Visualizzato con successo');
        this.profilo = data['data'][0];
        console.log(this.profilo)
        this.selectId = this.profilo.email
        //console.log(this.profilo.bio);

      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }


  segnalaUtente() {

    this.apiService.segnala_utente(this.segnalazione, this.profilo.username, this.profilo.email).then(
      (result) => {
        console.log("Segnalazione inviata con successo")
        this.toast("Segnalazione inviata.", "success");
      }, (rej) => {
        console.log("Invio segnalazione non riuscito")
        this.toast("Segnalazione non riuscita, riprovare.", "danger");

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
            this.segnalazione = " Spam"
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
          placeholder: 'Segnala utente',
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
          handler: (res) => {
            this.segnalazione = res.Segnala;
            this.segnalaUtente();
            console.log('Invia segnalazione: altro:', res.Segnala);
          }
        }
      ]
    });
    await alert.present();
  }


  goToHome() {
    //visualizza frame caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3500;
    document.body.appendChild(loading);
    loading.present();

    this.router.navigate(['/home'])
  }


  goToSettingProfile() {
    //visualizza frame caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 1000;
    document.body.appendChild(loading);
    loading.present();

    this.router.navigate(['/modifica-profilo'])
  }


  openMenu() {
    this.menuCrtl.open()
    console.log(this.menuCrtl.swipeGesture.length)
  }


  toast(txt: string, color: string) {
    const toast = document.createElement("ion-toast");
    toast.message = txt;
    toast.duration = 2000;
    toast.position = "top";
    toast.color = color;
    document.body.appendChild(toast);
    return toast.present();
  }

}
