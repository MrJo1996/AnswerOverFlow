import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PostServiceService } from "../services/post-service.service";
import { DataService } from "../services/data.service";
import { ApiService } from '../providers/api.service';
import { Router } from '@angular/router';
import { Storage } from "@ionic/storage";
import { PopoverController, iosTransitionAnimation, MenuController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { AppComponent } from "../app.component";
import { NgZone } from '@angular/core';
import { element } from 'protractor';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  i_domande = 0;
  y_domande = 0;
  i_sondaggi = 0;
  y_sondaggi = 0;
  index1 = 1;
  index2 = 2;
  session;
  refresh_index;
  switch = true;
  indice_domande;
  codice_domanda;
  codice_sondaggio;
  codice_categoria;
  categoria;
  currentMailUser;//mail dell'utente corrente
  domande;
  domande_regolate = Array();
  sondaggi_regolati = Array();
  profili_user_domande = new Array();
  profili_user_sondaggi = new Array();
  profilo1;
  profilo2;
  categorie_domande = Array();
  categoria_sondaggi = Array();
  voti_sondaggi = Array();
  titolo = Array();
  sondaggi;
  domandaMailUser;//mail dell'utente che ha fatto la domanda
  domandaNomeUser = " ";//nome e cognome dell'utente che ha fatto la domanda
  keywordToSearch;
  searchingResults;
  request: Promise<any>;
  timer;

  sondaggioChecker;
  domandaChecker
  interval;

  constructor(public popoverController: PopoverController,
    private menuSet: AppComponent,
    private menuCtrl: MenuController,
    private storage: Storage,
    private apiService: ApiService,
    private service: PostServiceService,
    private dataService: DataService,
    private router: Router,
    private update: ChangeDetectorRef,
    private zone: NgZone) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.menuSet.checkUserLogged();
    this.refresh_index = this.dataService.getRefreshIndex();
    if (this.refresh_index == true) {
    }
  }


  ngOnInit() {
    this.timer=setInterval(() => {
      this.update.detectChanges();

    }, 500)

    this.storage.get('utente').then(data => { this.currentMailUser = data.email });
    this.visualizzaDomandaHome();
    this.visualizzaSondaggiHome();

  }
  switch1_(switch_) {
    if (switch_ == true)
      this.switch = this.switch;
    else
      this.switch = !(this.switch);
  }
  switch2_(switch_) {
    if (switch_ == false)
      this.switch = this.switch;
    else
      this.switch = !(this.switch);
  }
  //POPOVER
  async presentPopover(ev, index, user, codice) {

    if (user == this.currentMailUser) {
      this.setPopoverMod(true, index);
    }
    else {
      this.setPopoverMod(false, index);
    }
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
      this.checkClick1(data, index, codice);
    }
  }
  checkClick1(data, index, codice) {
    if (data.item == 1) {
      this.clickSondaggio(codice);
    } else
      if (data.item == 2) {
        this.clickDomanda(codice);
      }
  }
  setPopoverMod(bool, indice) {
    this.dataService.setPopoverModifica(bool, indice);

  }
  //IFINITE SCROLL
  loadMore(event) {
    setTimeout(() => {
      if (this.switch == true) {
        this.regola_domande();
      } else {
        this.regola_sondaggi();
      }
      console.log('Done');
      event.target.complete();
    }, 500);

  }
  ionViewDidLeave() {
    clearInterval(this.timer)
  }  
  //VISUALIZZA LE ULTIME DOMANDE APERTE
  async visualizzaDomandaHome() {

    this.apiService.getDomandaHome().then(
      (domande) => {
        this.domande = domande;
        this.getUserDomanda(this.domande); //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
        this.regola_domande();
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  async getUserDomanda(domande) {
    this.getUser1(domande);
    this.getUser2(domande);
    this.titoloo(domande);
  }
  titoloo(domande) {
    for (let i = 0; i < domande.length; i++) {
      this.titolo[i] = domande[i].titolo;
    }
  }
  getUser1(domande) {
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
    }
  }
  getUser2(domande) {
    for (let i = 0; i < domande.length; i++) {
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

  async getCategoriaDomande(id_categoria) {
    this.apiService.getCategoria(id_categoria).then(
      (categoria) => {
        this.categorie_domande.push(categoria['Categoria']['data']['0'].titolo);
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }


  regolatore_infinite_scroll() {
    for (this.i_domande = 0; this.i_domande < 2; this.i_domande++) {
      if (this.domande[this.y_domande]) {

        this.domande_regolate[this.y_domande] = this.domande[this.y_domande];
        this.y_domande++;
        this.update.detectChanges();
      }
      this.update.detectChanges();

    }
    for (this.i_sondaggi = 0; this.i_sondaggi < 2; this.i_sondaggi++) {

      this.sondaggi_regolati[this.y_sondaggi] = this.sondaggi[this.y_sondaggi];



      this.y_sondaggi++;


    }
  }

  regola_domande() {
    for (this.i_domande = 0; this.i_domande < 3; this.i_domande++) {
      if (this.domande[this.y_domande]) {
        this.domande_regolate[this.y_domande] = this.domande[this.y_domande];
        this.domandaDeadlineCheck();
        this.y_domande++;
      }
    }
  }

  regola_sondaggi() {
    for (this.i_sondaggi = 0; this.i_sondaggi < 3; this.i_sondaggi++) {
      if (this.sondaggi[this.y_sondaggi]) {
        this.sondaggi_regolati[this.y_sondaggi] = this.sondaggi[this.y_sondaggi];
        this.sondaggioDeadlineCheck();
        this.y_sondaggi++;
      }
    }
  }

  //VISUALIZZA GLI ULTIMI SONDAGGI APERTI
  async visualizzaSondaggiHome() {
    this.apiService.getSondaggioHome().then(
      (sondaggi) => {
        console.log('Sondaggi caricati');
        this.sondaggi = sondaggi; //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
        this.getUserSondaggio(this.sondaggi);
        this.regola_sondaggi();

      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }
  async getUserSondaggio(sondaggi) {
    this.getUser3(sondaggi);
    this.getUser4(sondaggi)
  }

  getUser3(sondaggi) {
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
    }
  }
  getUser4(sondaggi) {
    for (let i = 0; i < sondaggi.length; i++) {
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


  async getCategoriaSondaggio(id_categoria) {
    this.apiService.getCategoria(id_categoria).then(
      (categoria) => {
        this.categoria_sondaggi.push(categoria['Categoria']['data']['0'].titolo);
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  //LINK ALLE PAGINE
  //link a visualizza domanda
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
  //link a viualizza sondaggio
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
  //link a visualizza profilo
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
  //link a modifica domanda
  clickModificaDomanda(domanda_codice) {
    this.dataService.setCod_domanda(domanda_codice);
    this.router.navigate(['/modifica-domanda']);
  }
  //link a modifica sondaggio
  clickModificaSondaggio(sondaggio_codice) {
    this.dataService.setCod_sondaggio(sondaggio_codice);
    this.router.navigate(['/modifica-sondaggio']);
  }

  //REFRESH
  doRefresh(event) {
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  doRefresh2() {
    window.location.reload();
  }
  refresh() {
    this.zone.run(() => {
    });
  }
  //RICERCA - Azioni SearchBar
  ricerca() {
    console.log("Input: ", this.keywordToSearch);

    this.dataService.setKeywordToSearch(this.keywordToSearch);
    this.router.navigate(['/search-results']);
  }

  openMenu() {
    this.menuCtrl.open();
  }

  formatsDate: string[] = [
    'd MMM y, H:mm'];


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


}

