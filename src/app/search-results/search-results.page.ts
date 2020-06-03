import { Component, OnInit } from '@angular/core';
import { DataService } from "../services/data.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
})
export class SearchResultsPage implements OnInit {

  keyRicerca;
  domandeSearched = {};
  sondaggiSearched = {};

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {

    this.keyRicerca = this.dataService.getKeywordToSearch();
    this.domandeSearched = this.dataService.getSearchingResultsDomande();
    this.sondaggiSearched = this.dataService.getSearchingResultsSondaggi();
  }


  backButton() {
    this.router.navigate(['home']);
  }

  viewDomande() {
    this.domandeSearched = this.dataService.getSearchingResultsDomande();
    console.log("Domande Search: ", this.domandeSearched[0]['titolo']);
  }

  viewSondaggi(){
    this.sondaggiSearched = this.dataService.getSearchingResultsSondaggi();
    console.log("Sondaggi Search: ", this.sondaggiSearched);
  }

}
