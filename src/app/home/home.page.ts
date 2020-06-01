import { Component, OnInit } from '@angular/core';
import { PostServiceService } from "../services/post-service.service";
import { DataService } from "../services/data.service";
import { ApiService } from '../providers/api.service';
import { Router } from '@angular/router';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  codice_domanda;
  codice_sondaggio
  currentMailUser = ""//mail dell'utente corrente
  domande;
  sondaggi;
  domandaMailUser;//mail dell'utente che ha fatto la domanda
  domandaNomeUser = " ";//nome e cognome dell'utente che ha fatto la domanda

  constructor(private storage: Storage, private apiService: ApiService, private service: PostServiceService, private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.visualizzaDomandaHome();
    this.visualizzaSondaggiHome();
    this.storage.get('utente').then(data => { this.currentMailUser = data.email });
  }

  async visualizzaDomandaHome() {
    this.apiService.getDomandaHome().then(
      (domande) => {
        console.log('Visualizzato con successo');

        this.domande = domande; //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML

        console.log('Domanda: ', this.domande);

      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );

  }
  async visualizzaSondaggiHome() {
    this.apiService.getSondaggioHome().then(
      (sondaggi) => {
        console.log('Visualizzato con successo');

        this.sondaggi = sondaggi; //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML

        console.log('Sondaggi: ', this.sondaggi);

      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );

  }

  clickDomanda(codice_domanda) {
    this.dataService.codice_domanda = codice_domanda;
    console.log(this.dataService.codice_domanda);
    this.router.navigate(['/visualizza-domanda']);
  }

  clickSondaggio(codice_sondaggio) {
    this.dataService.codice_sondaggio = codice_sondaggio;
    console.log(this.dataService.codice_sondaggio);
    this.router.navigate(['/visualizza-sondaggio']);
  }

  doRefresh(event) {
    this.visualizzaDomandaHome();
    this.visualizzaSondaggiHome();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }



  
}

