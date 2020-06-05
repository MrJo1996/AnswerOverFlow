import { Component, OnInit } from '@angular/core';
import { TransitiveCompileNgModuleMetadata, ThrowStmt } from '@angular/compiler';
import { NOMEM } from 'dns';
import { Router } from '@angular/router';
import { ApiService } from '../providers/api.service';
import { AlertController } from '@ionic/angular';
import { DataService } from "../services/data.service";
import { NavController } from "@ionic/angular";
import { resolve } from 'url';
import { Storage } from "@ionic/storage";
import { ToastController } from '@ionic/angular';
import { element } from 'protractor';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-visualizza-domanda',
  templateUrl: './visualizza-domanda.page.html',
  styleUrls: ['./visualizza-domanda.page.scss'],
})
export class VisualizzaDomandaPage implements OnInit {


  allVisible: boolean = false;

  codice_domanda;

  currentMailUser = "";//mail dell'utente corrente
  userNameUserDomanda: string;
  domandaMailUser: string;//mail di chi ha fatto la domanda

  domanda = {};
  profiloUserDomanda = {};//profilo dell'utente che ha fatto la domanda
  dataeoraView: any;
  timerView: any;
  titoloView: any;
  descrizioneView: any;
  cod_preferita: any;
  codice_categoria = 1;

  risposte = new Array();
  profiliUtentiRisposte = new Array();
  descrizioneRispostaView;
  descrizioneRispostaToPass;
  risposta = {};
  rispostaCliccata;
  indexMigliorRisposta: number;
  rispostaVisible = false;
  private buttonColor: string = "#2a2a2a";
  private buttonColorBest: string = "gold";
  descrizione_risposta = "";

  likes = new Array();
  coloriLikeDislike = new Array();

