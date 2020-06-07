import { Component, OnInit } from "@angular/core";

import { Platform, MenuController, NavController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { DataService } from "../app/services/data.service";
import { Router } from "@angular/router";
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

  utenteLogged = true;

  public selectedIndex = -1;
  public selectedIndexAccount = -1;
  classItem = false;
  accountMenu: any;

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
  ];

  public accountPages = [
    {
      title: "Visualizza profilo",
      url: "/visualizza-profilo",
      icon: "person",
      view: true,
    },
    {
      title: "Le mie attività",
      url: "/mie-attivita",
      icon: "swap-vertical",
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
      icon: "enter",
      url: "/login",
      view: false,
    },
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
    public alertController: AlertController,
    public dataService: DataService,
    public navCtrl: NavController,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();
  }

  username = this.dataService.getUsername();

  ionViewWillEnter() {}

  /* {
    title: "Info",
    url: "/info",
    icon: "information-circle",
    view: true,
  },
 */

  //ALERT E ROUTING LOGOUT---------------------------------------

  async alert() {
    const alert = await this.alertController.create({
      header: "Vuoi effettuare il logout?",
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
            this.dataService.setSession(false);
            this.router.navigate(["login"]);

            setTimeout(() => {
              this.storage.get("session").then((data) => {
                console.log("SESSION:" + data);
              });
            }, 3000);
          },
        },
      ],
    });
    await alert.present();
  }

  async alertOspite() {
    const alert = await this.alertController.create({
      header: "Ospite",
      message: "Per accedere a questa funzionalità devi accedere, vuoi continuare?",
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
            this.dataService.setSession(false);
            this.router.navigate(["login"]);

            setTimeout(() => {
              this.storage.get("session").then((data) => {
                console.log("SESSION:" + data);
              });
            }, 3000);
          },
        },
      ],
    });
    await alert.present();
  }

  //-----------------------------------
  checkUserLogged() {
    this.storage.get("session").then((data) => {
      if (!data) {
        this.accountPages[2].view = false;
        this.accountPages[3].view = true;

        this.utenteLogged = false;
      }
    });
  }

  /*  switch2 (index) {

    //this.selectedIndexAccount = index;
    this.selectedIndex = index;

    
    if (this.appPages[index].title === "Logout") {
      this.alert();
    } else  if(this.appPages[index].title === "Visualizza profilo") {
      this.dataService.emailOthers = "undefined";
      this.router.navigateByUrl(this.appPages[index].url);
    } else{
        this.router.navigateByUrl(this.appPages[index].url);
      }

  } */

  switch(index, page) {
    if(this.utenteLogged){
      switch (page) {
        case "app":
          this.selectedIndex = index;
          this.router.navigateByUrl(this.appPages[index].url);
          this.selectedIndexAccount = -1;
          break;
        case "account":
          this.selectedIndexAccount = index;
  
          if (this.accountPages[index].title === "Logout") {
            this.alert();
          } else if (this.accountPages[index].title === "Visualizza profilo") {
            //console.log(window.location.pathname)
            this.dataService.emailOthers = "undefined";
            this.router.navigateByUrl("/visualizza-profiloutente");
  
            //this.router.navigateByUrl(this.accountPages[index].url);
          } else {
            this.router.navigateByUrl(this.accountPages[index].url);
          }
          this.selectedIndex = -1;
  
          break;
        default:
          break;
      }
    } else {
      switch (page) {
        case "app":
          this.selectedIndex = index;
          if (this.appPages[index].title === "Home") {
            this.router.navigateByUrl(this.appPages[index].url);
          } else {
            this.alertOspite();
          }
          this.selectedIndexAccount = -1;
          break;

        case "account":
          this.selectedIndexAccount = index;
  
          if (this.accountPages[index].title === "Login") {
            this.router.navigateByUrl(this.accountPages[index].url);
          } else {
            this.alertOspite();
          }
          this.selectedIndex = -1;
  
          break;
        default:
          break;
    }
  }
}

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide(); //////////////////////////
      timer(2000).subscribe(() => (this.showSplash = false)); //durata animazione definita in app.component.html -> 2s (era 3.5s)
    });

    this.storage.get("session").then((data) => {
      console.log("SESSION:" + data);
      this.dataService.setSession(data);
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split("folder/")[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
      this.selectedIndex = this.accountPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }
  }

  goToProfile() {
    this.dataService.emailOthers = "undefined";
    this.router.navigate(["visualizza-profiloutente"]);
    this.menuCtrl.close();
  }

  goToInfo() {
    this.router.navigate(["info"]);
    this.menuCtrl.close();
  }
}
