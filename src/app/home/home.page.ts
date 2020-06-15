import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from "../services/data.service";
import { ApiService } from '../providers/api.service';
import { Router } from '@angular/router';
import { Storage } from "@ionic/storage";
import { PopoverController, MenuController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  domande;
  sondaggi;
  domande_regolate = new Array();
  sondaggi_regolati = new Array();
  categorie_domande = new Array();
  categoria_sondaggi = new Array();
  indice_regola_domande = 0;
  indice_regola_sondaggi = 0;
  index1 = 1;
  index2 = 2;
  switch = true;
  currentMailUser;
  keywordToSearch;
  timer;

  constructor(
    public popoverController: PopoverController,
    private menuSet: AppComponent,
    private menuCtrl: MenuController,
    private storage: Storage,
    private apiService: ApiService,
    private dataService: DataService,
    private router: Router,
    private update: ChangeDetectorRef) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.menuSet.checkUserLogged();
    this.visualizzaDomandaHome();
    this.visualizzaSondaggiHome();
  }

  ngOnInit() {
    this.timer = setInterval(() => {
      this.update.detectChanges();

    }, 500)
    this.storage.get('utente').then(data => { this.currentMailUser = data.email });
  }

  switchDomSon(switchDomSon) {
    if (switchDomSon == true)
      this.switch = this.switch;
    else
      this.switch = !(this.switch);
  }
  switchSonDom(switchDomSon) {
    if (switchDomSon == false)
      this.switch = this.switch;
    else
      this.switch = !(this.switch);
  }

  async presentPopover(ev, index, username, codice) {
    this.tuaDomandaSondaggio(index,username);
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,

      mode: 'md',
      cssClass: 'popOver'
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data != undefined) {
      this.visualizzaElemento(data, index, codice);
    }
  }

  tuaDomandaSondaggio(indice,username) {
    if (username == this.currentMailUser) {
      this.dataService.setPopoverModifica(true, indice);
    }
    else {
      this.dataService.setPopoverModifica(false, indice);
    }
  }

  visualizzaElemento(data, index, codice) {
    if (data.item == 1) {
      this.clickSondaggio(codice);
    } else
      if (data.item == 2) {
        this.clickDomanda(codice);
      }
  }

  async visualizzaDomandaHome() {
    this.apiService.getDomandaHome().then(
      (domande) => {
        this.domande = domande;
        this.getUserCategoriaDomanda(this.domande);
        this.regola_domande();
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  getUserCategoriaDomanda(domande) {
    for (let i = 0; i < domande.length; i++) {
      this.apiService.getProfilo(domande[i].cod_utente).then(
        (profilo1) => {
          domande[i]['avatar'] = profilo1['data']['0'].avatar;
          domande[i]['username'] = profilo1['data']['0'].username;
        },
        (rej) => {
          console.log("C'è stato un errore durante la visualizzazione del profilo");
        }
      );

      this.apiService.getCategoria(domande[i].cod_categoria).then(
        (categoria1) => {
          domande[i]['categoria'] = categoria1['Categoria']['data']['0'].titolo;
        },
        (rej) => {
          console.log("C'è stato un errore durante la visualizzazione");
        }
      );
    
    }
  }

  regola_domande() {
    for (let i = 0; i < 4; i++) {
      if (this.domande[this.indice_regola_domande]) {
        this.domande_regolate[this.indice_regola_domande] = this.domande[this.indice_regola_domande];
        this.domandaDeadlineCheck();
        this.indice_regola_domande++;
      }
    }
  }

  async visualizzaSondaggiHome() {
    this.apiService.getSondaggioHome().then(
      (sondaggi) => {
        this.sondaggi = sondaggi; //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
        this.getUserCategoriaSondaggio(this.sondaggi);
        this.regola_sondaggi();
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  getUserCategoriaSondaggio(sondaggi) {
    for (let i = 0; i < sondaggi.length; i++) {
      this.apiService.getProfilo(sondaggi[i].cod_utente).then(
        (profilo1) => {
          sondaggi[i]['username'] = profilo1['data']['0'].username;
          sondaggi[i]['avatar'] = profilo1['data']['0'].avatar;
        },
        (rej) => {
          console.log("C'è stato un errore durante la visualizzazione del profilo");
        }
      );
      this.apiService.getCategoria(sondaggi[i].cod_categoria).then(
        (categoria2) => {
          sondaggi[i]['categoria'] = categoria2['Categoria']['data']['0'].titolo;
        },
        (rej) => {
          console.log("C'è stato un errore durante la visualizzazione");
        }
      );
    }
  }

  regola_sondaggi() {
    for (let i = 0; i < 4; i++) {
      if (this.sondaggi[this.indice_regola_sondaggi]) {
        this.sondaggi_regolati[this.indice_regola_sondaggi] = this.sondaggi[this.indice_regola_sondaggi];
        this.sondaggioDeadlineCheck();
        this.indice_regola_sondaggi++;
      }
    }
  }

  ionViewDidLeave() {
    clearInterval(this.timer)
    this.indice_regola_sondaggi = 0;;
    this.indice_regola_domande = 0;
    this.sondaggi_regolati = []
    this.domande_regolate = [];
  }

  
  clickDomanda(domanda_codice) {
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3500;
    document.body.appendChild(loading);
    loading.present();
    this.dataService.setCod_domanda(domanda_codice);
    this.router.navigate(['/visualizza-domanda']);
  }

  clickSondaggio(codice_sondaggio) {
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3000;
    document.body.appendChild(loading);
    loading.present();

    this.dataService.codice_sondaggio = codice_sondaggio;
    this.router.navigate(['/visualizza-sondaggio']);
  }

  clickProfilo(cod_utente) {
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3500;
    document.body.appendChild(loading);
    loading.present();

    this.dataService.setEmailOthers(cod_utente);
    console.log(this.dataService.setEmailOthers);
    this.router.navigate(['/visualizza-profilo']);
  }

  clickProfiloUtente() {
    this.router.navigate(['/visualizza-profiloutente']);
  }

  clickModificaDomanda(domanda_codice) {
    this.dataService.setCod_domanda(domanda_codice);
    this.router.navigate(['/modifica-domanda']);
  }

  clickModificaSondaggio(sondaggio_codice) {
    this.dataService.setCod_sondaggio(sondaggio_codice);
    this.router.navigate(['/modifica-sondaggio']);
  }

  ricerca() {
    console.log("Input: ", this.keywordToSearch);

    this.dataService.setKeywordToSearch(this.keywordToSearch);
    this.router.navigate(['/search-results']);
  }

  openMenu() {
    this.menuCtrl.open();
  }

  sondaggioDeadlineCheck() {

    var appoggio1 = [];
    appoggio1 = this.sondaggi_regolati;

    for (var i = 0; i < appoggio1.length; i++) {

      var date = new Date(appoggio1[i].dataeora.toLocaleString());
      var timer = appoggio1[i].timer;
      var dateNow = new Date().getTime();
      var time2 = date.getTime();
      var seconds = new Date('1970-01-01T' + timer + 'Z').getTime();
      var diff = dateNow - time2;

      this.sondaggi_regolati[i].sondaggioChecker = diff > seconds;

    }
  }

  domandaDeadlineCheck() {

    var appoggio2 = [];
    appoggio2 = this.domande_regolate;

    for (var i = 0; i < appoggio2.length; i++) {

      var date = new Date(appoggio2[i].dataeora.toLocaleString());
      var timer = appoggio2[i].timer;
      var dateNow = new Date().getTime();
      var time2 = date.getTime();
      var seconds = new Date('1970-01-01T' + timer + 'Z').getTime();
      var diff = dateNow - time2;

      this.domande_regolate[i].domandaChecker = diff > seconds;

    }
  }

  infScroll(event) {
    setTimeout(() => {
      if (this.switch == true) {
        this.regola_domande();
      } else {
        this.regola_sondaggi();
      }
      event.target.complete();
    }, 500);

  }

  formatsDate: string[] = [
    'd-MM-y, H:mm'
  ];
}

