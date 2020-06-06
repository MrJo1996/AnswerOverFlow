import { Component, OnInit } from '@angular/core';
import { PostServiceService } from "../services/post-service.service";
import { DataService } from "../services/data.service";
import { ApiService } from '../providers/api.service';
import { Router } from '@angular/router';
import { Storage } from "@ionic/storage";
import { PopoverController, iosTransitionAnimation } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

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
  switch = true;
  scelte = Array(2);
  indice_domande;
  codice_domanda;
  codice_sondaggio;
  codice_categoria;
  categoria;
  currentMailUser;//mail dell'utente corrente
  domande;
  domande_regolate = Array();
  sondaggi_regolati = Array();
  profili_user_domande = Array();
  profili_user_sondaggio = Array();
  profilo = Array();
  categorie_domande = Array();
  sondaggi;
  domandaMailUser;//mail dell'utente che ha fatto la domanda
  domandaNomeUser = " ";//nome e cognome dell'utente che ha fatto la domanda
  keywordToSearch;
  searchingResults;
  request: Promise<any>;
  constructor(public popoverController: PopoverController, private storage: Storage, private apiService: ApiService, private service: PostServiceService, private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.visualizzaDomandaHome();
    this.visualizzaSondaggiHome();
    this.storage.get('utente').then(data => { this.currentMailUser = data.email });
    console.log(this.currentMailUser);
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
  async presentPopover(ev, domanda_completa) {
    if (domanda_completa.cod_utente == this.currentMailUser) {
      this.dataService.setPopoverModifica(true);
    }
    else {
      this.dataService.setPopoverModifica(false);
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
      if (data.item == 2) {
        this.clickDomanda(domanda_completa.codice_domanda);
      }
      if (data.item == 3) {
        this.clickModificaDomanda(domanda_completa.codice_domanda);
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
        console.log('Visualizzato con successo');
        this.domande = domande; //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
        this.domande.forEach(element => {
          this.getUserDomanda(element.cod_utente);
        });
        console.log("profili",this.profili_user_domande);
        this.domande.forEach(element => {
          this.getCategoriaDomande(element.cod_categoria);
        });
        console.log(this.categorie_domande);
        this.regola_domande();
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );

  }

  async getUserDomanda(mail) {
    this.apiService.getProfilo(mail).then(
      (profilo) => {
        this.profili_user_domande.push(profilo['data']['0'].username);
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione del profilo");
      }
    );
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
    for (this.i_domande = 0; this.i_domande < 3; this.i_domande++) {
      console.log(this.y_domande);
      this.domande_regolate[this.y_domande] = this.domande[this.y_domande];
      this.y_domande++;
    }
    for (this.i_sondaggi = 0; this.i_sondaggi < 2; this.i_sondaggi++) {
      this.sondaggi_regolati[this.y_sondaggi] = this.sondaggi[this.y_sondaggi];
      this.y_sondaggi++;
    }
  }

  regola_domande() {
    for (this.i_domande = 0; this.i_domande < 3; this.i_domande++) {
      console.log(this.y_domande);
      this.domande_regolate[this.y_domande] = this.domande[this.y_domande];
      this.y_domande++;
    }
  }

  regola_sondaggi() {
    for (this.i_sondaggi = 0; this.i_sondaggi < 3; this.i_sondaggi++) {
      this.sondaggi_regolati[this.y_sondaggi] = this.sondaggi[this.y_sondaggi];
      this.y_sondaggi++;
    }
  }

  //VISUALIZZA GLI ULTIMI SONDAGGI APERTI
  async visualizzaSondaggiHome() {
    this.apiService.getSondaggioHome().then(
      (sondaggi) => {
        console.log('Visualizzato con successo');

        this.sondaggi = sondaggi; //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
        this.regola_sondaggi();

      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  //LINK ALLE PAGINE
  //link a visualizza domanda
  clickDomanda(codice_domanda) {
    this.dataService.codice_domanda = codice_domanda;
    console.log(this.dataService.codice_domanda);
    this.router.navigate(['/visualizza-domanda']);
  }
  //link a viualizza sondaggio
  clickSondaggio(codice_sondaggio) {
    this.dataService.codice_sondaggio = codice_sondaggio;
    console.log(this.dataService.codice_sondaggio);
    this.router.navigate(['/visualizza-sondaggio']);
  }
  //link a visualizza profilo
  clickProfilo(cod_utente) {
    this.dataService.setEmailOthers = cod_utente;
    console.log(this.dataService.setEmailOthers);
    this.router.navigate(['/visualizza-profilo']);
  }
  //link a modifica domanda
  clickModificaDomanda(codice_domanda) {
    this.dataService.setCod_domanda(codice_domanda);
    this.router.navigate(['/modifica-domanda']);
  }

  //REFRESH
  doRefresh(event) {
    this.visualizzaDomandaHome();
    this.visualizzaSondaggiHome();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  //RICERCA - Azioni SearchBar
  ricerca() {
    console.log("Input: ", this.keywordToSearch);

    this.dataService.setKeywordToSearch(this.keywordToSearch);
    this.router.navigate(['/search-results']);
  }
}

