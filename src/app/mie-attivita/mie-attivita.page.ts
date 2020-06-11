import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { ApiService } from '../providers/api.service';
import { AlertController} from '@ionic/angular';
import { DataService } from "../services/data.service";
import {Router} from '@angular/router';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-mie-attivita',
  templateUrl: './mie-attivita.page.html',
  styleUrls: ['./mie-attivita.page.scss'],
})
export class MieAttivitaPage implements OnInit {

  currentUser;
  domande: any[];
  sondaggi: any;
  check1: boolean;
  check2: boolean;
  domande1g: any[];
  domande1s: any[];
  domande2s: any[];
  domande3s: any[];
  domande1m: any[];
  sondaggi1g: any[];
  sondaggi1s: any[];
  sondaggi2s: any[];
  sondaggi3s: any[];
  sondaggi1m: any[];
  sezione = 'Domande';


  constructor(private navCtrl: NavController, private menuCtrl: MenuController, private apiService: ApiService, private alertController: AlertController, private dataService: DataService, private router: Router, private storage: Storage) { }

  ngOnInit() {
    //Visualizza il frame di caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3500;
    document.body.appendChild(loading);
    loading.present();

    this.storage.get('utente').then( 
      data => { 
        this.currentUser = data.email
       }).then(() => {
        this.visualizzaMieDomande();
        this.visualizzaMieiSondaggi();
       }).then(() => {
        this.check1 = false;
      this.check2 = true;
       })
  }

  ionViewDidEnter() {
  this.storage.get('utente').then( 
    data => { 
      this.currentUser = data.email
     }).then(() => {
      this.visualizzaMieDomande();
      this.visualizzaMieiSondaggi();
     }).then(() => {
      this.check1 = false;
    this.check2 = true;
     })
  }

  ionViewDidLeave() {
    this.currentUser = null;
    this.domande = [];
    this.sondaggi = [];
    console.log('Distrutto');
  }

  goBack(){
    //Visualizza il frame di caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3500;
    document.body.appendChild(loading);
    loading.present();

    this.navCtrl.pop();
  }

