import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Promise } from "q";
import { PostServiceService } from "../Services/post-service.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  
  request: Promise<any>;
  result: Promise<any>;
  showMessagesUrl = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaMessaggi';
  sendMessageUrl = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/inseriscimessaggio';


  constructor(private service: PostServiceService) {

  }


  messages;

  //user loggato
  currentUser = "urosp";
  msg_utente_id = "pippo.cocainasd.com";
  //
  cod_utente1 = '';
  cod_chat = 3;
  
  newMsg = '';

  updateMessages() {

    let postData = {
      "cod_chat": this.cod_chat
    };

      this.result = this.service.postService(postData, this.showMessagesUrl).then((data) => {
      this.request = data;
      console.log(data);
      this.messages = data.Messaggi.data;

    }, err => {
      console.log(err.message);
    });
  }



  @ViewChild('content', { read: IonContent, static: false }) myContent: IonContent;


  testo = '';
  visualizzato = 0
  

  sendMessage() {

     let postData = {
      "testo": this.testo,
      "visualizzato": this.visualizzato,
      "cod_chat": this.cod_chat,
      "msg_utente_id": this.msg_utente_id
    };

    this.result = this.service.postService(postData, this.sendMessageUrl).then((data) => {
      this.request = data;
      console.log(data);
    }, err => {
      console.log(err.message);
    }); 
    this.testo = '';
    this.messages.push({"testo": this.testo,
    "visualizzato": this.visualizzato,
    "cod_chat": this.cod_chat,
    "msg_utente_id": this.msg_utente_id});
    this.scrollToBottom(300);
   // this.updateMessages();
  }


  scrollToBottom(anim) {
    setTimeout(() => {
      this.myContent.scrollToBottom(anim)
    });
  }


  ngOnInit() {
    this.scrollToBottom(0)
    this.updateMessages();
  }


}
