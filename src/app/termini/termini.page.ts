import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-termini',
  templateUrl: './termini.page.html',
  styleUrls: ['./termini.page.scss'],
})
export class TerminiPage implements OnInit {

  constructor(private router: Router, private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(false);
  }
  goBack(){
    //Visualizza il frame di caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 1500;
    document.body.appendChild(loading);
    loading.present();
    
    this.router.navigate(['registrazione']);
  }

}
