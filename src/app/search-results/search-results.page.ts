import { Component, OnInit } from '@angular/core';
import { DataService } from "../services/data.service";
import { Router } from '@angular/router';
import { ApiService } from '../providers/api.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
})
export class SearchResultsPage implements OnInit {

  keyRicerca;

  domandeSearched;
  sondaggiSearched;
  utentiSearched;

  numDomande;
  numSondaggi;
  numUtenti;

  categorie=[];

  categorieSondaggi= [];

keywordToSearch;

  sondaggiButton;
  domandeButton = true;
  utentiButton;

  


  constructor(private dataService: DataService, private router: Router, private apiService: ApiService) { }

  ngOnInit(){

    
  }
   

  ionViewWillEnter() { //carica al rendering della page
    console.log("in ionViewCanEnter")

    this.keyRicerca = this.dataService.getKeywordToSearch();

    //DOMANDE
    this.apiService.ricercaDomanda(this.keyRicerca).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
        console.log("Domande chiamata: ", result);

        this.domandeSearched = result;
        console.log("domande search-res: ", this.domandeSearched);

        this.numDomande = this.domandeSearched.length;

        var i;
        for (i = 0; i < this.numDomande; i++) {
           this.parseCodCat(this.domandeSearched[i].cod_categoria, i); 
          //console.log("Primo ciclo Categoria domanda",i," ", this.domandeSearched[i].cod_categoria);
        }

      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('rej domande search-res');
      }
    );

    //SONDAGGI
    this.apiService.ricercaSondaggio(this.keyRicerca).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
        console.log("Sondaggi chiamata: ", result);

        this.sondaggiSearched = result;
        console.log("sondaggi search-res: ", this.sondaggiSearched.length);
        this.numSondaggi = this.sondaggiSearched.length;

        var i;

        for(i=0; i< this.numSondaggi; i++){
          this.parseCodCatSondaggi(this.sondaggiSearched[i].cod_categoria, i);
      
        }

      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('rej sondaggi search-res');
      }
    );

    //UTENTI

    this.apiService.ricercaUtente(this.keyRicerca).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
        console.log("Utenti chiamata: ", result);

        this.utentiSearched = result;
        console.log("Utenti search-res: ", this.utentiSearched.length);
        this.numUtenti = this.utentiSearched.length;

        console.log("utente: ", this.utentiSearched[0].nome);

        /*var i;
        for(i=0; i< this.numUtenti; i++){
          this.parseCodCatSondaggi(this.sondaggiSearched[i].cod_categoria, i);
      
        } */

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

  viewUtenti(){

    this.sondaggiButton = false;
    this.domandeButton = false;
    this.utentiButton = true;
    console.log('bottone true')

  }

    async parseCodCat(codice_cat, index) {
    //set categorieToView
    console.log("", codice_cat,index);

      this.apiService.getCategoria(codice_cat).then(
        (categoria) => {
          this.categorie[index] = categoria['Categoria']['data'][0].titolo;
          console.log("COD parsato",index," ", this.categorie[index]);
        },
        (rej) => {
          console.log("C'è stato un errore durante la visualizzazione");
        }
      );
  }

  async parseCodCatSondaggi(codice_cat, index) {
    //set categorieToView
    console.log("", codice_cat,index);

      this.apiService.getCategoria(codice_cat).then(
        (categoria) => {
          this.categorieSondaggi[index] = categoria['Categoria']['data'][0].titolo;
          console.log("COD parsato sondaggi",index," ", this.categorieSondaggi[index]);
        },
        (rej) => {
          console.log("C'è stato un errore durante la visualizzazione");
        }
      );
  }

  ricerca() {
    console.log("Input: ", this.keywordToSearch);

    this.dataService.setKeywordToSearch(this.keywordToSearch);
    this.ionViewWillEnter();
    console.log("aa");

  }


  
}