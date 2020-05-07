import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';

import { ApiService } from 'src/app/providers/api.service';


@Component({
  selector: 'app-modifica-profilo',
  templateUrl: './modifica-profilo.page.html',
  styleUrls: ['./modifica-profilo.page.scss'],
})
export class ModificaProfiloPage implements OnInit {
  email: string;
  username: string;
  password: string;
  nome: string;
  cognome: string;
  bio: string;

  request: Promise<any>;
  result: Promise<any>; 

  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/modificaProfilo'; 

  constructor(public alertController: AlertController,public apiService: ApiService) { }
 
  ngOnInit() {
    this.email = 'gmailverificata';
    this.username = 'prova modifica';
    this.password = 'prova modifica'
    this.nome = 'prova modifica';
    this.cognome = 'prova modifica';
    this.bio = 'prova modifica';
  }

  async modify() {

    this.apiService.modificaProfilo(this.username, this.password, this.nome, this.cognome, this.bio, this.email).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
         // this.presentAlert();
         //this.goToHome(); 
        console.log('Modifica avvenuta con successo: ',this.username, this.password, this.nome, this.cognome, this.bio, this.email);
      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('Modifica non effetutata');
        /* this.goToHome();
        this.presentAlertNegativo(); */
      }
    );

  }

  async popupConfermaModificaProfilo() {
    const alert = await this.alertController.create({
      header: 'Conferma modifiche',
      message: 'Vuoi confermare le modifiche effettuate?',
      buttons: ['Conferma']
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
    console.log("PROVA");

    this.modify();
  }

  

}
