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
  domandeSearched = {};
  sondaggiSearched = {};

  constructor(private dataService: DataService, private router: Router,private apiService: ApiService) { }

  ngOnInit() {}

  ionViewWillEnter() { //carica al rendering della page
    console.log("in ionViewCanEnter")
    
    this.keyRicerca = this.dataService.getKeywordToSearch();

    this.apiService.ricercaDomanda(this.keyRicerca).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
        console.log("Domande chiamata: ", result);
        
        this.domandeSearched=result;
        console.log("domande search-res: ", result);
      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('rej domande search-res');
      }
    );

    this.apiService.ricercaSondaggio(this.keyRicerca).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
        console.log("Sondaggi chiamata: ", result);

        this.sondaggiSearched=result;
        console.log("sondaggi search-res: ", result);
  
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

  viewSondaggi(){
    //TODO stampare a video ris sondaggi

    
  }

}
