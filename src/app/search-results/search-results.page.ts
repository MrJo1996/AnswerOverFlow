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

  numDomande;
  numSondaggi;

  categorie=[];

  constructor(private dataService: DataService, private router: Router, private apiService: ApiService) { }

  ngOnInit() { }

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
          console.log("Primo ciclo Categoria domanda",i," ", this.domandeSearched[i].cod_categoria);
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


      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('rej sondaggi search-res');
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
    //TODO stampare a video ris domande
    console.log("Domande Search: ", this.domandeSearched[0]['titolo']);
  }

  viewSondaggi() {
    //TODO stampare a video ris sondaggi

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


}
