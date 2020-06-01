import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

import { timer } from 'rxjs/observable/timer'; //splash

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  showSplash = true; //splash

  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Nuova domanda',
      url: '/inserisci-domanda',
      icon: 'reader'
    },
    {
      title: 'Nuovo sondaggio',
      url: '/inserimento-sondaggio',
      icon: 'trail-sign'
    },
    {
      title: 'Chat',
      url: '/visualizza-chats',
      icon: 'chatbubble-ellipses'
    },
    {
      title: 'Visualizza profilo',
      url: '/visualizza-profilo',
      icon: 'person'
    },
    {
      title: 'Le mie attività?????',
      url: '/inserimento-sondaggio',
      icon: 'swap-vertical'
    },
    {
      title: 'Info',
      url: '/info',
      icon: 'information-circle'
    },
    {
      title: 'Logout',
      icon: 'exit',
      url: '',

    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
    public alertController: AlertController
  ) {
    this.initializeApp();
  }

  nome:string;
  cognome:string;
  username: string;

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }

  }


  //ALERT E ROUTING LOGOUT---------------------------------------

  async alert() {
    const alert = await this.alertController.create({
      header: 'Vuoi effettuare il logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Si',
          handler: () => {

            this.storage.set('session', false);
            this.storage.set('utente', null);
            this.router.navigate(['login']);

            setTimeout(() => {
              this.storage.get('session').then(data => {
                console.log('SESSION:' + data)
              });
            }, 3000);

            //console.log(this.selectedIndex);
            //this.appPages[7].url = '/login';
          }
        }
      ]
    });
    await alert.present();
  }

  switch(index) {

    this.selectedIndex = index;

    if (this.selectedIndex === 7) {

      //console.log(this.appPages[7].url);
      this.alert();

    } else

      this.router.navigateByUrl(this.appPages[index].url);

  }

 /*  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
    public alertController: AlertController,

  } */

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide(); //////////////////////////

      timer(2000).subscribe(()=>this.showSplash=false); //durata animazione definita in app.component.html -> 2s (era 3.5s)
    });
  }

  goToProfile() {
    //this.dataService. = this.chatFriend_id;
    this.router.navigate(['visualizza-profilo']);
    //this.flag = false;
  }

}






