import { Component, OnInit, ViewChild} from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Promise } from "q";
import { PostServiceService } from "../Services/post-service.service";

@Component({
  selector: 'app-visualizza-chat',
  templateUrl: './visualizza-chat.page.html',
  styleUrls: ['./visualizza-chat.page.scss'],
})
export class VisualizzaChatPage implements OnInit {



  cod_chat = 3;
  request: Promise<any>;
  result: Promise<any>;
  url1 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaMessaggi';
  url2 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/inseriscimessaggio';

   
  constructor(private service: PostServiceService) {
    
   }


   messages;
   postMessaggi(){
     
    let postData ={
      "cod_chat": this.cod_chat 
    };
    this.result = this.service.postService(postData, this.url1).then((data) => {
      this.request = data;
      console.log(data);
      this.messages = data.Messaggi.data;
      console.log(this.messages[0].testo);
      
      console.log(data.Messaggi.data[0].testo);
    }, err => {
      console.log(err.message);
    });
  }




  newMsg = '';
  
  
  @ViewChild('content', {read:IonContent,static: false}) myContent: IonContent;
 

 
  testo = '';
  cod_utente1 = '';
  cod_utente0 = '';
  dataeora = '';
  visualizzato = 0
  

 


  sendMessage() {

    let postData ={
      "testo": this.testo,
    };
    this.result = this.service.postService(postData, this.url2).then((data) => {
      this.request = data;
      console.log(data);
    }, err => {
      console.log(err.message);
    });
  }
 



/*
  messages = [
    {
      user: 'simone',
      time: "15:18",
      msg: 'Ciao sono Simone'

    },
    {
      user: 'giuda',
      time: "16:30",
      msg: 'hey,sono giuda'

    },
    {
      user: 'giuda',
      time: "16:30",
      msg: 'hey,sono giuda'

    },
    {
      user: 'giuda',
      time: "16:30",
      msg: 'hey,sono giuda'

    },
    {
      user: 'giuda',
      time: "16:30",
      msg: 'hey,sono giuda'

    },
    {
      user: 'simone',
      time: "16:40",
      msg: 'Hey ho trenta monete, che vuoi fa'

    }
  
  ];

  */


  scrollToBottom(anim){
    setTimeout(() => {
     this.myContent.scrollToBottom(anim)
    });
  }


  ngOnInit() { 
    this.scrollToBottom(0)
    this.postMessaggi();
}

}