  categoria = {};

  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    public apiService: ApiService,
    private router: Router,
    public alertController:
      AlertController,
    private storage: Storage,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.handleLoading();
    this.visualizzaDomanda();
    this.showRisposte();
    this.storage.get('utente').then(data => { this.currentMailUser = data.email });
    this.allVisible = true;

  }

                                                                                                  //TOASTTTTTTTTTTTTTTTTTTTTTTTTTTTTT

  goModificaDomanda() {
    if (this.risposte.length > 0)
      this.showErrorToast();
    else
      this.router.navigate(['modifica-domanda']);
  }


  async visualizzaDomanda() {
    console.log(this.dataService.codice_domanda);
    this.codice_domanda = this.dataService.codice_domanda;
    this.apiService.getDomanda(this.codice_domanda).then(
      (domanda) => {


        this.domanda = domanda['data'];


        this.dataeoraView = this.domanda['0'].dataeora;
        this.timerView = this.domanda['0'].timer;
        this.titoloView = this.domanda['0'].titolo;
        this.descrizioneView = this.domanda['0'].descrizione;
        this.domandaMailUser = this.domanda['0'].cod_utente;
        this.cod_preferita = this.domanda['0'].cod_preferita;
        console.log('Domanda: ', this.domanda['0']);
        this.getUserDomanda();
        this.visualizzaCategoria();


      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );

  }

  async popUpEliminaDomanda() {                                                        
    const alert = await this.alertController.create({
      header: 'Sei sicuro di voler eliminare questa domanda?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            console.log('domanda eliminata');
            this.showDeleteToast();
            this.cancellaDomanda();
            this.router.navigate(['home']);                                         
          }
        },
        {
          text: 'No',
          role: 'cancel',
          //cssClass: 'secondary',
          handler: () => {
            console.log('eliminazione annullata');
          }
        }
      ]
    });
    await alert.present();
  }

  async showRisposte() {
    this.codice_domanda = this.dataService.codice_domanda;
    this.apiService.getRispostePerDomanda(this.codice_domanda).then(
      (risposte) => {
        console.log('Visualizzato con successo');

        this.risposte = risposte['Risposte']['data'];
        this.risposte.forEach(element => {
          this.trovaProfiliUtentiRisposte(element.cod_utente);
        });
        let i = 0;
        this.risposte.forEach(element => {
          console.log('CHECK CONSOLE LOG', element);
          if (element.codice_risposta === this.cod_preferita) {
            let aux = this.risposte[0];
            this.risposte[0] = this.risposte[i];
            this.risposte[i] = aux;
            for (let j = 1; j < i; j++) {
              let aux = this.risposte[j];
              this.risposte[j] = this.risposte[i];
              this.risposte[i] = aux;
            }
          }

          i++;

        });

        let j = 0;
        this.likes.forEach(element =>
          {
              this.likes[j] = null;

              j++;
          });

        this.risposte.forEach(element => {
          console.log("CONSOLE LOG PER VEDERE cod risposta: ", element.codice_risposta);
            this.cercaValutazione(this.currentMailUser, element.codice_risposta);

        });


        console.log("CONSOLE LOG PER VEDERE DOVE STANNO I LIKES: ", this.likes);
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  async trovaProfiliUtentiRisposte(mailUtenteRisposta) {
    this.apiService.getProfilo(mailUtenteRisposta).then(
      (profilo) => {
        this.profiliUtentiRisposte.push(profilo['data']);
        console.log('profilo trovato con successo', this.profiliUtentiRisposte);

      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione del profilo");
      }
    );

  }



  async visualizzaCategoria() {

    this.apiService.getCategoria(this.codice_categoria).then(
      (categoria) => {
        this.categoria = categoria['Categoria']['data']['0'].titolo;
        console.log("questa è datacategoria", categoria['Categoria']['data']['0'].titolo);
        console.log(this.categoria);
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  async cancellaDomanda() {
    this.apiService.rimuoviDomanda(this.codice_domanda).then(
      (risultato) => {
        //console.log('eliminata');

      },
      (rej) => {
        //console.log("C'è stato un errore durante l'eliminazione");
      }
    );
  }

  async getUserDomanda() {
    this.apiService.getProfilo(this.domandaMailUser).then(
      (profilo) => {
        this.profiloUserDomanda = profilo['data']['0'];
        //console.log('profilo trovato con successo', this.profiloUserDomanda);

      },
      (rej) => {
        //console.log("C'è stato un errore durante la visualizzazione del profilo");
      }
    );

  }

  goback() {
    this.navCtrl.pop();
  }

  async modify() {

    if (!this.checkIfThereAreEnglishBadWords(this.descrizioneRispostaView) && !this.checkIfThereAreItalianBadWords(this.descrizioneRispostaView)) {
      this.apiService.modificaRisposta(this.dataService.codice_risposta, this.descrizioneRispostaToPass).then(
        (result) => { // nel caso in cui va a buon fine la chiamata
        },
        (rej) => {// nel caso non vada a buon fine la chiamata
          console.log('Modifica non effetutata'); //anche se va nel rej va bene, modifiche effettive nel db
        }
      );
    } else {
      this.popupParolaScorretta();
    }

  }

  async scegliPreferita() {
    this.apiService.scegliRispostaPreferita(this.codice_domanda, this.cod_preferita).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('Modifica non effetutata'); //anche se va nel rej va bene, modifiche effettive nel db
      }
    );
  }


  clickInviaRisposta() {

    this.inserisciRisposta();
    this.rispostaVisible = false;
    this.doRefresh(event);

  }



  async inserisciRisposta() {
    this.apiService.inserisciRisposta(this.descrizione_risposta, this.currentMailUser, this.codice_domanda).then(
      (result) => { // nel caso in cui va a buon fine la chiamata
      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('Modifica non effetutata'); //anche se va nel rej va bene, modifiche effettive nel db
      }
    );

  }



  async popupModificaDescrizioneRisposta() {

    const alert = await this.alertController.create({
      header: 'Modifica',
      inputs: [
        {
          name: 'descrizionePopUp',
          type: 'text',
          placeholder: this.rispostaCliccata.descrizione
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm cancel');
          }
        }, {
          text: 'Ok',
          handler: insertedData => {
            console.log(JSON.stringify(insertedData)); //per vedere l'oggetto dell'handler
            this.descrizioneRispostaView = insertedData.descrizionePopUp; //setto descrizioneView al valore inserito nel popUp una volta premuto ok così viene visualizzato
            this.descrizioneRispostaToPass = insertedData.descrizionePopUp; //setto descrizioneToPass al valore inserito nel popUp una volta premuto ok
            
            this.showModifyToast();
            this.modify();
           
                                                                                   //TOASTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
          }
        }
      ]
    });

    await alert.present();
    //View Dati inseriti dopo click sul popup di modifica descrizione. Dal console log ho visto come accedere ai dati ricevuti.
    //this.descrizioneView = await (await alert.onDidDismiss()).data.values.descrizione;
  }

  clickRisposta(risposta, i) {
    if (this.risposte[i]['cod_utente'] === this.currentMailUser) {

      this.dataService.codice_risposta = risposta.codice_risposta;


      this.rispostaCliccata = risposta;

      this.popupModificaDescrizioneRisposta();

    }
  }

  checkIfThereAreEnglishBadWords(string: string): boolean {

    var Filter = require('bad-words'),
      filter = new Filter();

    return filter.isProfane(string)

  }

  checkIfThereAreItalianBadWords(string: string): boolean {

    let list = require('italian-badwords-list');

    let array = list.array

    return array.includes(string);
  }


  async popupParolaScorretta() {
    const alert = await this.alertController.create({
      header: 'ATTENZIONE',
      subHeader: 'Subtitle',
      message: 'Hai inserito una parola scorretta',
      buttons: ['OK']
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  changeColor(cod_nuova_preferita) {
    if (this.cod_preferita === cod_nuova_preferita) {
      this.cod_preferita = " ";
      this.scegliPreferita();

    }
    else {
      this.cod_preferita = cod_nuova_preferita;
      this.scegliPreferita();
    }

  }

  setRispostaVisible() {
    if (this.rispostaVisible === false)
      this.rispostaVisible = true;
    else
      this.rispostaVisible = false;

  }

  doRefresh(event) {
    this.visualizzaDomanda();
    this.showRisposte();

    setTimeout(() => {

      event.target.complete();
    }, 2000);
  }


  async  handleLoading() {
    const loading = await this.loadingController.create({
      message: 'Stiamo risolvendo i tuoi dubbi...',
      duration: 750
    });

    {

      await loading.present();


    }


  }

  /*   async showDescrizioneRisposta() {
      this.apiService.getRisposta(this.dataService.getCodiceRisposta()).then(
        resolve => {
          this.descrizioneRispostaView = resolve['data']['0'].descrizione;
          console.log(this.descrizioneRispostaView);
        },
        (rej) => {
          console.log("C'è stato un errore durante il recupero dei dati");
        }
      )
    } */



  //TOAST----------------------------------------

  async showDeleteToast() {
    const toast = document.createElement('ion-toast');
    toast.message = 'Domanda eliminata con successo!';
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.color = 'success';
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
    return toast.present();
  }

  async showErrorToast() {
    const toast = document.createElement('ion-toast');
    toast.message = 'Operazione non consentita!';
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.color = 'danger';
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
    return toast.present();
  }

  async showModifyToast() {
    const toast = document.createElement('ion-toast');
    toast.message = 'Modifica avvenuta con successo!';
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.color = 'success';
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
    return toast.present();
  }

  async modificaLike(codice_risposta, i){
    if(this.likes[i]===1 ||this.likes[i]===2 ){
      this.cancellaValutazione(codice_risposta);
    }
    else{ 
      
      this.inserisciValutazione(codice_risposta, 1);
      this.apiService.modificaNumLike(codice_risposta).then(
        (result) => {
          
        },
        (rej) => {
          console.log('like non effetutata', codice_risposta, this.currentMailUser); 
        }
      );}

  }

 async modificaDislike(codice_risposta, i){
  if(this.likes[i]===1 ||this.likes[i]===2){
    this.cancellaValutazione(codice_risposta);
  }
  else{
    
    this.inserisciValutazione(codice_risposta, 2);
    this.apiService.modificaNumDislike(codice_risposta).then(
      (result) => { 
        
      },
      (rej) => {
        console.log('dislike non effetutata', codice_risposta, this.currentMailUser); 
      }
    );}
  

  }

  async inserisciValutazione(cod_risposta, tipo_like){
    this.apiService.inserisciValutazione(cod_risposta, this.currentMailUser, tipo_like).then(
      (result) => { 
      },
      (rej) => {
        console.log('Modifica non effetutata'); 
      }
    );

  }


  async cercaValutazione(cod_utente, cod_risposta){
    this.apiService.controllaGiaValutatoRisposta(cod_utente, cod_risposta).then(
      (result) => { 
        if(result["0"]["data"] === null){
          this.likes.push(-1);
        }
         else if(result["0"]["data"]["0"]["tipo_like"] === 1)
             this.likes.push(1);

        else if(result["0"]["data"]["0"]["tipo_like"] === 2)
              this.likes.push(2);
      },
      (rej) => {
        console.log("Non c'è valutazione"); 
      }
    );

  }


  async cancellaValutazione(cod_risposta) {
    this.apiService.rimuoviValutazione(cod_risposta, this.currentMailUser).then(
      (risultato) => {
        console.log('eliminata');

      },
      (rej) => {
        console.log("C'è stato un errore durante l'eliminazione", rej);
      }
    );
  }


}