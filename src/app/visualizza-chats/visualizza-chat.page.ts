import { PostServiceService } from './../services/post-service.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from './../providers/api.service';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

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

  constructor(private navCtrl:NavController,
              private service: ApiService, 
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
        this.chatUtenti = chats;
        for (let i = 0; i < this.chatUtenti.length; i++) {
          if(this.chatUtenti[i]['cod_utente0'] == this.user){
            cache = this.chatUtenti[i]['cod_utente0'];
            this.chatUtenti[i]['cod_utente0'] = this.chatUtenti[i]['cod_utente1'];
            this.chatUtenti[i]['cod_utente1'] = cache;
          }
        }
        console.log('Visualizzato con successo', this.chatUtenti);
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

  mostraMessaggi(codiceChat: number, chatter: string){
    // console.log(chatter)
    this.data.setCodice_chat(codiceChat);
    this.data.setEmailOthers(chatter);
    this.router.navigate(['chat']);
  }

  //Torna indietro alla Home
  goBack() {
    // this.navCtrl.pop();
    this.router.navigate(['home']);
  }
}
