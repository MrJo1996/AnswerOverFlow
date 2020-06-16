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
  switchSearch = true;
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

//IONVIEW
  ionViewWillEnter() {
    this.dataService.loadingView(5000);
    this.menuCtrl.enable(true);
    this.menuSet.checkUserLogged();
    this.visualizzaDomandaHome();
    this.visualizzaSondaggiHome();
  }

  ionViewDidLeave() {
    clearInterval(this.timer)
    this.indice_regola_sondaggi = 0;;
    this.indice_regola_domande = 0;
    this.sondaggi_regolati = [];
    this.domande_regolate = [];
    //this.currentMailUser = "";
    this.switchSearch = true;
  }

  ngOnInit() {
    this.timer = setInterval(() => {
      this.update.detectChanges();
    }, 500)
    this.storage.get('utente').then(data => { this.currentMailUser = data.email });
  }
//SWITCH VIEW DOMANDE/SONDAGGI
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
//SWITCH VIEW SEARCH BAR
  switchSearchBar(switchSearch){
      this.switchSearch = !(this.switchSearch);
  }
//POPOVER
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
//CARICAMENTO DOMANDE
  async visualizzaDomandaHome() {
    this.apiService.getDomandaHome().then(
      (domande) => {
        this.domande = domande;
        this.getUserCategoriaDomanda(this.domande);
        this.regola_domande();
      },
      (rej) => {
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
        }
      );

      this.apiService.getCategoria(domande[i].cod_categoria).then(
        (categoria1) => {
          domande[i]['categoria'] = categoria1['Categoria']['data']['0'].titolo;
        },
        (rej) => {
        }
      );
    
    }
  }

  regola_domande() {
    for (let i = 0; i < 7; i++) {
      if (this.domande[this.indice_regola_domande]) {
        this.domande_regolate[this.indice_regola_domande] = this.domande[this.indice_regola_domande];
        this.domandaDeadlineCheck();
        this.indice_regola_domande++;
      }
    }
  }
//CARICAMENTO SONDAGGI
  async visualizzaSondaggiHome() {
    this.apiService.getSondaggioHome().then(
      (sondaggi) => {
        this.sondaggi = sondaggi;
        this.getUserCategoriaSondaggio(this.sondaggi);
        this.regola_sondaggi();
      },
      (rej) => {
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
        }
      );
      this.apiService.getCategoria(sondaggi[i].cod_categoria).then(
        (categoria2) => {
          sondaggi[i]['categoria'] = categoria2['Categoria']['data']['0'].titolo;
        },
        (rej) => {
        }
      );
    }
  }

  regola_sondaggi() {
    for (let i = 0; i < 7; i++) {
      if (this.sondaggi[this.indice_regola_sondaggi]) {
        this.sondaggi_regolati[this.indice_regola_sondaggi] = this.sondaggi[this.indice_regola_sondaggi];
        this.sondaggioDeadlineCheck();
        this.indice_regola_sondaggi++;
      }
    }
  }
//LINK
  clickDomanda(domanda_codice) {
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3500;
    document.body.appendChild(loading);
    loading.present();
    this.dataService.loadingView(5000);
    this.dataService.setCod_domanda(domanda_codice);
    this.router.navigate(['/visualizza-domanda']);
  }

  clickSondaggio(codice_sondaggio) {
    this.dataService.loadingView(5000);
    this.dataService.codice_sondaggio = codice_sondaggio;
    this.router.navigate(['/visualizza-sondaggio']);
  }

  clickProfilo(cod_utente) {
    this.dataService.loadingView(5000);
    this.dataService.setEmailOthers(cod_utente);
    this.router.navigate(['/visualizza-profilo']);
  }

  clickProfiloUtente() {
    this.dataService.loadingView(5000);
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
    this.dataService.setKeywordToSearch(this.keywordToSearch);
    this.router.navigate(['/search-results']);
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
  doRefresh(event) {
    this.indice_regola_sondaggi = 0;;
    this.indice_regola_domande = 0;
    this.sondaggi_regolati = []
    this.domande_regolate = [];
    this.visualizzaSondaggiHome();
    this.visualizzaDomandaHome();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
  openMenu() {
    this.menuCtrl.open();
  }

  formatsDate: string[] = [
    'd-MM-y, H:mm'
  ];
}

