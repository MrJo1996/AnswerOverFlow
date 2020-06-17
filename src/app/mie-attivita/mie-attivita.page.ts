import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { ApiService } from '../providers/api.service';
import { AlertController } from '@ionic/angular';
import { DataService } from "../services/data.service";
import { Router } from '@angular/router';
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

  goBack() {
    this.dataService.loadingView(3000);
    this.navCtrl.pop();
  }

  async visualizzaMieDomande() {
    this.apiService.getMieDomande(this.currentUser).then(
      (domanda) => {

        this.domande = domanda['Domande']['data'];

        this.inizializeArrayDomande1g();

      },
      (rej) => {
      }
    );

  }

  async visualizzaMieiSondaggi() {
    this.apiService.getMieiSondaggi(this.currentUser).then(
      (sondaggio) => {

        this.sondaggi = sondaggio;

        this.inizializeArraySondaggi1g();

      },
      (rej) => {
      }
    );

  }

  checkDataeoraDomande() {
    this.domande1g = [];
    this.domande1s = [];
    this.domande2s = [];
    this.domande3s = [];
    this.domande1m = [];

    if (this.domande === undefined) {
      console.log('Non ci sono Domande per questo utente');
    } else {

      for (var i = 0; i < this.domande.length; i++) {
        var data = new Date(this.domande[i].dataeora.toLocaleString());
        var data2 = new Date();
        var diff = (data2.getTime() - data.getTime()) / 1000;
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

  }

  inizializeArrayDomande1g() {
    this.domande1g = [];
    for (var i = 0; i < this.domande.length; i++) {
      var data = new Date(this.domande[i].dataeora.toLocaleString());
      var data2 = new Date();
      var diff = (data2.getTime() - data.getTime()) / 1000;
      if (diff <= 86400) {
        this.domande1g.push(this.domande[i]);
      }
    }
  }

  inizializeArraySondaggi1g() {
    this.sondaggi1g = [];
    for (var i = 0; i < this.sondaggi.length; i++) {
      var data = new Date(this.sondaggi[i].dataeora.toLocaleString());
      var data2 = new Date();
      var diff = (data2.getTime() - data.getTime()) / 1000;
      if (diff <= 86400) {
        this.sondaggi1g.push(this.sondaggi[i]);
      }
    }
  }

  checkDataeoraSondaggi() {
    this.sondaggi1g = [];
    this.sondaggi1s = [];
    this.sondaggi2s = [];
    this.sondaggi3s = [];
    this.sondaggi1m = [];

    if (this.sondaggi === undefined) {
      console.log('Non ci sono sondaggi per questo utente');
    } else {

      for (var i = 0; i < this.sondaggi.length; i++) {
        var data = new Date(this.sondaggi[i].dataeora.toLocaleString());
        var data2 = new Date();
        var diff = (data2.getTime() - data.getTime()) / 1000;
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

  }

  clickDomanda(codice_domanda) {
    this.dataService.loadingView(1500);
    this.dataService.codice_domanda = codice_domanda;
    this.router.navigate(['/visualizza-domanda']);
  }

  clickSondaggio(codice_sondaggio) {
    this.dataService.loadingView(1500);
    this.dataService.codice_sondaggio = codice_sondaggio;
    this.router.navigate(['/visualizza-sondaggio']);
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    console.log('Sezione: ', this.sezione, 'Check1: ', this.check1, 'Check2: ', this.check2);
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

  openMenu() {
    this.menuCtrl.open();
  }
}