  async visualizzaMieDomande() {
    this.apiService.getMieDomande(this.currentUser).then(
      (domanda) => {
        console.log('Visualizzato con successo');

        this.domande = domanda['Domande']['data']; //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
        console.log('Domanda: ', this.domande);

        this.inizializeArrayDomande1g();
      
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  
  }

  async visualizzaMieiSondaggi() {
    this.apiService.getMieiSondaggi(this.currentUser).then(
      (sondaggio) => {
        console.log('Visualizzato con successo');

        this.sondaggi = sondaggio; //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
        console.log('Sondaggi: ', this.sondaggi);

        this.inizializeArraySondaggi1g();
      
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  
  }

  /* async presentAlertRadio() {
    const alert = await this.alertController.create({
      header: 'Vista',
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: 'Domande',
          value: 'value1',
        },
        {
          name: 'radio2',
          type: 'radio',
          label: 'Sondaggi',
          value: 'value2'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            if (data === 'value2') {
            this.check2 = false;
            this.check1 = true;
            this.visualizzaMieiSondaggi();
             } else if (data === 'value1') {
              this.check1 = false;
              this.check2 = true;
              this.visualizzaMieDomande();
             }
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  } */

  checkDataeoraDomande() {
    this.domande1g = [];
    this.domande1s = [];
    this.domande2s = [];
    this.domande3s = [];
    this.domande1m = [];

    if (this.domande===undefined) {
      console.log('Non ci sono domande per questo utente');
    } else {

    for (var i = 0; i < this.domande.length; i++) {
      var data = new Date(this.domande[i].dataeora.toLocaleString());
      var data2 = new Date();
      var diff = (data2.getTime() - data.getTime()) /1000;
      console.log(diff);
      if (diff <= 86400) {
        this.domande1g.push(this.domande[i]);
      }

      if (diff <= 604800) {
        this.domande1s.push(this.domande[i]);
      }

      if (diff <= 1209600) {
        this.domande2s.push(this.domande[i]);
      }

      if (diff <= 1814400) {
        this.domande3s.push(this.domande[i]);
      }

      if (diff <= 2419200) {
        this.domande1m.push(this.domande[i]);
      }
    }

  }
   
    console.log(this.domande1g.length);
    console.log(this.domande1s.length);
    console.log(this.domande2s.length);
    console.log(this.domande3s.length);
    console.log(this.domande1m.length);
  }

  inizializeArrayDomande1g() {
    this.domande1g = [];
    for (var i = 0; i < this.domande.length; i++) {
      var data = new Date(this.domande[i].dataeora.toLocaleString());
      var data2 = new Date();
      var diff = (data2.getTime() - data.getTime()) /1000;
      console.log(diff);
        if (diff <= 86400) {
        this.domande1g.push(this.domande[i]);
      }
    }

    console.log(this.domande1g);
  }

  inizializeArraySondaggi1g() {
    this.sondaggi1g = [];
    for (var i = 0; i < this.sondaggi.length; i++) {
      var data = new Date(this.sondaggi[i].dataeora.toLocaleString());
      var data2 = new Date();
      var diff = (data2.getTime() - data.getTime()) /1000;
      console.log(diff);
        if (diff <= 86400) {
        this.sondaggi1g.push(this.sondaggi[i]);
      }
    }

    console.log(this.sondaggi1g);
  }

  checkDataeoraSondaggi() {
    this.sondaggi1g = [];
    this.sondaggi1s = [];
    this.sondaggi2s = [];
    this.sondaggi3s = [];
    this.sondaggi1m = [];

    if (this.sondaggi===undefined) {
      console.log('Non ci sono sondaggi per questo utente');
    } else {

    for (var i = 0; i < this.sondaggi.length; i++) {
      var data = new Date(this.sondaggi[i].dataeora.toLocaleString());
      var data2 = new Date();
      var diff = (data2.getTime() - data.getTime()) /1000;
      console.log(diff);
      if (diff <= 86400) {
        this.sondaggi1g.push(this.sondaggi[i]);
      }

      if (diff <= 604800) {
        this.sondaggi1s.push(this.sondaggi[i]);
      }

      if (diff <= 1209600) {
        this.sondaggi2s.push(this.sondaggi[i]);
      }

      if (diff <= 1814400) {
        this.sondaggi3s.push(this.sondaggi[i]);
      }

      if (diff <= 2419200) {
        this.sondaggi1m.push(this.sondaggi[i]);
      }
    }

  }
   
    console.log(this.sondaggi1g.length);
    console.log(this.sondaggi1s.length);
    console.log(this.sondaggi2s.length);
    console.log(this.sondaggi3s.length);
    console.log(this.sondaggi1m.length);
  }

  clickDomanda(codice_domanda){
    //Visualizza il frame di caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 2500;
    document.body.appendChild(loading);
    loading.present();

    this.dataService.codice_domanda = codice_domanda;
    console.log(this.dataService.codice_domanda);
    this.router.navigate(['/visualizza-domanda']);
  }

  clickSondaggio(codice_sondaggio){
    //Visualizza il frame di caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 2500;
    document.body.appendChild(loading);
    loading.present();

    this.dataService.codice_sondaggio = codice_sondaggio;
    console.log(this.dataService.codice_domanda);
    this.router.navigate(['/visualizza-sondaggio']);
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    console.log('Sezione: ',this.sezione, 'Check1: ', this.check1, 'Check2: ', this.check2);
  }

  caricaDomande() {
    this.sezione = 'Domande';
    this.check1 = false;
    this.check2 = true;
  }

  caricaSondaggi() {
    this.sezione = 'Sondaggi';
    this.check2 = false;
    this.check1 = true;
  }

  openMenu(){
    this.menuCtrl.open();
  }
}
