import { Component, OnInit } from "@angular/core";
import { AlertController, MenuController } from "@ionic/angular";
import { DataService } from "../services/data.service";
import { ApiService } from "src/app/providers/api.service";
import { NavController } from "@ionic/angular";
import { PickerController } from "@ionic/angular";
import { ToastController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";
import { AppComponent } from "../app.component";
import { PostServiceService } from "../services/post-service.service";

@Component({
  selector: "app-modifica-profilo",
  templateUrl: "./modifica-profilo.page.html",
  styleUrls: ["./modifica-profilo.page.scss"],
})
export class ModificaProfiloPage implements OnInit {
  email: string;
  avatar: string;
  objUtente: any = 
    {
      username: "",
      nome: "",
      cognome: "",
      avatar: "",
      email: ""
    };

  usernameToPass: string;
  nomeToPass: string;
  cognomeToPass: string;
  bioToPass: string;
  password: string;

  usernameView: string;
  nomeView: string;
  cognomeView: string;
  bioView: string;

  profilo = {};
  usernameAvailable: boolean;
  urlControlloUsername =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaprofiloperusername";

  constructor(
    private router: Router,
    private dataService: DataService,
    public alertController: AlertController,
    public apiService: ApiService,
    public navCtrl: NavController,
    private menuSet: AppComponent,
    public toastController: ToastController,
    private menuCrtl: MenuController,
    private servicePost: PostServiceService,
    private storage: Storage
  ) {}

  ngOnInit() {
  }

  //Controlla se l'username inserito è disponibile, illumina l'icon in base alla risposta del server
  checkForUser(usernameInserted) {
    console.log(this.usernameToPass);
    let postData = {
      username: usernameInserted,
    };
    if (this.profilo["0"].username === usernameInserted) {
      document.getElementById("usernameIcon").style.color = "";
      this.usernameAvailable = true;
    } else {
      this.servicePost.postService(postData, this.urlControlloUsername).then(
        (data) => {
          console.log(data);
          if (data["error"] == true) {
            document.getElementById("usernameIcon").style.color = "#4ED552";
            this.usernameAvailable = true;
          } else {
            document.getElementById("usernameIcon").style.color = "#DA4141";
            this.usernameAvailable = false;
          }
        },
        (err) => {
          console.log(err.message);
        }
      );
    }
  }

  ionViewWillEnter() {
    console.log(this.dataService.avatarTemporary);
    switch (this.dataService.avatarTemporary) {
      case undefined:
        this.showSurvey();
        break;
      case "clicked":
        break;
      default:
        this.avatar = this.dataService.avatarTemporary;
        break;
    }
  }

  ionViewDidLeave() {}

  async showSurvey() {
    this.storage.get("utente").then((data) => {
      this.email = data.email;
      this.apiService.getProfilo(this.email).then(
        (profilo) => {
          console.log("Visualizzato con successo");

          this.profilo = profilo["data"]; //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
          console.log("Profilo: ", this.profilo["0"]);

          this.usernameView = this.profilo["0"].username;
          this.nomeView = this.profilo["0"].nome;
          this.cognomeView = this.profilo["0"].cognome;
          this.bioView = this.profilo["0"].bio;
          this.avatar = this.profilo["0"].avatar;
          console.log(this.avatar);
        },
        (rej) => {
          console.log("C'è stato un errore durante la visualizzazione");
        }
      );
    });
  }

  selectAvatar() {
    this.dataService.loadingView(5000);//visualizza il frame di caricamento
    this.dataService.settaTemporaryAvatar("clicked");
    this.router.navigate(["/modifica-avatar"]);
  }

  goBack() {
    this.dataService.settaTemporaryAvatar(undefined);
    // this.router.navigate(['/visualizza-profilo'])
    this.navCtrl.back();
  }

  async popupConfermaModificaProfilo() {
    const alert = await this.alertController.create({
      header: "Conferma modifiche",
      message: "Vuoi confermare le modifiche effettuate?",
      buttons: [
        {
          text: "Annulla",
          role: "cancel",
        },
        {
          text: "Conferma",
          handler: (value: any) => {
            //LANCIO SERVIZIO MODIFICA UNA VOLTA CLICCATO "CONFERMA"
            this.modify();

            //TODO mostrare messaggio di avvenuta modifica e riportare alla home
          },
        },
      ],
    });

    await alert.present();
    let result = await alert.onDidDismiss();
  }

  async modify() {
    if (this.usernameToPass == null) {
      this.usernameToPass = this.usernameView;
    }
    if (this.nomeToPass == null) {
      this.nomeToPass = this.nomeView;
    }

    if (this.cognomeToPass == null) {
      this.cognomeToPass = this.cognomeView;
    }

    if (this.bioToPass == null) {
      this.bioToPass = this.bioView;
    }
    if (!this.usernameAvailable) {
      this.popupUsernameUnavailable();
    } else if (this.stringUsernameLengthChecker()) {
      this.popupInvalidUsername();
    } else if (this.stringNameLengthChecker()) {
      this.popupInvalidName();
    } else if (this.stringCognomeLengthChecker()) {
      this.popupInvalidSurname();
    } else if (this.stringBioLengthChecker()) {
      this.popupInvalidBio();
    } else if (
      this.checkIfThereAreEnglishBadWords(this.usernameToPass) ||
      this.checkIfThereAreItalianBadWords(this.usernameToPass) ||
      this.checkIfThereAreEnglishBadWords(this.nomeToPass) ||
      this.checkIfThereAreItalianBadWords(this.nomeToPass) ||
      this.checkIfThereAreEnglishBadWords(this.bioToPass) ||
      this.checkIfThereAreItalianBadWords(this.bioToPass)
    ) {
      this.toastParolaScoretta();
    } else {
      this.dataService.setUsername(this.usernameToPass);
      this.dataService.setNome(this.nomeToPass);
      this.dataService.setCognome(this.cognomeToPass);
      this.dataService.setAvatarUtente(this.avatar);
      this.dataService.setEmail_Utente(this.email);
      console.log(this.usernameToPass);
      this.objUtente["username"] = this.usernameToPass;
      this.objUtente["nome"] = this.nomeToPass;
      this.objUtente["cognome"] = this.cognomeToPass;
      this.objUtente["avatar"] = this.avatar;
      this.objUtente["email"] = this.email;
      this.storage.set("utente", this.objUtente);
      this.storage.get("utente").then ((data) => {console.log("STORAGE ATTUALE", data)})
      console.log("Email attuale nel data service",this.dataService.getEmail_Utente())

      if (this.password) {
        this.apiService
          .modificaProfilo(
            this.usernameToPass,
            this.password,
            this.nomeToPass,
            this.cognomeToPass,
            this.bioToPass,
            this.email,
            this.avatar
          )
          .then(
            (result) => {
              console.log("Modifica avvenuta con successo");
            },
            (rej) => {
              console.log("Modifica non effetutata");
            }
          );
      } else {
        this.apiService
          .modificaProfiloNoPass(
            this.usernameToPass,
            this.nomeToPass,
            this.cognomeToPass,
            this.bioToPass,
            this.email,
            this.avatar
          )
          .then(
            (result) => {
              console.log("Modifica avvenuta con successo");
            },
            (rej) => {
              console.log("Modifica non effetutata");
            }
          );
      }
      this.dataService.settaTemporaryAvatar(undefined);
      this.menuSet.reloadUserInfo();
      this.toastSuccess();
      this.navCtrl.back();
    }
  }

  stringUsernameLengthChecker(): boolean {
    if (
      this.usernameToPass.length > 20 ||
      !this.usernameToPass.match(/[a-zA-Z0-9_]+/)
    ) {
      return true;
    } else {
      return false;
    }
  }
  stringNameLengthChecker(): boolean {
    if (
      this.nomeToPass.length > 20 ||
      !this.nomeToPass.match(/[a-zA-Z0-9_]+/)
    ) {
      return true;
    } else {
      return false;
    }
  }
  stringCognomeLengthChecker(): boolean {
    if (
      this.cognomeToPass.length > 20 ||
      !this.cognomeToPass.match(/[a-zA-Z0-9_]+/)
    ) {
      return true;
    } else {
      return false;
    }
  }
  stringBioLengthChecker(): boolean {
    if (this.bioToPass.length > 200 || !this.bioToPass.match(/[a-zA-Z0-9_]+/)) {
      return true;
    } else {
      return false;
    }
  }
  async popupInvalidUsername() {
    const toast = document.createElement("ion-toast");
    toast.message =
      "ERRORE! Hai lasciato l username vuoto o hai superato la lunghezza massima!";
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = "20px";
    toast.color = "danger";
    toast.style.textAlign = "center";
    document.body.appendChild(toast);
    return toast.present();
  }
  async popupInvalidName() {
    const toast = document.createElement("ion-toast");
    toast.message =
      "ERRORE! Hai lasciato il nome vuoto o hai superato la lunghezza massima!";
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = "20px";
    toast.color = "danger";
    toast.style.textAlign = "center";
    document.body.appendChild(toast);
    return toast.present();
  }
  async popupInvalidSurname() {
    const toast = document.createElement("ion-toast");
    toast.message =
      "ERRORE! Hai lasciato il cognome vuoto o hai superato la lunghezza massima!";
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = "20px";
    toast.color = "danger";
    toast.style.textAlign = "center";
    document.body.appendChild(toast);
    return toast.present();
  }
  async popupUsernameUnavailable() {
    const toast = document.createElement("ion-toast");

    toast.message = "Username non disponibile";
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = "20px";
    toast.color = "danger";
    toast.style.textAlign = "center";

    document.body.appendChild(toast);
    return toast.present();
  }
  async popupInvalidBio() {
    const toast = document.createElement("ion-toast");
    toast.message =
      "ERRORE! Hai lasciato la bio vuota o hai superato la lunghezza massima!";
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = "20px";
    toast.color = "danger";
    toast.style.textAlign = "center";
    document.body.appendChild(toast);
    return toast.present();
  }

  checkIfThereAreEnglishBadWords(string: string): boolean {
    var Filter = require("bad-words"),
      filter = new Filter();

    return filter.isProfane(string);
  }

  checkIfThereAreItalianBadWords(string: string): boolean {
    let list = require("italian-badwords-list");

    let array = list.array;

    console.log(array);

    let stringArray = [];
    let stringPassed = string.split(" ");
    stringArray = stringArray.concat(stringPassed);

    console.log(stringArray);

    var check;

    stringArray.forEach((element) => {
      if (array.includes(element)) check = true;
    });

    console.log(check);

    return check;
  }

  async toastParolaScoretta() {
    const toast = await this.toastController.create({
      message: "Hai inserito una parola scorretta!",
      duration: 2000,
    });
    toast.color = "danger";
    toast.position = "top";
    toast.style.fontSize = "20px";
    toast.style.textAlign = "center";
    toast.present();
  }

  async popupModificaUsername() {
    const alert = await this.alertController.create({
      header: "Modifica username",
      inputs: [
        {
          name: "usernamePopUp",
          type: "text",
          value: this.usernameView, //risposta del servizio visualizzaProfilo
        },
      ],
      buttons: [
        {
          text: "Annulla",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            this.usernameView = this.profilo["0"].username; //annullo modifiche
            console.log("Confirm cancel");
          },
        },
        {
          text: "Ok",
          handler: (insertedData) => {
            console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
            this.usernameView = insertedData.usernamePopUp;
            this.usernameToPass = insertedData.usernamePopUp;

            if (insertedData.usernamePopUp == "") {
              //CHECK CAMPO VUOTO
              this.usernameView = this.profilo["0"].username;
              this.usernameToPass = this.profilo["0"].username;
            }
          },
        },
      ],
    });

    await alert.present();
    //View Dati inseriti dopo click sul popup di modifica username. Dal console log ho visto come accedere ai dati ricevuti.
    //this.titoloView = await (await alert.onDidDismiss()).data.values.titolo;
  }

  async popupModificaNome() {
    const alert = await this.alertController.create({
      header: "Modifica nome",
      inputs: [
        {
          name: "nomePopUp",
          type: "text",
          value: this.nomeView, //risposta del servizio visualizzaProfilo
        },
      ],
      buttons: [
        {
          text: "Annulla",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            this.nomeView = this.profilo["0"].nome; //annullo modifiche
            console.log("Confirm cancel");
          },
        },
        {
          text: "Ok",
          handler: (insertedData) => {
            console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
            this.nomeView = insertedData.nomePopUp;
            this.nomeToPass = insertedData.nomePopUp;

            if (insertedData.nomePopUp == "") {
              //CHECK CAMPO VUOTO
              this.nomeView = this.profilo["0"].nome;
              this.nomeToPass = this.profilo["0"].nome;
            }
          },
        },
      ],
    });

    await alert.present();
    //View Dati inseriti dopo click sul popup di modifica username. Dal console log ho visto come accedere ai dati ricevuti.
    //this.titoloView = await (await alert.onDidDismiss()).data.values.titolo;
  }

  async popupModificaCognome() {
    const alert = await this.alertController.create({
      header: "Modifica cognome",
      inputs: [
        {
          name: "cognomePopUp",
          type: "text",
          value: this.cognomeView, //risposta del servizio visualizzaProfilo
        },
      ],
      buttons: [
        {
          text: "Annulla",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            this.cognomeView = this.profilo["0"].cognome; //annullo modifiche
            console.log("Confirm cancel");
          },
        },
        {
          text: "Ok",
          handler: (insertedData) => {
            console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
            this.cognomeView = insertedData.cognomePopUp;
            this.cognomeToPass = insertedData.cognomePopUp;

            if (insertedData.cognomePopUp == "") {
              //CHECK CAMPO VUOTO
              this.cognomeView = this.profilo["0"].cognome;
              this.cognomeToPass = this.profilo["0"].cognome;
            }
          },
        },
      ],
    });

    await alert.present();
    //View Dati inseriti dopo click sul popup di modifica username. Dal console log ho visto come accedere ai dati ricevuti.
    //this.titoloView = await (await alert.onDidDismiss()).data.values.titolo;
  }

  async popupModificaBio() {
    const alert = await this.alertController.create({
      header: "Modifica bio",
      inputs: [
        {
          name: "bioPopUp",
          type: "text",
          value: this.bioView, //risposta del servizio visualizzaProfilo
        },
      ],
      buttons: [
        {
          text: "Annulla",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            this.bioView = this.profilo["0"].bio; //annullo modifiche
            console.log("Confirm cancel");
          },
        },
        {
          text: "Ok",
          handler: (insertedData) => {
            console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
            this.bioView = insertedData.bioPopUp;
            this.bioToPass = insertedData.bioPopUp;

            if (insertedData.bioPopUp == "") {
              //CHECK CAMPO VUOTO
              this.bioView = this.profilo["0"].bio;
              this.bioToPass = this.profilo["0"].bio;
            }
          },
        },
      ],
    });

    await alert.present();
    //View Dati inseriti dopo click sul popup di modifica username. Dal console log ho visto come accedere ai dati ricevuti.
    //this.titoloView = await (await alert.onDidDismiss()).data.values.titolo;
  }

  toastSuccess() {
    const toast = document.createElement("ion-toast");
    toast.message = "Modifiche effettuate!";
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = "20px";
    toast.color = "success";
    toast.style.textAlign = "center";
    document.body.appendChild(toast);
    return toast.present();
  }

  openMenu() {
    this.menuCrtl.open();
  }
}
