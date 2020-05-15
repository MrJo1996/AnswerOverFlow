import { Component, OnInit, ViewChild } from "@angular/core";
import { IonContent } from "@ionic/angular";
import { Promise } from "q";
import { PostServiceService } from "../services/post-service.service";
import { DataService } from "../services/data.service";
import { Router } from "@angular/router";
import { isNull } from "util";

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
  findLastMsgChatUrl =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/trovaUltimoMessaggioInviato";

  @ViewChild("content", { read: IonContent, static: false })
  myContent: IonContent;

  constructor(
    private service: PostServiceService,
    data: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    
    
    this.findChat();
    this.showMessages();
    this.refreshMessages();
    this.scrollToBottoms(0);
  }

  lastMessage;
  chat;
  currentUser = "giovanni";
  chatFriend = "paolo";
  chatFriend_id = "pippo.cocainasd.com";
  msg_utente_id = "email"; //gmailverificata
  cod_utente1 = "";
  cod_chat;
  testo = "";
  visualizzato = 0;
  messages = new Array();

  ///////////////////////////////////////

  goBack() {}

  /////////////////////////////////////
  showMessages() {
    let postData = {
      cod_chat: this.cod_chat,
    };

    this.result = this.service.postService(postData, this.showMessagesUrl).then(
      (data) => {
        this.request = data;
        console.log(data);
        this.messages = data.Messaggi.data;
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
        console.log("Chat creata sssssssssssssssss");
        this.findChat();
        if (this.chat) {
          console.log(this.chat[0].codice_chat);
          this.cod_chat = this.chat[0].codice_chat;
        
        }
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
        this.chat = data.Chat.data;
        
         if (this.chat) {
          console.log(this.chat[0].codice_chat);
          this.cod_chat = this.chat[0].codice_chat;
        }

        
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  //////////////////////////////////////
  
  /////////////////////////////////////////
  sendMessage() {
    let postData = {
      testo: this.testo,
      visualizzato: this.visualizzato,
      cod_chat: this.cod_chat,
      msg_utente_id: this.msg_utente_id,
    };

    let messageData = postData;
    messageData["dataeora"] = new Date();
    
    
    if (this.chat === null) {
      this.createChat();
      console.log("popopoopo");
    }

    this.messages.push(messageData);
    this.scrollToBottoms(300);

    this.result = this.service.postService(postData, this.sendMessageUrl).then(
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

  ///////////////////////////////////////////

  clicca() {
    
   // this.findChat()
    this.sendMessage();
    this.testo = "";
  }
  ////////////////////////////////////////////

  goToProfile() {
    this.router.navigate(["/visualizza-profilo"]);
  }

  ///////////////////////////////////////////

  scrollToBottoms(anim) {
    setTimeout(() => {
      this.myContent.scrollToBottom(anim);
    });
  }

  refreshMessages() {
    setTimeout(() => {
      this.showMessages();
      this.refreshMessages();
    }, 6000);
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
