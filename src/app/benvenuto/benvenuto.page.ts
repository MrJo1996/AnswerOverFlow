import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from "../services/data.service";
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-benvenuto',
  templateUrl: './benvenuto.page.html',
  styleUrls: ['./benvenuto.page.scss'],
})
export class BenvenutoPage implements OnInit {
  codice_utente;
  constructor(private dataService: DataService, private router: Router, private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.codice_utente = this.dataService.utente['1'];
  }

  home() {
    this.dataService.loadingView(5000);//visualizza il frame di caricamento
    this.router.navigate(['home']);
  }
  
  domanda() {
    this.router.navigate(['inserisci-domanda']);
  }

  modificaProfilo() {
    this.dataService.loadingView(700);//visualizza il frame di caricamento
    this.router.navigate(['modifica-profilo']);
  }

  sondaggio() {
    this.router.navigate(['inserimento-sondaggio']);
  }

}
