import { Component, OnInit,ViewChild,ChangeDetectorRef } from '@angular/core';
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
  currentMailUser;;//mail dell'utente corrente
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
  sondaggi;
  domandaMailUser;//mail dell'utente che ha fatto la domanda
  domandaNomeUser = " ";//nome e cognome dell'utente che ha fatto la domanda
  keywordToSearch;
  searchingResults;
  request: Promise<any>;
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
    this.refresh_index=this.dataService.getRefreshIndex();
    if(this.refresh_index == true){
    this.doRefresh2();
  }
  }
  
  ngOnInit(){
    setInterval(()=>{
    this.update.detectChanges();

    },500)

    this.storage.get('utente').then(data => { this.currentMailUser = data.email });
    console.log(this.refresh_index);
    this.visualizzaDomandaHome();
    this.visualizzaSondaggiHome();
  }
  switch1_(switch_){
    if(switch_==true)
    this.switch = this.switch;
    else
    this.switch = !(this.switch);
  }
  switch2_(switch_){
    if(switch_==false)
    this.switch = this.switch;
    else
    this.switch = !(this.switch);
  }
  //POPOVER
  async presentPopover(ev,index,user,codice) {

    if (user == this.currentMailUser) {
      this.dataService.setPopoverModifica(true,index);
    }
    else {
      this.dataService.setPopoverModifica(false,index);
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
    console.log('dati', data);
    if (data != undefined) {
      if(data.item == 1){
        this.clickSondaggio(codice);
      }else
      if (data.item == 2) {
        this.clickDomanda(codice);
      }else
      if ((data.item == 3)&&(index==1)) {
        this.clickModificaDomanda(codice);
      }else
      if ((data.item == 3)&&(index==2)) {
        this.clickModificaSondaggio(codice);
      }
    }
  }

  //IFINITE SCROLL
  loadMore(event) {
    setTimeout(() => {
      if(this.switch==true){
        this.regola_domande();
      }else{
        this.regola_sondaggi();
      }
      console.log('Done');
      event.target.complete();
    }, 500);
    
  }

  //VISUALIZZA LE ULTIME DOMANDE APERTE
  async visualizzaDomandaHome() {
    this.apiService.getDomandaHome().then(
      (domande) => {
        this.domande = domande;
        console.log(this.domande);
        this.getUserDomanda(this.domande); //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
        console.log(this.domande);
        this.regola_domande();
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  async getUserDomanda(domande) {
    for(let i =0; i<=domande.length; i++){
    this.apiService.getProfilo(domande[i].cod_utente).then(
      (profilo1) => {
        this.domande[i]['profilo']=profilo1['data']['0'];
        console.log(profilo1['data']['0'].username);
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione del profilo");
      }
    );}
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


  regolatore_infinite_scroll(){
    for (this.i_domande = 0; this.i_domande < 2; this.i_domande++) {
      console.log( this.domande_regolate[this.y_domande-1] )
      console.log( this.domande[this.y_domande]-1 )
      console.log( 'this.domande_regolate[this.y_domande-1]' )
      console.log( this.domande[this.y_domande]-1 )
      console.log( this.domande_regolate[this.y_domande] )
      console.log( this.domande[this.y_domande] )
      if(this.domande[this.y_domande]){

      this.domande_regolate[this.y_domande] = this.domande[this.y_domande];
      this.y_domande++;
      this.update.detectChanges();
      }
      this.update.detectChanges();

    }
    for (this.i_sondaggi = 0; this.i_sondaggi < 2; this.i_sondaggi++) {
      console.log( this.domande_regolate[this.y_domande] = this.domande[this.y_domande])

      this.sondaggi_regolati[this.y_sondaggi] = this.sondaggi[this.y_sondaggi];
      console.log( this.domande_regolate[this.y_domande] = this.domande[this.y_domande])

      this.y_sondaggi++;
    }
  }

  regola_domande() {
/*      console.log( this.domande_regolate )
    console.log( 'this.domande' )
    console.log( this.domande )
    console.log( 'this.domande_regolate[this.y_domande-1]' )
    console.log( this.domande[this.y_domande])
    console.log( this.domande_regolate[this.y_domande] )
    console.log( this.domande[this.y_domande] )  */
    for (this.i_domande = 0; this.i_domande < 3; this.i_domande++) {
      if(this.domande[this.y_domande]){
      this.domande_regolate[this.y_domande] = this.domande[this.y_domande];
      this.y_domande++;
    }}
  }

  regola_sondaggi() {
    for (this.i_sondaggi = 0; this.i_sondaggi < 3; this.i_sondaggi++) {
      if(this.sondaggi[this.y_sondaggi]){
      this.sondaggi_regolati[this.y_sondaggi] = this.sondaggi[this.y_sondaggi];
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
    for(let i =0; i<=sondaggi.length; i++){
      this.apiService.getProfilo(sondaggi[i].cod_utente).then(
        (profilo1) => {
          this.sondaggi[i]['profilo']=profilo1['data']['0'];
          console.log(profilo1['data']['0'].username);
        },
        (rej) => {
          console.log("C'è stato un errore durante la visualizzazione del profilo");
        }
      );}
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
    this.dataService.setCod_domanda(domanda_codice);
    console.log(this.dataService.codice_domanda);
    this.router.navigate(['/visualizza-domanda']);
  }
  //link a viualizza sondaggio
  clickSondaggio(codice_sondaggio) {
    this.dataService.codice_sondaggio = codice_sondaggio;
    this.router.navigate(['/visualizza-sondaggio']);
  }
  //link a visualizza profilo
  clickProfilo(cod_utente) {
    this.dataService.setEmailOthers(cod_utente);
    console.log(this.dataService.setEmailOthers);
    this.router.navigate(['/visualizza-profilo']);
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

  doRefresh2(){
    window.location.reload();
  }
  refresh() {
    this.zone.run(() => {
      console.log('force update the screen');
    });
  }
  //RICERCA - Azioni SearchBar
  ricerca() {
    console.log("Input: ", this.keywordToSearch);

    this.dataService.setKeywordToSearch(this.keywordToSearch);
    this.router.navigate(['/search-results']);
  }

  openMenu(){
    this.menuCtrl.open();
  }
}

