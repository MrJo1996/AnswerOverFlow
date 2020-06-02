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
  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.keyRicerca = this.dataService.getKeywordToSearch();
  }


  backButton() {
    this.router.navigate(['home']);
  }

}
