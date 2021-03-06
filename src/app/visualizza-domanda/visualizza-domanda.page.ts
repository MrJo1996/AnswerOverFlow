import { Component, OnInit } from '@angular/core';
import { ApiService } from '../providers/api.service';
import { AlertController, MenuController } from '@ionic/angular';
import { DataService } from "../services/data.service";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-visualizza-domanda',
  templateUrl: './visualizza-domanda.page.html',
  styleUrls: ['./visualizza-domanda.page.scss'],
})
export class VisualizzaDomandaPage implements OnInit {
  numLike2: Array<number> = []
  numDislike2: Array<number> = []
  cod_valutazione: Array<number> = []
  codice_domanda;

  currentMailUser = "";//mail dell'utente corrente
  domandaMailUser: string;//mail di chi ha fatto la domanda
  usernameUtente: string;

  domanda = {};
  profiloUserDomanda = {};//profilo dell'utente che ha fatto la domanda
  dataeoraView: any;
  timerView: any;
  titoloView: any;
  descrizioneView: any;
  cod_preferita: any;

  risposte = new Array();
  descrizioneRispostaView;
  descrizioneRispostaToPass;
  risposta = {};
  rispostaCliccata;
  rispostaVisible = false;
  private buttonColor: string = "#2a2a2a";
  private buttonColorBest: string = "gold";
  descrizione_risposta = "";

  categoria = {};
  codice_categoria: number;

  codice_valutazione;

  timerView2;

  ospite;
  giorni;
  ore;
  minuti;
  secondi;

  valutazioni = new Array();

  formatsDate: string[] = [
    'd-MM-y, H:mm'
  ];

  risposte2
  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    public apiService: ApiService,
    public alertController:
      AlertController,
    private storage: Storage,
    private menuCtrl: MenuController,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.storage.get('utente').then(data => { this.currentMailUser = data.email });

    if (this.currentMailUser.length === 0)
      this.currentMailUser = this.dataService.emailUtente;

    this.currentMailUser = this.dataService.emailUtente;
    this.controllaOspite();
    if (this.ospite === false)
      this.currentMailUser = null;

    this.visualizzaDomanda();
    console.log(this.visualizzaDomanda()
    )
    this.showRisposte();
    this.controllaOspite();

