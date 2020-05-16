import { PostServiceService } from './../services/post-service.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from './../providers/api.service';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visualizza-chat',
  templateUrl: './visualizza-chat.page.html',
  styleUrls: ['./visualizza-chat.page.scss'],
})
export class VisualizzaChatPage implements OnInit {

  chatUtenti: any = [];
  testoRicercato = '' ;
  url = "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaChats";
  user = "";

  constructor(private service: ApiService, 
              private data: DataService,
              private router: Router) { }

  ngOnInit() {
    let cache: string;

    // Controllo se è stato instanziato il nome utente, 
    // serve solo per il testing fin quando non si uniscono tutte le page
    if (this.data.emailUtente != undefined){
      this.user = this.data.emailUtente;
    } else {
      this.user = "gmailverificata"
    }

    // Richiamo le api per prendermi le chat dell'utente loggato
    this.service.prendiChats(this.user, this.url).then(
      (chats) => {
        console.log('Visualizzato con successo', chats);
        this.chatUtenti = chats;
        for (let utenti of this.chatUtenti){
          if(utenti['cod_utente0']==this.user){
            cache = utenti['cod_utente0'];
            utenti['cod_utente0'] = utenti['cod_utente1'];
            utenti['cod_utente1'] = cache;
          }
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

  mostraMessaggi(codiceChat: number){
    // console.log(codiceChat)
    this.data.setCodice_chat(codiceChat);
    this.router.navigate(['chat']);
  }

  //Torna indietro alla Home
  goBack() {
    this.router.navigate(['home']);
  }
}
