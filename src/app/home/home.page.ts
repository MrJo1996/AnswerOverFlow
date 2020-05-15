import { Component, OnInit } from '@angular/core';
import { PostServiceService } from "../services/post-service.service";
import { DataService } from "../services/data.service";
import { ApiService } from '../providers/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  i;
  currentMailUser = "gmailverificata"//mail dell'utente corrente
  domande;
  domandaMailUser ;//mail dell'utente che ha fatto la domanda
  domandaNomeUser = " ";//nome e cognome dell'utente che ha fatto la domanda

  constructor(private apiService: ApiService,private service: PostServiceService, private dataService: DataService, private router: Router) { }
  
  ngOnInit() {
    this.visualizzaDomandaHome();
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
  clickDomanda(i){
    this.dataService.codice_domanda = i;
    console.log(this.dataService.codice_domanda);
    this.router.navigate(['/visualizza-domanda']);
  }
}