    this.usernameUtente = this.dataService.getUsername();

  }


  goModificaDomanda() {
    if (this.risposte.length > 0)
      this.toast('Non puoi più modificare la tua domanda, gli utenti hanno già cominciato a rispondere!', 'danger');
    else if (this.deadlineCheck()) {
      this.toast('Non puoi più modificare la tua domanda, è scaduta!', 'danger');
    }
    else {
      clearInterval(this.interval);
      this.dataService.loadingView(1000);
      this.navCtrl.navigateRoot(['/modifica-domanda']);

    }
  }


  async visualizzaDomanda() {

    this.codice_domanda = this.dataService.codice_domanda;
    this.apiService.getDomanda(this.codice_domanda).then(
      (domanda) => {

        this.domanda = domanda['data'];
        this.dataeoraView = this.domanda['0'].dataeora;
        this.timerView2 = this.domanda['0'].timer;
        this.titoloView = this.domanda['0'].titolo;
        this.descrizioneView = this.domanda['0'].descrizione;
        this.domandaMailUser = this.domanda['0'].cod_utente;
        this.cod_preferita = this.domanda['0'].cod_preferita;
        this.codice_categoria = this.domanda['0'].cod_categoria;

        this.getUserDomanda();
        this.visualizzaCategoria();
        this.mappingIncrement(this.domanda['0'].timer);

      },
      (rej) => {

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
            this.toast('Domanda eliminata con successo!', 'success');
            this.cancellaDomanda();
            this.dataService.loadingView(3000);
            this.navCtrl.navigateBack(['home']);
          }
        },
        {
          text: 'No',
          role: 'cancel',

          handler: () => {

          }
        }
      ]
    });
    await alert.present();
  }


  async popUpEliminaRisposta(codice_risposta) {
    const alert = await this.alertController.create({
      header: 'Sei sicuro di voler eliminare questa risposta?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.toast('Risposta eliminata con successo!', 'success');
            this.cancellaRisposta(codice_risposta);
            this.ngOnInit();
            this.dataService.loadingView(2000);
            this.doRefresh(event);

          }
        },
        {
          text: 'No',
          role: 'cancel',

          handler: () => {

          }
        }
      ]
    });
    await alert.present();
  }


  async showRisposte() {
    this.votoType = []
    this.codice_domanda = this.dataService.codice_domanda;
    this.apiService.getRispostePerDomanda(this.codice_domanda).then(
      (risposte) => {
        if (!risposte['error']) {
          this.risposte = [];
          this.risposte2 = [];

          if (risposte['Risposte']['data'] != undefined) {
            this.risposte = risposte['Risposte']['data'];
            this.risposte2 = risposte['Risposte']['data']
          }

          let temp: Array<Number> = []
          this.numLike2 = [];
          this.numDislike2 = [];
          this.votoType = [];
          for (let index = 0; index < this.risposte2.length; index++) {
            this.numLike2[this.risposte2[index].codice_risposta] = (this.risposte2[index].num_like)
            this.numDislike2[this.risposte2[index].codice_risposta] = (this.risposte2[index].num_dislike)

            this.apiService.controllaGiaValutatoRisposta(this.currentMailUser, this.risposte2[index].codice_risposta).then((data) => {
              if (data[0]['data'] == null) this.votoType.push(0)
              else {
                this.votoType[data[0]['data'][0]['cod_risposta']] = (data[0]['data'][0].tipo_like)
                this.cod_valutazione[data[0]['data'][0]['cod_risposta']] = data[0]['data'][0]['codice_valutazione']
              }


            })

          }

          for (let i = 0; i < this.risposte.length; i++) {

            if (this.risposte[i].codice_risposta === this.cod_preferita) {
              let aux = this.risposte[0];
              this.risposte[0] = null;
              this.risposte[0] = this.risposte[i];
              this.risposte[i] = null;
              this.risposte[i] = aux;

              for (let j = 1; j < i; j++) {
                let aux = this.risposte[j];
                this.risposte[j] = this.risposte[i];
                this.risposte[i] = aux;
              }
            }
          }

          for (let i = 0; i < this.risposte.length; i++) {
            this.cercaValutazione(this.currentMailUser, this.risposte, i);
          }

          for (let i = 0; i < this.risposte.length; i++) {
            this.trovaProfiliUtentiRisposte(this.risposte[i].cod_utente, i);

          }

        }
      },
      (rej) => {

      }
    );
  }

  async trovaProfiliUtentiRisposte(mailUtenteRisposta, i) {
    this.apiService.getProfilo(mailUtenteRisposta).then(
      (profilo) => {

        this.risposte[i]['avatar'] = profilo['data']['0']['avatar'];
        this.risposte[i]['username'] = profilo['data']['0']['username'];

      },
      (rej) => {
      }
    );

  }


  async visualizzaCategoria() {

    this.apiService.getCategoria(this.codice_categoria).then(
      (categoria) => {
        this.categoria = categoria['Categoria']['data']['0'].titolo;
      },
      (rej) => {
      }
    );
  }



  async cancellaDomanda() {
    this.apiService.rimuoviDomanda(this.codice_domanda).then(
      (risultato) => {
      },
      (rej) => {

      }
    );
  }



  async cancellaRisposta(codice_risposta) {
    this.apiService.rimuoviRisposta(codice_risposta).then(
      (risultato) => {
      },
      (rej) => {
      }
    );
  }


  async getUserDomanda() {
    this.apiService.getProfilo(this.domandaMailUser).then(
      (profilo) => {
        this.profiloUserDomanda = profilo['data']['0'];

      },
      (rej) => {

      }
    );

  }

  goback() {
    this.dataService.loadingView(5000);
    this.navCtrl.back();
  }

  async modify() {

    if (this.checkIfThereAreEnglishBadWords(this.descrizioneRispostaToPass) || this.checkIfThereAreItalianBadWords(this.descrizioneRispostaToPass)) {
      this.toast('Hai inserito una o più parole scorrette!', 'danger');

    } else if (this.stringLengthChecker(this.descrizioneRispostaToPass)) {
      this.toast('ATTENZIONE! Hai lasciato un campo vuoto oppure hai superato la lunghezza massima!', 'danger');

    } else if (this.deadlineCheck()) {
      this.toast('Non puoi più modificare la tua risposta, la domanda è scaduta!', 'danger');

    } else {
      this.apiService.modificaRisposta(this.dataService.codice_risposta, this.descrizioneRispostaToPass).then(
        (result) => {
        },
        (rej) => {
        }
      );

    }

  }

  async scegliPreferita() {
    this.apiService.scegliRispostaPreferita(this.codice_domanda, this.cod_preferita).then(
      (result) => {
      },
      (rej) => {

      }
    );
  }

  clickInviaRisposta() {
    if (this.deadlineCheck()) {
      this.toast('Non puoi più modificare la tua risposta, la domanda è scaduta!', 'danger');


    } else {
      this.inserisciRisposta();
      this.rispostaVisible = false;

      this.doRefresh(event);
    }

  }

  async inserisciRisposta() {
    if (this.ospite === true) this.alertOspite();
    else {

      if (this.checkIfThereAreItalianBadWords(this.descrizione_risposta) || this.checkIfThereAreEnglishBadWords(this.descrizione_risposta)) {
        this.toast('Hai inserito una o più parole scorrette!', 'danger');

      } else if (this.stringLengthChecker(this.descrizione_risposta)) {


        this.toast('ATTENZIONE! Hai lasciato un campo vuoto oppure hai superato la lunghezza massima!', 'danger');

      } else if (this.currentMailUser != null || this.currentMailUser != undefined) {
        this.apiService.inserisciRisposta(this.descrizione_risposta, this.currentMailUser, this.codice_domanda).then(
          (result) => {

            this.apiService.inviaNotifica(this.domandaMailUser, this.usernameUtente, "Ha risposto alla tua domanda", "answer", "null");
          },
          (rej) => {

          }
        );

      }
    }
  }


  async popupModificaDescrizioneRisposta() {

    const alert = await this.alertController.create({
      header: 'Modifica',
      inputs: [
        {
          name: 'descrizionePopUp',
          type: 'textarea',
          placeholder: this.rispostaCliccata.descrizione
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: insertedData => {
            this.descrizioneRispostaView = insertedData.descrizionePopUp;
            this.descrizioneRispostaToPass = insertedData.descrizionePopUp;

            this.modify().then(() => { this.doRefresh(event) });
          }
        }
      ]
    });

    await alert.present();

  }

  clickRisposta(risposta, i) {
    if (this.risposte[i]['cod_utente'] === this.currentMailUser) {

      this.dataService.codice_risposta = risposta.codice_risposta;
      this.rispostaCliccata = risposta;

    }
  }

  eliminaRisposta(risposta) {
    this.popUpEliminaRisposta(risposta.codice_risposta);

  }

  checkIfThereAreEnglishBadWords(string: string): boolean {

    var Filter = require('bad-words'),
      filter = new Filter();

    return filter.isProfane(string)

  }

  checkIfThereAreItalianBadWords(string: string): boolean {

    let list = require('italian-badwords-list');

    let array = list.array

    let stringArray = [];
    let stringPassed = string.split(' ');
    stringArray = stringArray.concat(stringPassed);
    var check;

    stringArray.forEach(element => {
      if (array.includes(element))
        check = true;
    });

    return check;

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


  doRefresh(event) {
    clearInterval(this.interval)
    this.visualizzaDomanda();
    this.showRisposte();

    setTimeout(() => {

      event.target.complete();
    }, 2000);
  }


  async handleLoading() {
    const loading = await this.loadingController.create({
      message: 'Stiamo risolvendo i tuoi dubbi...',
      duration: 750
    });

    {
      await loading.present();
    }
  }


  async toast(message: string, color: string) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.color = color;
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
    return toast.present();
  }


  votoType: Array<number> = []
  modificaLike(i, value, risposta) {

    if (value == 1) {
      if (this.votoType[i] == 2) {
        this.numDislike2[i] -= 1
        this.votoType[i] = 1
        this.apiService.togliDislike(this.risposte2[risposta].codice_risposta)
          .then(() => this.apiService.rimuoviValutazione(this.risposte2[risposta].codice_risposta, this.currentMailUser)
            .then((data) => this.apiService.modificaNumLike(this.risposte2[risposta].codice_risposta))
            .then((res) => this.apiService.inserisciValutazione(this.risposte2[risposta].codice_risposta, this.currentMailUser, this.votoType[i]))
            .then(() => this.cod_valutazione[i] = this.cod_valutazione[this.cod_valutazione.length])

          )
      }
      else {
        this.votoType[i] = 1
        this.apiService.modificaNumLike(this.risposte[risposta].codice_risposta).then((data) => {
          this.apiService.inserisciValutazione(this.risposte2[risposta].codice_risposta, this.currentMailUser, this.votoType[i])
        }).catch((err) => { })
      }

    }

    if (value == -1) {
      this.votoType[i] = null
      this.apiService.rimuoviValutazione(this.risposte2[risposta].codice_risposta, this.currentMailUser).then((data) => {
        this.apiService.togliLike(this.risposte[risposta].codice_risposta)
      })
    }


    this.numLike2[i] = this.numLike2[i] + value || 0


  }


  modificaDislike(i, value, risposta) {
    var temp = true
    if (value == 1) {
      if (this.votoType[i] == 1) {
        this.numLike2[i] -= 1
        this.votoType[i] = 2
        this.apiService.togliLike(this.risposte2[risposta].codice_risposta)
          .then(() => this.apiService.rimuoviValutazione(this.risposte2[risposta].codice_risposta, this.currentMailUser)
            .then(() => this.apiService.modificaNumDislike(this.risposte2[risposta].codice_risposta))
            .then((res) => this.apiService.inserisciValutazione(this.risposte2[risposta].codice_risposta, this.currentMailUser, this.votoType[i]))
            .then(() => { }
            )
          )

      } else {
        this.votoType[i] = 2
        this.apiService.modificaNumDislike(this.risposte[risposta].codice_risposta).then((data) => {
          this.apiService.inserisciValutazione(this.risposte2[risposta].codice_risposta, this.currentMailUser, this.votoType[i])
        }).catch((err) => { })
      }
    }
    if (value == -1) {
      this.votoType[i] = null
      this.apiService.rimuoviValutazione(this.risposte2[risposta].codice_risposta, this.currentMailUser).then((data) => {
        this.apiService.togliDislike(this.risposte[risposta].codice_risposta)
      })
    }
    this.numDislike2[i] += value


  }
  cercaValutazione(cod_utente, risposte, i) {
    this.apiService.controllaGiaValutatoRisposta(cod_utente, risposte[i].codice_risposta).then(
      (result) => {
        if (result["0"]["data"] !== null) {
          this.codice_valutazione = result["0"]["data"]["0"]["codice_valutazione"];
          this.valutazioni.push(result["0"]["data"]["0"]);

        }

        if (result["0"]["data"] === null) {
          risposte[i]['tipo_like'] = -1;

        }
        else if (result["0"]["data"]["0"]["tipo_like"] === 1)
          risposte[i]['tipo_like'] = 1;

        else if (result["0"]["data"]["0"]["tipo_like"] === 2)
          risposte[i]['tipo_like'] = 2;
      },
      (rej) => {

      }
    );

  }

  interval
  async countDown(incAnno, incMese, incGG, incHH, incMM) {

    var auxData = new Array();
    auxData['0'] = (this.domanda['0'].dataeora.substring(0, 10).split("-")[0]);
    auxData['1'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[1];
    auxData['2'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[2];
    auxData['3'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[0];
    auxData['4'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[1];
    var countDownDate = new Date(parseInt(auxData['0'], 10) + incAnno, parseInt(auxData['1'], 10) - 1 + incMese, parseInt(auxData['2'], 10) + incGG, parseInt(auxData['3'], 10) + incHH, parseInt(auxData['4'], 10) + incMM).getTime();

    this.interval = setInterval(() => {
      var now = new Date().getTime();

      var distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);


      if (distance < 0) {
        clearInterval(this.interval);
        this.timerView = "Domanda scaduta";


      } else {
        this.timerView = days + "d " + hours + "h "
          + minutes + "m " + seconds + "s ";
      }

    }, 1000);

  }
  mappingIncrement(valueToMapp) {

    switch (valueToMapp) {
      case ("00:05:00"):
        this.countDown(0, 0, 0, 0, 5);

        break;
      case ("00:15:00"):

        this.countDown(0, 0, 0, 0, 15);

        break;
      case ("00:30:00"):

        this.countDown(0, 0, 0, 0, 30);

        break;
      case ("01:00:00"):

        this.countDown(0, 0, 0, 1, 0);

        break;
      case ("03:00:00"):

        this.countDown(0, 0, 0, 3, 0);

        break;
      case ("06:00:00"):

        this.countDown(0, 0, 0, 6, 0);

        break;
      case ("12:00:00"):

        this.countDown(0, 0, 0, 12, 0);

        break;
      case ("24:00:00"):

        this.countDown(0, 0, 1, 0, 0);

        break;
      case ("72:00:00"):

        this.countDown(0, 0, 3, 0, 0);

        break;
    }
  }

  clickProfilo(cod_utente) {
    this.dataService.loadingView(1500);
    this.dataService.setEmailOthers(cod_utente);
    this.navCtrl.navigateForward(['/visualizza-profilo']);
  }

  clickProprioProfilo(cod_utente) {
    this.dataService.loadingView(1500);
    this.dataService.setEmailOthers(cod_utente);
    this.navCtrl.navigateForward(['/visualizza-profiloutente']);
  }



  ionViewDidLeave() {
    clearInterval(this.interval);

  }

  openMenu() {
    this.menuCtrl.open();
  }


  goChat() {
    if (this.ospite === true) {
      this.toast('Effettua il login per chattare con gli altri utenti!', 'danger');
    } else {
      this.dataService.loadingView(2000);//visualizza il frame di caricamento
      this.dataService.setEmailOthers(this.domandaMailUser);
      this.navCtrl.navigateForward(['/chat'])
    }
  }

  deadlineCheck(): boolean {
    var date = new Date(this.dataeoraView.toLocaleString());
    var timer = this.timerView2;
    var dateNow = new Date().getTime();

    var time2 = date.getTime();
    var seconds = new Date('1970-01-01T' + timer + 'Z').getTime();

    var diff = dateNow - time2;

    return diff > seconds;
  }


  stringLengthChecker(string: String): boolean {

    if ((string.length > 1000) || !(string.match(/[a-zA-Z0-9_]+/))) {
      return true;
    } else {
      return false;
    }
  }

  async alertOspite() {
    const alert = await this.alertController.create({
      header: "Ospite",
      message:
        "Per usare questo servizio devi effettuare l'accesso, vuoi farlo?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {

          },
        },
        {
          text: "Si",
          handler: () => {
            this.storage.set("session", false);
            this.storage.set("utente", null);
            this.dataService.setSession(false);
            this.navCtrl.navigateRoot("login");

            setTimeout(() => {
              this.storage.get("session").then((data) => {

              });
            }, 3000);
          },
        },
      ],
    });
    await alert.present();
  }
  controllaOspite() {
    this.storage.get("session").then((data) => {
      if (data === false)
        this.ospite = true;
      else
        this.ospite = false;
    });
  }

  setRispostaVisible() {

    if (!this.deadlineCheck()) {
      if (this.rispostaVisible === false)
        this.rispostaVisible = true;

      else
        this.rispostaVisible = false;

    }
    else {
      this.toast('Non puoi più rispondere alla domanda, è scaduta!', 'danger');
    }

  }
}
