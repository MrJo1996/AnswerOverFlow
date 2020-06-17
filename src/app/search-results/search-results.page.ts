import { Component, OnInit } from '@angular/core';
import { DataService } from "../services/data.service";
import { Router } from '@angular/router';
import { ApiService } from '../providers/api.service';
import { Storage } from "@ionic/storage";
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
})
export class SearchResultsPage implements OnInit {

  keyRicerca;
  currentMailUser;

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
  domandeButton;
  utentiButton;

  isFiltered: boolean = false;
  filters = [];


  constructor(private dataService: DataService, private menuCtrl: MenuController, private router: Router, private apiService: ApiService, private storage: Storage) { }

  ngOnInit() {
    this.storage.get('utente').then(data => { this.currentMailUser = data.email });
  }

  ionViewWillEnter() {

    this.keyRicerca = this.dataService.getKeywordToSearch();

    //check presenza filtri
    this.filters = this.dataService.getFilters();
    if (this.filters['tipo'] == 'utente') {
      this.domandeButton = false;
    }
    if (this.filters['isFiltered']) {
      this.domandeButton = false;
      this.apiService.getCategoria(this.filters['codCategoria']).then(
        (categoria) => {
          this.filters['categoria'] = categoria['Categoria']['data'][0].titolo;
        },
        (rej) => {
        }
      );
      this.isFiltered = true;
    } else if (this.filters['tipo'] != 'utente'){
      this.domandeButton = true;
    }


    //DOMANDE

    if (this.keyRicerca != null) {
      this.apiService.ricercaDomanda(this.keyRicerca).then(
        (result) => {

          if (result != undefined) {

            if (this.isFiltered) {

              var i;
              for (i = 0; i < result['data'].length; i++) {
                if (this.filters['codCategoria'] != "") {

                  //Check Categoria
                  if (result['data'][i].cod_categoria == this.filters['codCategoria'] && result['data'][i] != undefined) {

                    //Chech stato (Aperto/Chiuso/Entrambi)
                    if (this.filters['status'] != 'both') {

                      //Stato aperto/chiuso che combaciano con la categoria
                      this.checkDeadLine(result['data'][i], this.domandeSearched);

                    } else {

                      this.checkDeadLine(result['data'][i], this.domandeSearched);
                    }
                  }
                }
              }
              this.numDomande = this.domandeSearched.length;

            } else {

              this.checkDeadLineNotFiltered(result['data'], this.domandeSearched);
              this.numDomande = this.domandeSearched.length;
            }

            var i;
            for (i = 0; i < this.numDomande; i++) {
              this.parseCodCat(this.domandeSearched[i].cod_categoria, i);
            }

          } else {

            this.numDomande = 0;
          }
        },
        (rej) => {
        }
      );
    } else {

      this.apiService.getDomandaRicerca().then(
        (result) => {

          if (result != undefined) {

            if (this.isFiltered) {

              var i;
              for (i = 0; i < result['data'].length; i++) {

                if (this.filters['codCategoria'] != "") {

                  //Check Categoria

                  if (result['data'][i].cod_categoria == this.filters['codCategoria'] && result['data'][i] != undefined) {

                    //Chech stato (Aperto/Chiuso/Entrambi)
                    if (this.filters['status'] != 'both') {

                      //Stato aperto/chiuso che combaciano con la categoria
                      this.checkDeadLine(result['data'][i], this.domandeSearched);

                    } else {

                      this.checkDeadLine(result['data'][i], this.domandeSearched);
                    }
                  }
                }
              }

              this.numDomande = this.domandeSearched.length;

            } else {
              this.checkDeadLineNotFiltered(result['data'], this.domandeSearched);
              this.numDomande = this.domandeSearched.length;
            }

            var i;
            for (i = 0; i < this.numDomande; i++) {
              this.parseCodCat(this.domandeSearched[i].cod_categoria, i);
            }
          } else {
            this.numDomande = 0;
          }
        },
        (rej) => {
        }
      );
    }


    //SONDAGGI
    if (this.keyRicerca != null) {

      this.apiService.ricercaSondaggio(this.keyRicerca).then(
        (result) => {

          if (result != undefined) {

            if (this.isFiltered) {

              for (var i = 0; i < result['data'].length; i++) {

                if (this.filters['codCategoria'] != "") {

                  if (result['data'][i].cod_categoria == this.filters['codCategoria'] && result['data'][i] != undefined) {

                    //Chech stato (Aperto/Chiuso/Entrambi)
                    if (this.filters['status'] != 'both') {

                      this.checkDeadLine(result['data'][i], this.sondaggiSearched);

                    } else {
                      this.checkDeadLine(result['data'][i], this.sondaggiSearched);
                    }
                  }
                }
              }
              this.numSondaggi = this.sondaggiSearched.length;
            } else {

              this.checkDeadLineNotFiltered(result['data'], this.sondaggiSearched);
              this.numSondaggi = this.sondaggiSearched.length;
            }

            for (var i = 0; i < this.numSondaggi; i++) {
              this.parseCodCatSondaggi(this.sondaggiSearched[i].cod_categoria, i);
            }
          } else {
            this.numSondaggi = 0;
          }
        },
        (rej) => {
        }
      );
    } else {

      this.apiService.getSondaggioRicerca().then(
        (result) => {

          if (result != undefined) {

            if (this.isFiltered) {

              for (var i = 0; i < result['data'].length; i++) {

                if (this.filters['codCategoria'] != "") {

                  if (result['data'][i].cod_categoria == this.filters['codCategoria'] && result['data'][i] != undefined) {

                    //Chech stato (Aperto/Chiuso/Entrambi)
                    if (this.filters['status'] != 'both') {

                      this.checkDeadLine(result['data'][i], this.sondaggiSearched);

                    } else {
                      this.checkDeadLine(result['data'][i], this.sondaggiSearched);
                    }
                  }
                }
              }

              this.numSondaggi = this.sondaggiSearched.length;
            } else {

              this.checkDeadLineNotFiltered(result['data'], this.sondaggiSearched);
              this.numSondaggi = this.sondaggiSearched.length;
            }

            for (var i = 0; i < this.numSondaggi; i++) {
              this.parseCodCatSondaggi(this.sondaggiSearched[i].cod_categoria, i);
            }
          } else {
            this.numSondaggi = 0;
          }
        },
        (rej) => {
        }
      );
    }

    //UTENTI

    if (this.keyRicerca != null) {

      this.apiService.ricercaUtente(this.keyRicerca).then(
        (result) => {

          if (result != undefined) {

            this.utentiSearched = result['data'];
            this.numUtenti = this.utentiSearched.length;

          } else {
            this.numUtenti = 0;
          }
        },
        (rej) => {
        }
      );
    }
  }


