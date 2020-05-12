import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Promise } from "q";
import { PostServiceService } from "../services/post-service.service";
import { isNull } from 'util';


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
    this.scrollToBottoms(0)
    //this.showMessages()


  }

  ngOnInit() {
    
    this.showMessages();
    this.refreshMessages();
    this.scrollToBottoms(0);
    
  }


  
  currentUser = "giovanni";
  chatFriend = "paolo";
  chatFriend_id = "pippo.cocainasd.com";
  msg_utente_id = "gmailverificata";
  cod_utente1 = '';
  data_no_chat;
  cod_chat = 3;
  
  messages;


  showMessages() {

    let postData = {
      "cod_chat": this.cod_chat
    };

      this.result = this.service.postService(postData, this.showMessagesUrl).then((data) => {
      this.request = data;
      console.log(data);
      this.data_no_chat = data;
      
      this.messages = data.Messaggi.data;
      //console.log(this.messages);
    
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
    this.scrollToBottoms(0); 
   
    this.testo = '';
   
  }



  clicca(){

  if(this.data_no_chat)
  console.log("okokok");

 this.sendMessage();


 
 this.testo = '';

 setTimeout(() => {
 this.showMessages();
 this.showMessages();
  this.scrollToBottoms(300);
},3000);

    
  }


  scrollToBottoms(anim) {
    setTimeout(() => {
      this.myContent.scrollToBottom(anim)
      this.myContent
    });
  }


  refreshMessages(){
    setTimeout(() => {
      this.showMessages();
      this.refreshMessages();
      //this.scrollToBottoms(0);
    },6000);

  }

  


}
