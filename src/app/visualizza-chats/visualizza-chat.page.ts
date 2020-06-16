import { Component, OnInit } from "@angular/core";
import { ApiService } from "./../providers/api.service";
import { Observable } from "rxjs";
import { DataService } from "../services/data.service";
import { Router } from "@angular/router";
import { NavController, MenuController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { PostServiceService } from "../services/post-service.service";
import * as $ from "jquery";

@Component({
  selector: "app-visualizza-chat",
  templateUrl: "./visualizza-chat.page.html",
  styleUrls: ["./visualizza-chat.page.scss"],
})
export class VisualizzaChatPage implements OnInit {
  thereAreChats = false;

  chat: any = [];
  testoRicercato = "";
  user;

  urlCaricaChat =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaChats";
  urlCaricaMessaggio =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaUltimoMessaggio";
  viewUserUrl =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaProfilo";

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private service: ApiService,
    private servicePost: PostServiceService,
    public data: DataService,
    private storage: Storage,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {}

  //Quando si è cliccato sul pulsante delle chat
  ionViewWillEnter() {
    this.user = this.data.getEmail_Utente();
    this.caricaChat();
  }

  //Quando è stata caricata la page, si possono usare le funzioni JQuery, perchè gli "#id" vengono trovati
  ionViewDidEnter() {
    setTimeout(removeLoader, 3000); //wait for page load PLUS two seconds.
    function removeLoader() {
      $("#loader").fadeOut(500, function () {
        // fadeOut complete. Remove the loading div
        $("#loader").css("display", "none"); //makes page more lightweight
        $("#ionCard").css("display", "block");
      });
    }
  }

  //Quando si sta lasciando la pagina si elimina la roba superflua e si resettano le view
  ionViewWillLeave() {
    this.user = null;
    this.chat.length = 0;
    resetLoader();
    function resetLoader() {
      $("#loader").css("display", "block"); //makes page more lightweight
      $("#ionCard").css("display", "none");
    }
  }

  //ricarica l'array delle chat e le ordina
  doRefresh(event) {
    $("#ionCard").css("display", "none");
    this.caricaChat();
    setTimeout(() => {
      $("#ionCard").css("display", "block");
      event.target.complete();
    }, 3000);
  }

  //--------------------Caricamento delle chat
  caricaChat() {
    let postData = {
      codice_utente: this.user,
    };

    this.servicePost.postService(postData, this.urlCaricaChat).then(
      (data) => {
        if (data.Chats !== undefined) {
          //Controllo se ci sono chat
          this.thereAreChats = true;
          this.chat = data.Chats.data;
          //prendo per ogni chat l'ultimo MESSAGGIO e l'USERNAME
          for (let i = 0; i < this.chat.length; i++) {
            this.selectChatUsername(i);
            this.selectChatMessage(i);
          }
          setTimeout(() => {
            console.log("Chat ordinate", this.chat);
            this.chat.sort(
              (a, b) =>
                new Date(b.message.dataeora).getTime() -
                new Date(a.message.dataeora).getTime()
            );
          }, 3000);
        }
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  //--------------------Prendo l'username della chat
  selectChatUsername(i) {
    let cache;

    if (this.chat[i]["cod_utente0"] == this.user) {
      //Controllo qual'è l'user della chat
      cache = this.chat[i]["cod_utente0"];
      this.chat[i]["cod_utente0"] = this.chat[i]["cod_utente1"];
      this.chat[i]["cod_utente1"] = cache;
    }

    let postData = {
      email: this.chat[i]["cod_utente0"],
    };

    this.servicePost.postService(postData, this.viewUserUrl).then(
      (data) => {
        this.chat[i]["username"] = data.Profilo.data[0].username;
        this.chat[i]["bio"] = data.Profilo.data[0].bio;
        this.chat[i]["avatar"] = data.Profilo.data[0].avatar;
      },
      (err) => {}
    );
  }

  //--------------------Prendo l'ultimo messaggio delle chat e le ordino in base alla sua dataeora
  selectChatMessage(i) {
    let postData = {
      cod_chat: this.chat[i]["codice_chat"],
    };

    this.servicePost.postService(postData, this.urlCaricaMessaggio).then(
      (data) => {
        this.chat[i]["message"] = data.data;
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  //-----------------------Provvede a selezionare solo gli utenti ricercati
  ricerca(event) {
    // console.log(event);
    this.testoRicercato = event.detail.value;
  }

  //-----------------------Setta il codice chat aperto nella sessione e naviga nel visualizza messaggi
  mostraMessaggi(codiceChat: number, chatter: string) {
    // console.log(chatter)
    this.data.setNotificationChatId("");
    this.data.setCodice_chat(codiceChat);
    this.data.setEmailOthers(chatter);
    this.data.loadingView(3000); //visualizza il frame di caricamento
    this.router.navigate(["chat"]);
  }

  //-----------------------Torna indietro
  goBack() {
    this.data.loadingView(5000);
    this.navCtrl.back();
  }

  openMenu() {
    this.menuCtrl.open();
  }
}
