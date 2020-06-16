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

    this.session = this.dataService.getSession()
    this.dataService.loadingView(5000);//visualizza il frame di caricamento
    this.userProfileId = this.dataService.getEmailOthers();
    this.userId = this.dataService.getEmail_Utente();
   
    
   
    setTimeout(() => {
      this.pagePath = window.location.pathname;
      if (this.pagePath === '/visualizza-profiloutente') {
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
    this.dataService.loadingView(5000);//visualizza il frame di caricamento
    this.navCtrl.back();
  }

  goToChat() {
    if(this.session === true){
    this.dataService.loadingView(3000);//visualizza il frame di caricamento
    this.dataService.emailOthers = this.profilo.email;
    this.router.navigateByUrl("/chat");
  }else{
    this.viewToast("Effettua il login", 'danger')
  }

  }

  stats() {
    this.dataService.loadingView(3000);//visualizza il frame di caricamento
    this.dataService.emailOthers = this.profilo.email;
    this.router.navigate(['visualizza-statistiche']);
  }


  userProfileId: string;
  userId: string;
  profilo: any;
  segnalazione: string;
  selectedProfile: string;
  selectId
  pagePath
  session


  async selectProfile(id) {

   

    this.apiService.getProfilo(id).then(
      (data) => {
        this.profilo = data['data'][0];
        this.selectId = this.profilo.email

      },
      (rej) => {
      }
    );
  }


  segnalaUtente() {

    this.apiService.segnala_utente(this.segnalazione, this.profilo.username, this.profilo.email).then(
      (result) => {
        this.viewToast("Segnalazione inviata.", "success");
      }, (rej) => {
        this.viewToast("Segnalazione non riuscita, riprovare.", "danger");

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

          }
        }, {
          text: 'Altro',
          handler: () => {
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
          }
        }, {
          text: 'Si',
          handler: () => {
            this.segnalazione = " Spam"
            if(this.session === true)
            this.segnalaUtente();
            else
            this.viewToast("Effettua il login", "danger")
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
          }
        }, {
          text: 'Conferma',
          handler: (res) => {
            this.segnalazione = res.Segnala;
            if(this.session === true){ 
              if ((this.segnalazione.length > 100) || !(this.segnalazione.match(/[a-zA-Z0-9_]+/))){
                this.viewToast('campo vuoto','danger')                          
              }else{
                this.segnalaUtente();
              } 
            }else{
              this.viewToast('Effettua il login','danger')                          
            }
          }
        }
      ]
    });
    await alert.present();
  }


  goToHome() {
    this.dataService.loadingView(5000);//visualizza il frame di caricamento
    this.router.navigate(['/home'])
  }


  goToSettingProfile() {
    this.dataService.loadingView(3000);//visualizza il frame di caricamento
    this.router.navigate(['/modifica-profilo'])
  }


  openMenu() {
    this.menuCrtl.open()
  }


  viewToast(txt: string, color: string) {
    const toast = document.createElement("ion-toast");
    toast.message = txt;
    toast.duration = 2000;
    toast.position = "top";
    toast.color = color;
    document.body.appendChild(toast);
    return toast.present();
  }




  

}
