import { Component, OnInit, ViewChild } from "@angular/core";
import { IonContent, NavController } from "@ionic/angular";
import { Promise } from "q";
import { PostServiceService } from "../services/post-service.service";
import { ApiService } from 'src/app/providers/api.service';
import { DataService } from "../services/data.service";
import { Router } from "@angular/router";
import { Storage } from '@ionic/storage';


@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"],
})
export class ChatPage implements OnInit {
  request: Promise<any>;
  result: Promise<any>;

  @ViewChild("content", { read: IonContent, static: false })
  myContent: IonContent;

  showMessagesUrl =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaMessaggi";
  sendMessageUrl =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/inseriscimessaggio";
  createChatUrl =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/creachat";
  findChatUrl =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/trovachat";
  viewUserUrl =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaProfilo";


  constructor(
    private service: PostServiceService,
    private dataService: DataService,
    private router: Router,
    private navCtrl: NavController,
    public storage: Storage,
    private apiservice: ApiService
  ) {
    this.storage.get('utente').then(data => {
      this.msg_utente_id = data.email;
    })

    this.chatFriend_id = this.dataService.getEmailOthers();
    this.cod_chat = this.dataService.getCodice_chat();

  }


  avatarFriend: any;
  chatFriend: string;
  chatFriend_id: string;
  msg_utente_id: string;
  cod_chat = null;
  textMessage;
  testo: string = "";
  messages = new Array();
  oggi: any;
  ieri: any;
  flag: boolean = true;


  ngOnInit() {
    this.dataService.loadingView(2000); //visualizza il frame di caricamento

    this.oggi = this.setDate(this.getToday());
    this.ieri = this.setDate(this.getYesterday());

    this.showMessages();

    setTimeout(() => {
      this.scrollToBottoms(0);
    }, 1200);
    this.refreshMessages();
  }



  ionViewWillEnter() {
    this.messages = [];
    this.msg_utente_id = this.dataService.getEmail_Utente()
    this.chatFriend_id = this.dataService.getEmailOthers();
    this.cod_chat = this.dataService.getCodice_chat();

    this.flag = true;

    this.selectChatFriend();

    this.findChat();
    this.refreshMessages();
  }

  ionViewWillLeave() {
    this.flag = false;
  }


  selectChatFriend() {
    let postData = {
      email: this.chatFriend_id,
    };

    this.result = this.service.postService(postData, this.viewUserUrl).then(
      (data) => {
        this.request = data;
        this.chatFriend = data.Profilo.data[0].username;
        this.avatarFriend = data.Profilo.data[0].avatar;
      },
      (err) => {
      }
    );
  }


  showMessages() {
    let postData = {
      cod_chat: this.cod_chat
    };
    this.result = this.service.postService(postData, this.showMessagesUrl).then(
      (data) => {
        this.request = data;
        this.messages = data.Messaggi.data;

        for (let i = 0; i < this.messages.length; i++) {
          let data = this.messages[i].dataeora;
          let dataMessaggio = data.substring(0, 10);
          dataMessaggio = this.setDate(dataMessaggio);
          this.messages[i]["data"] = dataMessaggio;

        }
      },
      (err) => {
      }
    );
  }

  createChat() {
    let postData = {
      cod_utente0: this.msg_utente_id,
      cod_utente1: this.chatFriend_id,
    };

    this.result = this.service.postService(postData, this.createChatUrl).then(
      (data) => {
        this.request = data;
        this.cod_chat = data.Chat.cod_chat;
        this.sendMessage();
      },
      (err) => {
      }
    );
  }

  findChat() {
    let postData = {
      cod_utente0: this.msg_utente_id,
      cod_utente1: this.chatFriend_id,
    };

    this.result = this.service.postService(postData, this.findChatUrl).then(
      (data) => {
        this.request = data;

        this.cod_chat = data.Chat.data;
        this.showMessages();
        this.scrollToBottoms(0);
      },
      (err) => {
      }
    );
  }


  sendMessage() {

    if (this.cod_chat === null) {
      this.createChat();
    } else {
      let postData = {
        testo: this.textMessage,
        visualizzato: 0,
        cod_chat: this.cod_chat,
        msg_utente_id: this.msg_utente_id,
      };

      let messageData = postData;
      messageData["data"] = this.oggi;
      messageData["dataeora"] = new Date();


      this.messages.push(messageData);
      this.scrollToBottoms(300);

      this.result = this.service
        .postService(postData, this.sendMessageUrl)
        .then(
          (data) => {
            this.request = data;

            this.showMessages();
            this.scrollToBottoms(300);
            this.apiservice.inviaNotifica(this.chatFriend_id, this.dataService.getUsername(), "Ti ha inviato un messaggio", "message", this.cod_chat)
          },
          (err) => {
          }
        );

      this.testo = "";
    }
  }


  clicca() {
    this.textMessage = this.testo;
    this.sendMessage();
    this.testo = "";
  }

  goToProfile() {
    this.dataService.emailOthers = this.chatFriend_id;
    this.router.navigate(['visualizza-profilo']);

  }


  goBack() {
    this.navCtrl.back();
  }

  scrollToBottoms(anim) {
    setTimeout(() => {
      this.myContent.scrollToBottom(anim);
    });
  }

  refreshMessages() {

    if (this.flag) {
      setTimeout(() => {
        this.showMessages();
        this.refreshMessages();
      }, 6000);
    }

  }

  getToday() {
    let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    let today = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
    return today.split("T")[0];
  }

  getYesterday() {
    let giorno;

    let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    giorno = new Date(Date.now() - tzoffset);
    giorno.setDate(giorno.getDate() - 1);
    return giorno.toISOString().split("T")[0];
  }

  setDate(date) {

    let gg = new Date(date);
    let weekday: string[] = [
      "Domenica",
      "Lunedì",
      "Martedì",
      "Mercoledì",
      "Giovedì",
      "Venerdì",
      "Sabato"

    ];

    const dateTimeFormat = new Intl.DateTimeFormat("it", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const [
      { value: day },
      ,
      { value: month },
      ,
      { value: year },
    ] = dateTimeFormat.formatToParts(gg);
    return weekday[gg.getDay()] + ", " + day + " " + month + " " + year;
  }

}


