import { Component, OnInit, ViewChild } from "@angular/core";
import { IonContent } from "@ionic/angular";
import { Promise } from "q";
import { PostServiceService } from "../services/post-service.service";
import { DataService } from "../services/data.service";
import { NavController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"],
})
export class ChatPage implements OnInit {
  request: Promise<any>;
  result: Promise<any>;
  showMessagesUrl =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaMessaggi";
  sendMessageUrl =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/inseriscimessaggio";
  createChatUrl =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/creachat";
  findChatUrl =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/trovachat";

  @ViewChild("content", { read: IonContent, static: false })
  myContent: IonContent;

  constructor(
    private service: PostServiceService,
    private dataService: DataService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    //this.cod_chat = this.dataService.codice_chat;
    this.oggi = this.getToday();
    this.ieri = this.getYesterday();
    
    this.flag = true;
    this.findChat();
    this.showMessages();
    setTimeout(() => {
      this.scrollToBottoms(0);
    }, 1500);

    this.refreshMessages();

    //this.cod_chat = this.dataService.codice_chat;
    // this.findChat();
  }

  textMessage;
  chat;
  currentUser = "giovanni";
  chatFriend = "paolo";
  chatFriend_id = "pippo.cocainasd.com";
  msg_utente_id = "email"; //gmailverificata giorgiovanni
  cod_utente1 = "";
  cod_chat = null;
  testo = "";
  visualizzato = 0;
  messages = new Array();
  data: string;
  oggi;
  ieri;
  flag;

  ///////////////////////////////////////

  goBack() {
    this.navCtrl.back();
    this.flag = false;
  }

  /////////////////////////////////////
  showMessages() {

    

    let postData = {
      cod_chat: this.cod_chat,
    };

    this.result = this.service.postService(postData, this.showMessagesUrl).then(
      (data) => {
        //this.giorno = new Date();
        this.request = data;
        console.log(data);
        this.messages = data.Messaggi.data;
      
        for (let i = 0; i < this.messages.length; i++) {
          let data = this.messages[i].dataeora;
          let dataMessaggio = data.substring(0, 10);
         // console.log(this.getYesterday(), this.getToday());

          this.messages[i]["data"] = dataMessaggio;
        }
      },
      (err) => {
        console.log(err.message);
      }
    );
  }
  ////////////////////////////////////
  createChat() {
    let postData = {
      cod_utente0: this.msg_utente_id,
      cod_utente1: this.chatFriend_id,
    };

    this.result = this.service.postService(postData, this.createChatUrl).then(
      (data) => {
        this.request = data;
        console.log(data);
        console.log("Chat creata");
        this.cod_chat = data.Chat.cod_chat;
        console.log(this.cod_chat);
        this.sendMessage();
        
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  /////////////////////////////////////////////
  findChat() {
    let postData = {
      cod_utente0: this.msg_utente_id,
      cod_utente1: this.chatFriend_id,
    };

    this.result = this.service.postService(postData, this.findChatUrl).then(
      (data) => {
        this.request = data;
        console.log(data);

        console.log(data.Chat.data);
        this.cod_chat = data.Chat.data;
        this.showMessages();
        this.scrollToBottoms(0);
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  //////////////////////////////////////

  /////////////////////////////////////////
  sendMessage() {


    if (this.cod_chat === null) {
      this.createChat();
      console.log(this.cod_chat);
    } else {
      let postData = {
        testo: this.textMessage,
        visualizzato: this.visualizzato,
        cod_chat: this.cod_chat,
        msg_utente_id: this.msg_utente_id,
      };

      let messageData = postData;
      messageData["data"] = this.getToday();
      messageData["dataeora"] = new Date();
      
      console.log(messageData);

      this.messages.push(messageData);
      this.scrollToBottoms(300);

      this.result = this.service
        .postService(postData, this.sendMessageUrl)
        .then(
          (data) => {
            this.request = data;
            console.log(data);

            this.showMessages();
            this.scrollToBottoms(300);
          },
          (err) => {
            console.log(err.message);
          }
        );

      this.testo = "";
    }
  }

  ///////////////////////////////////////////

  clicca() {
    
    this.textMessage = this.testo;
    this.sendMessage();
    this.testo = "";
  }
  ////////////////////////////////////////////

  goToProfile() {
    this.dataService.emailOthers = this.chatFriend_id;
    this.router.navigateByUrl("/visualizza-profilo");
    this.flag = false;
  }

  ///////////////////////////////////////////

  scrollToBottoms(anim) {
    setTimeout(() => {
      this.myContent.scrollToBottom(anim);
    });
  }

  refreshMessages() {
    
    if (this.flag === true) {
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
}

/* 

findLastMsgChat() {
  let postData = {
    cod_chat: this.cod_chat,
    msg_utente_id: this.msg_utente_id,
  };

  this.result = this.service
    .postService(postData, this.findLastMsgChatUrl)
    .then(
      (data) => {
        this.request = data;
        console.log(data);
        this.lastMessage = data.Messaggio.data;

        //console.log(this.messages);
      },
      (err) => {
        console.log(err.message);
      }
    );
} */
