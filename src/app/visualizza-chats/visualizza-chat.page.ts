import { Component, OnInit } from "@angular/core";
import { ApiService } from "./../providers/api.service";
import { Observable } from "rxjs";
import { DataService } from "../services/data.service";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { PostServiceService } from "../services/post-service.service";
import * as $ from 'jquery';

@Component({
  selector: "app-visualizza-chat",
  templateUrl: "./visualizza-chat.page.html",
  styleUrls: ["./visualizza-chat.page.scss"],
})
export class VisualizzaChatPage implements OnInit {


  thereAreChats = false;
  loading = true;
  
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
    private data: DataService,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.storage.get("utente").then((data) => {
      this.user = data.email;
      this.caricaChat();
    });
  }
  ionViewWillEnter() {
    $(window).on('load', function(){
      setTimeout(removeLoader, 2000); //wait for page load PLUS two seconds.
    });
    function removeLoader(){
        $( "#loader" ).fadeOut(500, function() {
          // fadeOut complete. Remove the loading div
          $( "#loader" ).remove(); //makes page more lightweight 
          $('#ionCard').show();
      });  
    }
  }

  //--------------------Caricamento delle chat
  caricaChat() {
    let postData = {
      codice_utente: this.user,
    };

    this.servicePost.postService(postData, this.urlCaricaChat).then(
      (data) => {
        console.log(data.Chats.data);
        if (data.Chats !== undefined) {
          //Controllo se ci sono chat
          this.thereAreChats = true;
          this.chat = data.Chats.data;
          //prendo per ogni chat l'ultimo MESSAGGIO e l'USERNAME
          for (let i = 0; i < this.chat.length; i++) {
            this.selectChatUsername(i);
          }
        } //se false il caricamento finisce
        else this.loading = false;
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
        this.selectChatMessage(i);
      },
      (err) => {
        console.log(err.message);
      }
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
        console.log(i, this.chat.length - 1);
        if (i == this.chat.length - 1) {
          //Quando il loop è arrivato all'ultimo giro ordino
          this.chat.sort(function (a, b) {
            var dateA: any = new Date(a.message.dataeora),
              dateB: any = new Date(b.message.dataeora);
            return dateB - dateA;
          });
          console.log("Chat ordinate", this.chat);
          this.loading = false;
          console.log(this.loading);
        }
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
    this.data.setCodice_chat(codiceChat);
    this.data.setEmailOthers(chatter);
    this.router.navigate(["chat"]);
  }

  //-----------------------Torna indietro
  goBack() {
    this.navCtrl.back();
  }
}
