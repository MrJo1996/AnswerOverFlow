import { PostServiceService } from './../services/post-service.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from './../providers/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-visualizza-chat',
  templateUrl: './visualizza-chat.page.html',
  styleUrls: ['./visualizza-chat.page.scss'],
})
export class VisualizzaChatPage implements OnInit {

  chatUtenti: any;
  testoRicercato = '' ;
  url = "http://localhost/AnswerOverFlow-BackEnd/public/visualizzaChats";
  user = "gmailverificata";

  constructor(private service: ApiService) { }

  ngOnInit() {
    this.service.prendiChats(this.user, this.url).then(
      (chats) => {
        console.log('Visualizzato con successo', chats);
        this.chatUtenti = chats;
        for (let utenti of this.chatUtenti){
          if(utenti['cod_utente0']==this.user)
            utenti['cod_utente0'] = utenti['cod_utente1'];
    }
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  ricerca( event ) {
    // console.log(event);
    this.testoRicercato = event.detail.value;
  }

}
