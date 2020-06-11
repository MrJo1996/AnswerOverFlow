import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-conferma-recupero',
  templateUrl: './conferma-recupero.page.html',
  styleUrls: ['./conferma-recupero.page.scss'],
})
export class ConfermaRecuperoPage implements OnInit {

  constructor(private router: Router, private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(false);
  }

  goback(){
    //Visualizza il frame di caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 1500;
    document.body.appendChild(loading);
    loading.present();

    this.router.navigate(['recupera-password'])
  }

  goTo_login(){
    //Visualizza il frame di caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 1500;
    document.body.appendChild(loading);
    loading.present();
    
    this.router.navigate(['login']);
  }
}
