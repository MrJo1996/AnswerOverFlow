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

  chat: any = [];
  thereAreChats = false;
  loading = true;
  testoRicercato = '';
  user = "";

  urlCaricaChat =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaChats";
  urlCaricaMessaggio =
    "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php//visualizzaUltimoMessaggio";


  constructor(private navCtrl: NavController,
    private service: ApiService,
    private data: DataService,
    private router: Router) { }

  ngOnInit() {
    let cache: string;
    let chatTemp: any = [];
    let messaggioTemp: any = [];

    // Controllo se è stato instanziato il nome utente, 
    // serve solo per il testing fin quando non si uniscono tutte le page
    if (this.data.emailUtente != undefined) {
      this.user = this.data.emailUtente;
    } else {
      this.user = "pippo.cocainasd.com"
    }

    // Richiamo le api per prendermi le chat dell'utente loggato
    this.service.prendiChats(this.user, this.urlCaricaChat).then(
      (chats: any) => {
        if (chats.length > 0){
          this.thereAreChats = true;
          chatTemp = chats;
          // Metto l'utente che sta usando l'app al secondo posto
          for (let i = 0; i < chatTemp.length; i++) {
            if (chatTemp[i]['cod_utente0'] == this.user) {
              cache = chatTemp[i]['cod_utente0'];
              chatTemp[i]['cod_utente0'] = chatTemp[i]['cod_utente1'];
              chatTemp[i]['cod_utente1'] = cache;
            }
            // Per ogni chat seleziono l'ultimo messaggio e lo inserisco nell'oggetto chat
            this.service.prendiUltimoMessaggio(chatTemp[i].codice_chat, this.urlCaricaMessaggio).then(
              (msg) => {
                messaggioTemp[i] = msg;
                this.chat[i] = Object.assign(chatTemp[i], messaggioTemp[i]);
                //Quando ho finito di riempire tutte le chat dei relativi messaggi le ordino in base alla data
                if (this.chat.length == chatTemp.length) {
                  this.chat.sort(function (a, b) {
                    var dateA: any = new Date(a.data.dataeora), dateB: any = new Date(b.data.dataeora);
                    return dateA - dateB;
                  });
                  this.loading = false;
                }
              }
            )
          }
          console.log("Le chat ordinate sono ", this.chat);
        }
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );

  }

  ricerca(event) {
    // console.log(event);
    this.testoRicercato = event.detail.value;
  }

  mostraMessaggi(codiceChat: number, chatter: string) {
    // console.log(chatter)
    this.data.setCodice_chat(codiceChat);
    this.data.setEmailOthers(chatter);
    this.router.navigate(['chat']);
  }

  //Torna indietro alla Home
  goBack() {
    this.navCtrl.back;
  }
}
