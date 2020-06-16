import { Component, OnInit } from "@angular/core";
import { Platform, MenuController, NavController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { DataService } from "../app/services/data.service";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { AlertController } from "@ionic/angular";
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { timer } from "rxjs/observable/timer"; //splash
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  showSplash = true; //splash
  session: boolean;
  utenteLogged = true;
  avatar: string;
  nome: string;
  cognome: string;
  username: string;
  usernameLogged;

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
      blocked: false,
    },
    {
      title: "Nuova domanda",
      url: "/inserisci-domanda",
      icon: "reader",
      view: true,
      blocked: false,
    },
    {
      title: "Nuovo sondaggio",
      url: "/inserimento-sondaggio",
      icon: "trail-sign",
      view: true,
      blocked: false,
    },
    {
      title: "Chat",
      url: "/visualizza-chats",
      icon: "chatbubble-ellipses",
      view: true,
      blocked: false,
    },
    {
      title: "Ricerca",
      url: "/advanced-search",
      icon: "search",
      view: true,
      blocked: false,
    },
  ];

  public accountPages = [
    {
      title: "Profilo",
      url: "/visualizza-profilo",
      icon: "person",
      view: true,
      blocked: false,
    },
    {
      title: "Le mie attività",
      url: "/mie-attivita",
      icon: "swap-vertical",
      view: true,
      blocked: false,
    },
    {
      title: "Logout",
      icon: "exit",
      url: "",
      view: true,
      blocked: false,
    },
    {
      title: "Login",
      icon: "enter",
      url: "/login",
      view: false,
      blocked: false,
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
    private menuCtrl: MenuController,
    private oneSignal: OneSignal,
    private network: Network
  ) {

    this.initializeApp();

    //Check connection (provider in app.module)
    this.network.onDisconnect().subscribe(() => {
      this.toast("Nessuna connessione ad Internet.", "danger");
    });
  }

  //ALERT E ROUTING LOGOUT---------------------------------------

  async alert() {
    const alert = await this.alertController.create({
      header: "Vuoi effettuare il logout?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Si",
          handler: () => {
            this.storage.set("session", false);
            this.storage.set("utente", null);

            //WARNING: HOT!!!
            this.storage.remove("utente"); //pulisce tutto sotto key "utente"
            this.storage.remove("session"); //pulisce tutto sotto key "session"

            this.dataService.setSession(false);
            this.router.navigate(["login"]);
            this.setupPushNotification();

            setTimeout(() => {
              this.storage.get("session").then((data) => {});
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
      message:
        "Per usare questo servizio devi effettuare l'accesso, vuoi farlo?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Si",
          handler: () => {
            this.storage.set("session", false);
            this.storage.set("utente", null);
            this.dataService.setSession(false);
            this.router.navigate(["login"]);

            setTimeout(() => {
              this.storage.get("session").then((data) => {});
            }, 3000);
          },
        },
      ],
    });
    await alert.present();
  }

  checkUserLogged() {
    this.storage.get("session").then((data) => {
      if (!data) {

        this.accountPages[2].view = false;
        this.accountPages[3].view = true;
        this.appPages[1].blocked = true;
        this.appPages[2].blocked = true;
        this.appPages[3].blocked = true;
        this.accountPages[0].blocked = true;
        this.accountPages[1].blocked = true;
        this.nome = "Ospite"
        this.cognome = ""
        this.username = ""
        this.avatar = ""
        this.utenteLogged = false;

      } else {

        this.accountPages[2].view = true;
        this.accountPages[3].view = false;
        this.appPages[1].blocked = false;
        this.appPages[2].blocked = false;
        this.appPages[3].blocked = false;
        this.accountPages[0].blocked = false;
        this.accountPages[1].blocked = false;

        this.storage.get('utente').then(utente => {
          this.nome = utente.nome;
          this.cognome = utente.cognome;
          this.username = utente.username;
          this.avatar = utente.avatar;
        });
        this.utenteLogged = true;
      }
    });
  }

  reloadUserInfo() {
    this.nome = this.dataService.getNome()
    this.cognome = this.dataService.getCognome()
    this.username = this.dataService.getUsername()
    this.avatar = this.dataService.getAvatar()
  }

  switch(index, page) {
    if (this.utenteLogged) {
      switch (page) {
        case "app":
          this.selectedIndex = index;
          if (this.appPages[index].title === 'Chat') {
            this.dataService.setNotificationsState(false)
          }
          this.router.navigateByUrl(this.appPages[index].url);
          this.selectedIndexAccount = -1;
          break;
        case "account":
          this.selectedIndexAccount = index;
          if (this.accountPages[index].title === "Logout") {
            this.alert();
          } else if (this.accountPages[index].title === "Profilo") {
            this.router.navigateByUrl("/visualizza-profiloutente");
          } else if(this.accountPages[index].title  === "Le mie attività") {
            this.dataService.setAnswerNotificationState(false);
            this.router.navigateByUrl(this.accountPages[index].url);
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
          if (this.appPages[index].title === "Home" || this.appPages[index].title === "Ricerca") {
            this.dataService.loadingView(5000);//visualizza il frame di caricamento
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

      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#2a2a2a');
      this.splashScreen.hide();
      timer(2000).subscribe(() => (this.showSplash = false)); //durata animazione definita in app.component.html -> 2s 

      
      
      

      this.storage.get("tutorialComplete").then((isComplete) => {
        if (isComplete) { //Tutorial completato
          this.storage.get("utente").then((utente) => { //Check utente logged
            if (utente.username === null || utente.username == undefined) { //nav to LOGIN
              this.router.navigate(['login']);
            } else { //nav to HOME
              //Set Service vars
              this.dataService.setEmail_Utente(utente.email);
              this.dataService.loadingView(5000);//visualizza il frame di caricamento
              this.router.navigate(['home']);
              this.toast("Bentornato " + utente.username + "!", "success");
            }
          });
        } else {
          this.router.navigate(['slides']);
        }
      });
    });

    this.storage.get("session").then((data) => {
      this.dataService.setSession(data);
      this.session = data;

      this.setupPushNotification();
      
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
    if (this.utenteLogged) {
      this.dataService.emailOthers = "undefined";
      this.menuCtrl.close();
      this.router.navigate(["visualizza-profiloutente"]);
    } else {
      this.alertOspite();
    }
  }

  goToInfo() {
    this.menuCtrl.close();
    this.router.navigate(["info"]);
  }

  setupPushNotification() {
    this.oneSignal.startInit('8efdc866-9bea-4b12-a371-aa01f421c4f7', '424760060101');
    this.oneSignal.clearOneSignalNotifications()

    if(this.session === true){
      this.oneSignal.sendTag('logState', 'logged');
    } else{
      this.oneSignal.sendTag('logState', 'unlogged');
    }

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    this.oneSignal.handleNotificationReceived().subscribe(data => {

      
      let additionalData = data.payload.additionalData;
     
      if(additionalData.messageType === "message"){
              
        this.dataService.setNotificationsState(true);
        this.toast("Hai ricetuto un messaggio","primary");
      }else{
        this.dataService.setAnswerNotificationState(true)
        this.toast("Hanno risposto alla tua domanda","primary");
      } 
    });

    this.oneSignal.handleNotificationOpened().subscribe(data => {  
    });

    this.oneSignal.endInit();

  }

  toast(txt: string, color: string) {
    const toast = document.createElement("ion-toast");
    toast.message = txt;
    toast.duration = 2000;
    toast.position = "top";
    toast.color = color;
    document.body.appendChild(toast);
    return toast.present();
  }

}
