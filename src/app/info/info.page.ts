import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {


  constructor(private router: Router, private menuCtrl: MenuController) { }

  ngOnInit() {
  }


  goback(){
    //Visualizza il frame di caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 3500;
    document.body.appendChild(loading);
    loading.present();

    this.router.navigate(['home']);
  }

  openMenu(){
    this.menuCtrl.open();
  }

}

