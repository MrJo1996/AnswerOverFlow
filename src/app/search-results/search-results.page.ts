import { Component, OnInit } from '@angular/core';
import { DataService } from "../services/data.service";
import { Router } from '@angular/router';
import { ApiService } from '../providers/api.service';
import { Storage } from "@ionic/storage";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
})
export class SearchResultsPage implements OnInit {

  keyRicerca;

  domandeSearched = [];
  sondaggiSearched = [];
  utentiSearched;

  numDomande;
  numSondaggi;
  numUtenti;

  categorie = [];

  categorieSondaggi = [];

  keywordToSearch;

  sondaggiButton;
  domandeButton = true;
  utentiButton;

  isFiltered: boolean = false;
  filters = [];

  currentMailUser;

  domandeFiltrate;
  sondaggiFiltrati

  constructor(private dataService: DataService, private menuCtrl: MenuController, private router: Router, private apiService: ApiService, private storage: Storage) { }

  ngOnInit() {
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3500;
    document.body.appendChild(loading);
    loading.present();
    
    this.storage.get('utente').then(data => { this.currentMailUser = data.email });
  }


  ionViewWillEnter() { //carica al rendering della page
    console.log("in ionViewCanEnter");

    this.keyRicerca = this.dataService.getKeywordToSearch();

    //check presenza filtri
    this.filters = this.dataService.getFilters();
    console.log("FILTRI JO ", this.filters);

    if (this.filters['isFiltered']) {
      this.domandeButton = false;
      this.apiService.getCategoria(this.filters['codCategoria']).then(
        (categoria) => {
          this.filters['categoria'] = categoria['Categoria']['data'][0].titolo;
        },
        (rej) => {
          console.log("rej getCat filtered");
        }
      );
/*       console.log("RICERCA FILTRATA", this.filters['isFiltered']);
 */      this.isFiltered = true;
    }

    console.log("Filtri prima di domanda", this.filters);

    //DOMANDE
    this.apiService.ricercaDomanda(this.keyRicerca).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
        //console.log("LUNGHEZZA totale chiamata ", result['data'].length);

        if (result != undefined) {
          console.log("Domande chiamata: ", this.domandeSearched);

          if (this.isFiltered) {


            /*  console.log("cod passato dal filtro ", this.filters['codCategoria'])
 
             this.domandeFiltrate = this.domandeSearched.filter(function (obj) {
               return obj.cod_categoria == this.filters['codCategoria'];
             });
             //altri filtri
 
             this.numDomande = this.domandeFiltrate.length;
 
             console.log("FILTER array funzione ", this.domandeFiltrate);
  */
            var i;
            for (i = 0; i < result['data'].length; i++) {
              if (this.filters['codCategoria'] != "") {
                if (result['data'][i].cod_categoria == this.filters['codCategoria'] && result['data'][i] != undefined) {
                  this.domandeSearched.push(result['data'][i]);
                  /*  this.domandeSearched.push(result['data'][i]);
 
                   this.domandeSearched.pop(); //BOH */

                }
              }
            }
            this.numDomande = this.domandeSearched.length;

          } else {
            this.domandeSearched = result['data'];
            this.numDomande = this.domandeSearched.length;
          }

          var i;
          for (i = 0; i < this.numDomande; i++) {
            this.parseCodCat(this.domandeSearched[i].cod_categoria, i);
          }
        } else {
          this.numDomande = 0;
          console.log("non ci sono domande");
        }
      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('rej domande search-res');
      }
    );

    //SONDAGGI
    this.apiService.ricercaSondaggio(this.keyRicerca).then(
      (result) => { // nel caso in cui va a buon fine la chiamata


        if (result != undefined) {
          console.log("sondaggi chiamata: ", result);

          if (this.isFiltered) {

            var i;
            for (i = 0; i < result['data'].length; i++) {
              if (this.filters['codCategoria'] != "") {
                if (result['data'][i].cod_categoria == this.filters['codCategoria'] && result['data'][i] != undefined) {
                  this.sondaggiSearched.push(result['data'][i]);
                  /*  this.domandeSearched.push(result['data'][i]);
 
                   this.domandeSearched.pop(); //BOH */

                }
              }
            }

            this.numSondaggi = this.sondaggiSearched.length;
            console.log("FILTER array funzione ", this.sondaggiSearched);

          } else {
            this.sondaggiSearched = result['data'];
            this.numSondaggi = this.sondaggiSearched.length;
          }

          var i;
          for (i = 0; i < this.numSondaggi; i++) {
            this.parseCodCatSondaggi(this.sondaggiSearched[i].cod_categoria, i);

          }
        } else {
          this.numSondaggi = 0;
          console.log("non ci sono sondaggi");
        }

      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('rej sondaggi search-res');
      }
    );

    //UTENTI

    this.apiService.ricercaUtente(this.keyRicerca).then(
      (result) => { // nel caso in cui va a buon fine la chiamata

        if (result != undefined) {

          console.log("utente: ", result)

          this.utentiSearched = result['data'];
          console.log("Utenti search-res: ", this.utentiSearched);
          this.numUtenti = this.utentiSearched.length;

        } else {
          this.numUtenti = 0;
          console.log("non ci sono utenti");
        }

      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('rej utenti search-res');
      }
    );


  }

  ionViewDidEnter() {
    console.log("in ionViewDidEnter");
  }

  backButton() {
    this.router.navigate(['home']);
  }

  viewDomande() {
    this.sondaggiButton = false;
    this.domandeButton = true;
    this.utentiButton = false;
  }

  viewSondaggi() {
    this.sondaggiButton = true;
    this.domandeButton = false;
    this.utentiButton = false;
  }

  viewUtenti() {
    this.sondaggiButton = false;
    this.domandeButton = false;
    this.utentiButton = true;
  }

  async parseCodCat(codice_cat, index) {
    //set categorieToView
    console.log("", codice_cat, index);

    this.apiService.getCategoria(codice_cat).then(
      (categoria) => {
        this.categorie[index] = categoria['Categoria']['data'][0].titolo;
        //onsole.log("COD parsato", index, " ", this.categorie[index]);
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  async parseCodCatSondaggi(codice_cat, index) {
    //set categorieToView
    console.log("", codice_cat, index);

    this.apiService.getCategoria(codice_cat).then(
      (categoria) => {
        this.categorieSondaggi[index] = categoria['Categoria']['data'][0].titolo;
        //console.log("COD parsato sondaggi", index, " ", this.categorieSondaggi[index]);
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  ricerca() {
    console.log("Input: ", this.keywordToSearch);

    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3000;
    document.body.appendChild(loading);
    loading.present();

    this.dataService.setKeywordToSearch(this.keywordToSearch);
    this.isFiltered = false;
    this.domandeSearched = [];
    this.ionViewWillEnter();
  }

  ionViewDidLeave() {
    //reset
    this.filters = [];
    this.filters['categoria'] = '';
    this.isFiltered = false;
    //this.dataService.setFilters("", "", "", false); //mettere in back o btn menu
    this.domandeSearched = [];
    this.sondaggiSearched = [];

    // console.log("ionViewDidLeave");
  }

  clickFilter() {
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 2000;
    document.body.appendChild(loading);
    loading.present();

    this.router.navigate(['/advanced-search']);
  }

  //TODO ARRAY FILTERED

  clickUtente(cod_utente) {
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3500;
    document.body.appendChild(loading);
    loading.present();

    this.dataService.setEmailOthers(cod_utente);
    console.log(this.dataService.setEmailOthers);
    this.dataService.setFilters(this.filters['tipo'], this.filters['codCategoria'], this.filters['status'], this.filters['isFiltered']);

    this.router.navigate(['/visualizza-profilo']);
  }

  clickDomanda(domanda_codice) {
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3500;
    document.body.appendChild(loading);
    loading.present();

    this.dataService.setCod_domanda(domanda_codice);
    this.dataService.setFilters(this.filters['tipo'], this.filters['codCategoria'], this.filters['status'], this.filters['isFiltered']);

    this.router.navigate(['/visualizza-domanda']);

  }

  clickSondaggio(codice_sondaggio) {
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3500;
    document.body.appendChild(loading);
    loading.present();

    this.dataService.codice_sondaggio = codice_sondaggio;
    this.dataService.setFilters(this.filters['tipo'], this.filters['codCategoria'], this.filters['status'], this.filters['isFiltered']);

    this.router.navigate(['/visualizza-sondaggio']);

  }

  openMenu(){
    this.menuCtrl.open();
  }
}

