import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";

import { Promise } from "q";
import { Storage } from "@ionic/storage";
import { PostServiceService } from "../services/post-service.service";
import { NavController, LoadingController } from "@ionic/angular";
import { DataService } from "../services/data.service";
import { ToastController } from "@ionic/angular";
import { ApiService } from "src/app/providers/api.service";
import { MenuController } from "@ionic/angular";
import { Observable } from "rxjs";
import { AppComponent } from "../app.component";
<<<<<<< Updated upstream
import { __await } from 'tslib';
=======
import { OneSignal } from '@ionic-native/onesignal/ngx';



>>>>>>> Stashed changes

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
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/login";

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
    private oneSignal: OneSignal
  ) {}

  ngOnInit() {
    //disable scroll (anche su ios)
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
    //Visualizza il frame di caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 1500;
    document.body.appendChild(loading);
    loading.present();

    this.router.navigate(["registrazione"]);
  }

  public recupero() {
    //Visualizza il frame di caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 1500;
    document.body.appendChild(loading);
    loading.present();

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
          console.log(data);
         
          this.checkField(data);
          this.clickLogin(!data.error, data);
        },
        (err) => {
          console.log(err.message);
        }
      );
    }
  }


  checkField(data) {
<<<<<<< Updated upstream
    if (this.username.length < 1 || this.password.length < 8) {
=======
    if (
      this.italian_bad_words_check(this.username) ||
      this.italian_bad_words_check(this.password)
    ) {


      const toast = document.createElement("ion-toast");

      toast.message = "Hai inserito una parola scorretta!";
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = "20px";
      toast.color = "danger";
      toast.style.textAlign = "center";
      document.body.appendChild(toast);
     
      return toast.present();
    } else if (this.username.length < 1 || this.password.length < 8) {
>>>>>>> Stashed changes
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
      console.log(this.dataService.getAvatar());

      this.storage.set("utente", data.data[0]);
      this.storage.set("session", true);
      console.log("false", data);
      this.click = true;
      this.storage.set("session", true);

      setTimeout(() => {
        this.storage.get("session").then((data) => {
          console.log("SESSION:" + data);
        });

        this.storage.get("utente").then((data) => {
          this.dataService.emailUtente = data.email;
          this.setupPush(data.email)
         
        });
      }, 1000);

<<<<<<< Updated upstream
      // this.storage.get('session').then(data => {
      //   this.storage.set('session', true);
      //   console.log('SESSION:' + data)
      // });
      
      //Visualizza il frame di caricamento
      const loading = document.createElement('ion-loading');
      loading.cssClass = 'loading';
      loading.spinner = 'crescent';
      loading.duration = 5000;
      document.body.appendChild(loading);
      loading.present();
      
=======
      


>>>>>>> Stashed changes
      this.router.navigate(["home"]);
    } else {
      console.log("error");

      /* this.dataService.setUtente(this.email, this.username, this.password, this.nome, this.cognome,this.bio);
       this.router.navigate(['home']);
       console.log(this.dataService.utente);*/
    }
  }





  setupPush(idUtente:string) {

    console.log(idUtente)

    this.oneSignal.startInit('8efdc866-9bea-4b12-a371-aa01f421c4f7', '424760060101');
    this.oneSignal.sendTag('email', idUtente);
    this.oneSignal.sendTag('logState','logged');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);


    this.oneSignal.handleNotificationReceived().subscribe(data => {
      
    
      this.dataService.setNotificationsState(true);
    
            
     const toast = document.createElement("ion-toast");
    
    toast.message = 'Hai ricevuto un messaggio';
      toast.duration = 2000;
      toast.position = "top";
     // toast.style.fontSize = "20px";
      toast.color = "danger";
      toast.style.textAlign = "center";
      document.body.appendChild(toast);
     
      return toast.present(); 

    });


    this.oneSignal.handleNotificationOpened().subscribe(data => {

    this.router.navigate(['chat']);
    


    });

    this.oneSignal.endInit();
    
  }





  clickOspite() {
    //Visualizza il frame di caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 5000;
    document.body.appendChild(loading);
    loading.present();
    //TODO SETTARE NOME E COGNOME COME USERNAME
    this.dataService.setUsername("");
    this.dataService.setNome("Ospite");
    this.dataService.setCognome("");

    this.storage.set("utente", false);
    this.storage.set("session", false);

    this.router.navigate(["home"]);
  }


}
