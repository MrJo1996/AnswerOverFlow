import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-conferma-invio-proposta',
  templateUrl: './conferma-invio-proposta.page.html',
  styleUrls: ['./conferma-invio-proposta.page.scss'],
})
export class ConfermaInvioPropostaPage implements OnInit {

  constructor(private router: Router, private dataService: DataService) { }

  cat_selezionata;
  proposta_confermata;
  
  ngOnInit() {
    this.cat_selezionata = this.dataService.getCatSelezionata();
    this.proposta_confermata = this.dataService.getNuovaProposta();
  }

  goback(){
    this.router.navigate(['proponi-categoria']);
  }
  
  goTo_insDomanda(){
    this.router.navigate(['inserisci-domanda']);
  }

  goTo_insSondaggio(){
    this.router.navigate(['inserimento-sondaggio']);
  }

  goTo_Home(){
    this.router.navigate(['home']);
  }
}