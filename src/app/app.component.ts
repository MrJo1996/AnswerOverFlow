import { Component, OnInit } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { DataService } from "../app/services/data.service";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { AlertController } from "@ionic/angular";



import { timer } from "rxjs/observable/timer"; //splash

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  showSplash = true; //splash

  public selectedIndex = 0;
  public appPages = [
    {
      title: "Home",
      url: "/home",
      icon: "home",
      view: true,
    },
    {
      title: "Nuova domanda",
      url: "/inserisci-domanda",
      icon: "reader",
      view: true,

    },
    {
      title: "Nuovo sondaggio",
      url: "/inserimento-sondaggio",
      icon: "trail-sign",
      view: true,

    },
    {
      title: "Chat",
      url: "/visualizza-chats",
      icon: "chatbubble-ellipses",
      view: true,

    },
    {
      title: "Visualizza profilo",
      url: "/visualizza-profilo",
      icon: "person",
      view: true,

    },
    {
      title: "Le mie attività?????",
      url: "/inserimento-sondaggio",
      icon: "swap-vertical",
      view: true,

    },
    {
      title: "Info",
      url: "/info",
      icon: "information-circle",
      view: true,

    },
    {
      title: "Logout",
      icon: "exit",
      url: "",
      view: true,

    },
    {
      title: "Login",
      icon: "exit",
      url: "/login",
      view: false,

    },
  ];

  async alert() {
    const alert = await this.alertController.create({
      header: "Vuoi uscire?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Si",
          handler: () => {
            this.storage.set("session", false);
            this.storage.set("utente", null);

            this.router.navigate(["login"]);

            setTimeout(() => {
              this.storage.get("session").then((data) => {
                console.log("login ha settato bene " + data);
              });
            }, 3000);

            //console.log(this.selectedIndex);
            //this.appPages[7].url = '/login';
          },
        },
      ],
    });
    await alert.present();
  }

  switch(index) {
    this.selectedIndex = index;
    
    if (this.appPages[this.selectedIndex ].title === "Logout") {
      this.alert();
    } else if(this.appPages[this.selectedIndex ].title === "Visualizza profilo"){
      this.dataService.emailOthers = "undefined";    
     // this.navCtrl.navigateForward(this.appPages[index].url)
       this.router.navigateByUrl(this.appPages[index].url)
      
    }else
    this.router.navigateByUrl(this.appPages[index].url);
   
   
      /* 
    switch (this.appPages[this.selectedIndex].title) {
      case "Logout":
        this.alert();
        break;
      case "Visualizza profilo":
        
        this.router.navigateByUrl(this.appPages[index].url);
        break;
      default:
        break;
    } */

    


  }

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
    public alertController: AlertController,
    public dataService: DataService,
    public navCtrl:NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide(); //////////////////////////
      
      
      timer(2000).subscribe(() => (this.showSplash = false)); //durata animazione definita in app.component.html -> 2s (era 3.5s)
    });
  }

  ngOnInit() {

    

    const path = window.location.pathname.split("folder/")[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }
  }
}
