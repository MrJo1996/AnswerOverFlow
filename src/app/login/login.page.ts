import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";

import { Promise } from "q";
import { Storage } from "@ionic/storage";
import { PostServiceService } from "../services/post-service.service";
import { NavController, AlertController } from "@ionic/angular";
import { DataService } from "../services/data.service";
import { ToastController } from "@ionic/angular";
import { ApiService } from "src/app/providers/api.service";
import { MenuController } from "@ionic/angular";
import { AppComponent } from "../app.component";
import { __await } from 'tslib';

import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  click = false;
  email = "";
  username = "";
  password = "";
  nome = "";
  cognome = "";
  bio = "";

  request: Promise<any>;
  result: Promise<any>;
  url =
    "https://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/login";

  constructor(
    public apiService: ApiService,
    public toastController: ToastController,
    public dataService: DataService,
    private service: PostServiceService,
    private router: Router,
    private navctrl: NavController,
    private storage: Storage,
    private menuCtrl: MenuController,
    private menuSet: AppComponent,
    private oneSignal: OneSignal,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    //disable scroll
    var fixed = document.getElementById("fixed");
    fixed.addEventListener(
      "touchmove",
      function (e) {
        e.preventDefault();
      },
      false
    );
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.storage.get("session").then((data) => {
      console.log("SESSION:" + data);
    });
  }

  reg() {
    this.router.navigate(["registrazione"]);
  }

  public recupero() {
    this.router.navigate(["recupera-password"]);
  }

  postLogin() {
    if (this.password.length < 8) {
      const toast = document.createElement("ion-toast");
      toast.message = "Password troppo corta o non valida!";
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = "20px";
      toast.color = "danger";
      toast.style.textAlign = "center";
      document.body.appendChild(toast);
      return toast.present();
    } else {

      let postData = {
        username: this.username,
        password: this.password,
      };

      this.result = this.service.postService(postData, this.url).then(
        (data) => {
          this.request = data;

          this.checkField(data);
          this.clickLogin(!data.error, data);
        },
        (err) => {
        }
      );
    }
  }


  checkField(data) {
    if (this.username.length < 1 || this.password.length < 8) {
      const toast = document.createElement("ion-toast");
      toast.message = "Devi inserire un username valido!";
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = "20px";
      toast.color = "danger";
      toast.style.textAlign = "center";
      document.body.appendChild(toast);
      return toast.present();
    } else if (data.error == true) {
      const toast = document.createElement("ion-toast");
      toast.message = "Credenziali errate!";
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = "20px";
      toast.color = "danger";
      toast.style.textAlign = "center";
      document.body.appendChild(toast);
      return toast.present();
    }
  }

  clickLogin(condizione, data) {
    if (condizione) {
      //TODO SETTARE NOME E COGNOME COME USERNAME
      this.dataService.setUsername(data.data[0]["username"]);
      this.dataService.setNome(data.data[0]["nome"]);
      this.dataService.setCognome(data.data[0]["cognome"]);
      this.dataService.setAvatarUtente(data.data[0]["avatar"]);

      this.storage.set("utente", data.data[0]);
      this.storage.set("session", true);
      this.click = true;

      this.storage.set("session", true);

      setTimeout(() => {
        this.storage.get("session").then((data) => {});

        this.storage.get("utente").then((data) => {
          this.dataService.emailUtente = data.email;
          this.setupPush(data.email);

        });
        
      }, 1000);

      this.dataService.loadingView(5000);//Visualizza il frame di caricamento
      this.router.navigate(["home"]);
    } else {
    }
  }

  clickOspite() {
    this.dataService.loadingView(5000);//Visualizza il frame di caricamento
    //TODO SETTARE NOME E COGNOME COME USERNAME
    this.dataService.setUsername("");
    this.dataService.setNome("Ospite");
    this.dataService.setCognome("");

    this.storage.set("utente", false);
    this.storage.set("session", false);

    this.router.navigate(["home"]);
  }



  setupPush(idUtente: string) {


    this.oneSignal.startInit('8efdc866-9bea-4b12-a371-aa01f421c4f7', '424760060101');
    this.oneSignal.sendTag('email', idUtente);
    this.oneSignal.sendTag('logState','logged');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    this.oneSignal.handleNotificationReceived().subscribe(data => {  

     
      let additionalData = data.payload.additionalData;

      if(additionalData.messageType === "message"){       
        if(window.location.pathname != "/chat"){
          
          this.dataService.setNotificationsState(true);
          this.dataService.setNotificationChatId(additionalData.chatId)
          this.showToastAnswer("Hai ricetuto un messaggio");
        }
      }else{ 
        if(window.location.pathname != "/mie-attivita"){
          this.dataService.setAnswerNotificationState(true)
          this.showToastAnswer("Hanno risposto alla tua domanda");         
        }
      } 
    
    });

    this.oneSignal.handleNotificationOpened().subscribe(data => {

    });
    this.oneSignal.endInit();
  }

   showToastAnswer(message) {
    const toast = document.createElement("ion-toast");
    toast.message = message;
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = "20px";
    toast.color = "primary";
    toast.style.textAlign = "center";
    document.body.appendChild(toast);
    return toast.present();
  }
}
