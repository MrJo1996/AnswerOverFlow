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
    this.dataService.loadingView(5000);//visualizza il frame di caricamento
    this.storage.get('utente').then(data => { this.currentMailUser = data.email });
  }


  ionViewWillEnter() { //carica al rendering della page

    this.keyRicerca = this.dataService.getKeywordToSearch();

    //check presenza filtri
    this.filters = this.dataService.getFilters();
    console.log("FILTRI ", this.filters);

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
      this.isFiltered = true;
    } else {
      this.domandeButton = true;
    }


    //DOMANDE
    this.apiService.ricercaDomanda(this.keyRicerca).then(
      (result) => {

        if (result != undefined) {
          console.log("Domande chiamata: ", this.domandeSearched);

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
                  } else { //sia aperti che chiusi che combaciano con la categoria
                    //this.domandeSearched.push(result['data'][i]);
                    this.checkDeadLine(result['data'][i], this.domandeSearched);

                  }

                }
              }
            }
            console.log("CHECK DEADLINE DOMANDE", this.domandeSearched);

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

    //SONDAGGI
    this.apiService.ricercaSondaggio(this.keyRicerca).then(
      (result) => { // nel caso in cui va a buon fine la chiamata

        if (result != undefined) {
          console.log("sondaggi chiamata: ", result);

          if (this.isFiltered) {

            for (var i = 0; i < result['data'].length; i++) {
              if (this.filters['codCategoria'] != "") {
                if (result['data'][i].cod_categoria == this.filters['codCategoria'] && result['data'][i] != undefined) {
                  //Chech stato (Aperto/Chiuso/Entrambi)
                  if (this.filters['status'] != 'both') {
                    //Stato aperto/chiuso che combaciano con la categoria
                    this.checkDeadLine(result['data'][i], this.sondaggiSearched);
                  } else { //sia aperti che chiusi che combaciano con la categoria
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

    //UTENTI
    this.apiService.ricercaUtente(this.keyRicerca).then(
      (result) => {

        if (result != undefined) {

          console.log("utenti: ", result)

          this.utentiSearched = result['data'];
          console.log("Utenti search-res: ", this.utentiSearched);
          this.numUtenti = this.utentiSearched.length;

        } else {
          this.numUtenti = 0;
          console.log("non ci sono utenti");
        }

      },
      (rej) => {
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

    this.dataService.loadingView(5000);//visualizza il frame di caricamento

    this.dataService.setKeywordToSearch(this.keywordToSearch);
    this.isFiltered = false;
    this.domandeSearched = [];
    this.sondaggiSearched=[];
    this.utentiSearched=[];
    
    this.ionViewWillEnter();
  }

  ionViewDidLeave() {
    this.resetVars();
    //this.dataService.setFilters("", "", "", false); //da qui non permette di ricercare nuovamente secondo quei filtri

  }

  ngOnDestroy() {
    this.resetVars;
    this.dataService.setFilters("", "", "", false); //mettere in back o btn menu
    console.log("NEL DESTROY");
  }

  clickFilter() {
    this.resetVars();
/*     this.router.navigate(['/advanced-search']);
 */
    this.router.navigateByUrl("/advanced-search");

  }

  clickUtente(cod_utente) {
    this.dataService.loadingView(5000);//visualizza il frame di caricamento
    this.dataService.setEmailOthers(cod_utente);
    console.log(this.dataService.setEmailOthers);

/*     this.dataService.setFilters(this.filters['tipo'], this.filters['codCategoria'], this.filters['status'], this.filters['isFiltered']);
 */
    this.router.navigate(['/visualizza-profilo']);
  }

  clickDomanda(domanda_codice) {
    this.dataService.loadingView(5000);//visualizza il frame di caricamento
    this.dataService.setCod_domanda(domanda_codice);
/*     this.dataService.setFilters(this.filters['tipo'], this.filters['codCategoria'], this.filters['status'], this.filters['isFiltered']);
 */
    this.router.navigate(['/visualizza-domanda']);
    

  }

  clickSondaggio(codice_sondaggio) {
    this.dataService.loadingView(5000);//visualizza il frame di caricamento
    this.dataService.codice_sondaggio = codice_sondaggio;
/*     this.dataService.setFilters(this.filters['tipo'], this.filters['codCategoria'], this.filters['status'], this.filters['isFiltered']);
 */
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

    console.log(isOpen);

    if (this.filters['status'] == 'closed') {
      if (isOpen) {
        itemToCheck['isOpen'] = true;
        array.push(itemToCheck);
        console.log(itemToCheck);
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
        console.log(itemToCheck);
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

      console.log(isOpen);

      if (isOpen) {
        arrayToCheck[i]['isOpen'] = true;
        array.push(arrayToCheck[i]);
        console.log(arrayToCheck[i]);
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



