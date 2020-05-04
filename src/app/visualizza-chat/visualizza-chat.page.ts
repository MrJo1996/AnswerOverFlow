import { Component, OnInit, ViewChild} from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Content } from '@angular/compiler/src/render3/r3_ast';


@Component({
  selector: 'app-visualizza-chat',
  templateUrl: './visualizza-chat.page.html',
  styleUrls: ['./visualizza-chat.page.scss'],
})
export class VisualizzaChatPage implements OnInit {

   
  constructor() {
    this.scrollToBottom(0)
   }

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
      user: 'simone',
      time: "16:40",
      msg: 'Hey ho trenta monete, che vuoi fa'

    }
  
  ];

  
  currentUser = "simone"
  newMsg = '';
  
  
  @ViewChild('content', {read:IonContent,static: false}) myContent: IonContent;
 

  sendMessage() {
    this.messages.push({
      user:"simone",
      time: new Date().toTimeString().substring(0,5),
      msg: this.newMsg   });
        
    this.newMsg ='';
    this.scrollToBottom(300);

  }

  scrollToBottom(anim){
    setTimeout(() => {
     this.myContent.scrollToBottom(anim)
    });
  }


  ngOnInit() { 
    
}

}
