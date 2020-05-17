import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from "../services/data.service";
@Component({
  selector: 'app-benvenuto',
  templateUrl: './benvenuto.page.html',
  styleUrls: ['./benvenuto.page.scss'],
})
export class BenvenutoPage implements OnInit {
  codice_utente;
  constructor(private dataService: DataService,private router: Router) { }

  ngOnInit() {
    this.codice_utente=this.dataService.email;
  }

  home() {
    this.router.navigate(['home']);
  }
  domanda() {
    this.router.navigate(['inserisci-domanda']);
  }
  modificaProfilo() {
    this.router.navigate(['modifica-profilo']);
  }


}
