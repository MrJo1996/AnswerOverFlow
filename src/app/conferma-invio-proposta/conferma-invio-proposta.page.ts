import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Storage } from '@ionic/storage';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-conferma-invio-proposta',
  templateUrl: './conferma-invio-proposta.page.html',
  styleUrls: ['./conferma-invio-proposta.page.scss'],
})
export class ConfermaInvioPropostaPage implements OnInit {

  constructor(private router: Router, private menuCtrl: MenuController, private dataService: DataService, private storage: Storage) { }

  cat_selezionata;
  proposta_confermata;
  cod_utente;
  
  ngOnInit() {
    this.cat_selezionata = this.dataService.getCatSelezionata();
    this.proposta_confermata = this.dataService.getNuovaProposta();
    this.storage.get('utente').then(
      (data)=>{
        this.cod_utente = data.email
      });
  }

  goback(){
    this.router.navigate(['proponi-categoria']);
  }

  openMenu(){
    this.menuCtrl.open();
  }
}