  ionViewDidEnter() {
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
    this.apiService.getCategoria(codice_cat).then(
      (categoria) => {
        this.categorie[index] = categoria['Categoria']['data'][0].titolo;
      },
      (rej) => {
      }
    );
  }

  async parseCodCatSondaggi(codice_cat, index) {

    //set categorieToView
    this.apiService.getCategoria(codice_cat).then(
      (categoria) => {
        this.categorieSondaggi[index] = categoria['Categoria']['data'][0].titolo;
      },
      (rej) => {
      }
    );
  }

  ricerca() {

    this.dataService.loadingView(2500);

    this.dataService.setKeywordToSearch(this.keywordToSearch);
    this.isFiltered = false;
    this.domandeSearched = [];
    this.sondaggiSearched = [];
    this.utentiSearched = [];

    this.ionViewWillEnter();
  }

  ionViewDidLeave() {
    this.resetVars();
  }

  ngOnDestroy() {
    this.resetVars;
    this.dataService.setFilters("", "", "", false);
  }

  clickFilter() {
    this.dataService.loadingView(1000);

    this.resetVars();
    this.router.navigateByUrl("/advanced-search");
  }

  clickUtente(cod_utente) {
   this.dataService.loadingView(1500);

    this.dataService.setEmailOthers(cod_utente);
    this.router.navigate(['/visualizza-profilo']);
  }

  clickDomanda(domanda_codice) {
    this.dataService.loadingView(1500);

    this.dataService.setCod_domanda(domanda_codice);
    this.router.navigate(['/visualizza-domanda']);
  }

  clickSondaggio(codice_sondaggio) {
    this.dataService.loadingView(1500);


    this.dataService.codice_sondaggio = codice_sondaggio;
    this.router.navigate(['/visualizza-sondaggio']);
  }

  openMenu() {
    this.menuCtrl.open();
  }

  checkDeadLine(itemToCheck, array) {

    var date = new Date(itemToCheck.dataeora.toLocaleString());
    var timer = itemToCheck.timer;
    var dateNow = new Date().getTime();
    var time2 = date.getTime();
    var seconds = new Date('1970-01-01T' + timer + 'Z').getTime();
    var diff = dateNow - time2;
    var isOpen = diff > seconds;

    if (this.filters['status'] == 'closed') {
      if (isOpen) {
        itemToCheck['isOpen'] = true;
        array.push(itemToCheck);
      }
    }

    if (this.filters['status'] == 'open') {
      if (!isOpen) {
        itemToCheck['isOpen'] = false;
        array.push(itemToCheck);
      }
    }

    if (this.filters['status'] == 'both') {
      if (isOpen) {
        itemToCheck['isOpen'] = true;
        array.push(itemToCheck);
      } else {
        itemToCheck['isOpen'] = false;
        array.push(itemToCheck);
      }
    }
  }

  checkDeadLineNotFiltered(arrayToCheck, array) {

    for (var i = 0; i < arrayToCheck.length; i++) {
      var date = new Date(arrayToCheck[i].dataeora.toLocaleString());
      var timer = arrayToCheck[i].timer;
      var dateNow = new Date().getTime();
      var time2 = date.getTime();
      var seconds = new Date('1970-01-01T' + timer + 'Z').getTime();
      var diff = dateNow - time2;
      var isOpen = diff > seconds;

      if (isOpen) {
        arrayToCheck[i]['isOpen'] = true;
        array.push(arrayToCheck[i]);
      }

      if (!isOpen) {
        arrayToCheck[i]['isOpen'] = false;
        array.push(arrayToCheck[i]);
      }
    }
  }

  resetVars() {
    //reset
    this.filters = [];
    this.filters['categoria'] = '';
    this.isFiltered = false;
    this.domandeSearched = [];
    this.sondaggiSearched = [];
  }
}



