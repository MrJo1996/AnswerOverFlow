import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, AlertController, IonCheckbox, MenuController } from '@ionic/angular';
import { PostServiceService } from "../services/post-service.service";
import { ApiService } from '../providers/api.service';
import { DataService } from '../services/data.service';
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-visualizza-sondaggio',
  templateUrl: './visualizza-sondaggio.page.html',
  styleUrls: ['./visualizza-sondaggio.page.scss'],
})
export class VisualizzaSondaggioPage implements OnInit {

  currentUser = " ";


  codice_sondaggio;
  sondaggio = {};
  sondaggioUser: string;

  codice_categoria;
  categoria;

  votato;
  voti_totali: number = 0;
  sceltaFatta: boolean;

  scelte = new Array();
  codici_scelte = new Array();
  sceltaSelezionata = " ";
  indexSceltaSelezionata: number;
  codiceSceltaSelezionata;
  percentualiScelte = new Array();
  timerView;
  profiloUserSondaggio = {};
  distanceTimer;

  sondaggioAperto: boolean;
  interval;
  viewTimer;
  dataeoraView

  ospite;

  votoUtente;

  numeroScelta;
  formatsDate: string[] = [
    'd-MM-y, H:mm'
  ];

  private coloreNonAttivo: string = "#2a2a2a";
  private coloreAttivo: string = "#64F58D";

  constructor(private navCtrl: NavController,
    private service: PostServiceService,
    private dataService: DataService,

    private menuCtrl: MenuController,
    public apiService: ApiService,
    private storage: Storage,
    public alertController: AlertController,
    public toastController: ToastController) { }

  ngOnInit() {
    this.storage.get('utente').then(data => { this.currentUser = data.email });

    if (this.currentUser.length === 0)
      this.currentUser = this.dataService.emailUtente;
    this.controllaOspite();
    if (this.ospite === false)
      this.currentUser = null;

    this.visualizzaSondaggioSelezionato();
    this.visualizzaScelte();
    this.giaVotato();


    if (this.distanceTimer < 0)
      this.sondaggioAperto = false;

    else
      this.sondaggioAperto = true;

  }

  @ViewChild('content', { read: IonContent, static: false }) myContent: IonContent;

  goModificaSondaggio() {

    if (this.deadlineCheck()) {
      this.toast('Il tuo sondaggio è scaduto, non puoi più modificarlo!', 'danger');
    }
    else if (this.voti_totali > 0) {
      this.toast('Ci sono dei voti al tuo sondaggio, non è più possibile modificarlo!', 'danger');
    } else {
      clearInterval(this.interval);
      this.dataService.loadingView(1500);
      this.navCtrl.navigateRoot(['/modifica-sondaggio']);
    }
  }

  async popUpEliminaSondaggio() {
    const alert = await this.alertController.create({
      header: 'Sei sicuro di voler eliminare questo sondaggio?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.toast('Sondaggio eliminato con successo!', 'success');
            this.cancellaSondaggio();
            this.goBack();
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

  async visualizzaSondaggioSelezionato() {
    this.codice_sondaggio = this.dataService.codice_sondaggio;
    this.apiService.getSondaggio(this.codice_sondaggio).then(
      (sondaggio) => {

        this.sondaggio = sondaggio['data']['0'];
        this.sondaggioUser = sondaggio['data']['0'].cod_utente;
        this.codice_categoria = sondaggio['data']['0'].cod_categoria;
        this.viewTimer = sondaggio['data']['0'].timer;
        this.dataeoraView = sondaggio['data']['0'].dataeora;
        this.mappingIncrement(sondaggio['data']['0'].timer);

        this.getUserSondaggio();
        this.visualizzaCategoria();
      },
      (rej) => {

      }
    );



  }

  async visualizzaScelte() {

    this.apiService.getScelteSondaggio(this.codice_sondaggio).then(
      (scelte) => {
        this.scelte = scelte['Scelte']['data'];
        let i = 0;
        this.voti_totali = 0;
        this.scelte.forEach(element => {
          var x = +element.num_favorevoli;
          this.voti_totali = this.voti_totali + x;

        });
        this.calcolaPercentualiScelte();
      },
      (rej) => {

      }
    );
  }

  calcolaPercentualiScelte() {

    this.percentualiScelte = [];
    this.scelte.forEach(element => {
      var x = +element.num_favorevoli;
      var nuovaPercentuale: number = (x) / this.voti_totali;
      var nuovaPercentualeStringata = nuovaPercentuale.toFixed(1);
      var nuovaPercentualeNum = +nuovaPercentualeStringata;
      this.percentualiScelte.push(nuovaPercentualeNum);

    });
    ;
  }

  async cancellaSondaggio() {

    this.apiService.rimuoviSondaggio(this.codice_sondaggio).then(
      (scelte) => {
        this.scelte = scelte['Scelte']['data'];

      },
      (rej) => {

      }
    );
  }

  async giaVotato() {
    this.currentUser = this.dataService.emailUtente;
    this.codice_sondaggio = this.dataService.codice_sondaggio;

    this.apiService.controllaGiaVotato(this.currentUser, this.codice_sondaggio).then(
      (risultato) => {

        if (risultato !== null) {
          this.votoUtente = risultato[0].cod_scelta;
          this.votato = true;

        } else {
          this.votato = false;
          this.votoUtente = null;
        }
      },
      (rej) => {

      }
    );

  }

  async inviaVoto() {
    this.codiceSceltaSelezionata = this.scelte[this.indexSceltaSelezionata]['codice_scelta'];
    this.apiService.votaSondaggio(this.codiceSceltaSelezionata, this.codice_sondaggio).then(
      (scelte) => { },
      (rej) => { }
    );

    this.apiService.inserisciVotante(this.codiceSceltaSelezionata, this.currentUser, this.codice_sondaggio).then(
      (scelte) => { },
      (rej) => { }
    );
  }

  async goBack() {
    if (this.sceltaFatta === true) {
      const alert = await this.alertController.create({
        header: 'Sei sicuro di voler uscire senza confermare il voto?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {

            }
          }, {
            text: 'Si',
            handler: () => {
              this.dataService.loadingView(5000);//visualizza il frame di caricamento
              this.navCtrl.back();
            }
          }
        ]
      });
      await alert.present();
    }
    else {
      this.dataService.loadingView(5000);//visualizza il frame di caricamento
      this.navCtrl.back();
    }
  }



  getScelta(scelta, i) {
    if (this.deadlineCheck()) {
      this.toastSondaggioScaduto();
    } else {
      if (this.currentUser != undefined || this.currentUser != null) {
        this.selezionaChecked(i);

        if (!this.sceltaFatta || this.sceltaSelezionata != scelta) {
          this.sceltaFatta = true;

        }
        else {
          this.sceltaFatta = false;

        }
        this.sceltaSelezionata = scelta;
        this.indexSceltaSelezionata = i;

      }
    } if (this.ospite === true) this.alertOspite();
  }

  async confermaVoto(scelta) {
    const alert = await this.alertController.create({
      header: 'Sei sicuro della tua scelta?Ti ricordiamo che non sarà più possibile cambiarla in futuro.',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.dataService.loadingView(2500);
  
            this.inviaVoto();
            this.ngOnInit();
            this.sceltaFatta = false;
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

  async refreshDopoVoto(event) {
    clearInterval(this.interval);
    this.votato = true;
    this.visualizzaScelte();

    this.giaVotato();
    this.sceltaFatta = false;
    this.mappingIncrement(this.viewTimer);
    setTimeout(() => {

      event.target.complete();
    }, 1000);
  }

  async refresh(event) {
    clearInterval(this.interval);
    this.votato = false;
    this.sceltaFatta = false;

    this.ngOnInit();
    setTimeout(() => {

      event.target.complete();
    }, 1000);
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

  async getUserSondaggio() {
    this.apiService.getProfilo(this.sondaggioUser).then(
      (profilo) => {

        this.profiloUserSondaggio = profilo['data']['0'];;
      },
      (rej) => {

      }
    );
  }

  mappingIncrement(valueToMapp) {
    this.mapValuesTillHalfHour(valueToMapp);
    this.mapValuesTillSixHours(valueToMapp);
    this.mapValuesTill3Days(valueToMapp);
  }

  mapValuesTillHalfHour(valueToMapp) {
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
    }
  }

  mapValuesTillSixHours(valueToMapp) {
    switch (valueToMapp) {
      case ("01:00:00"):

        this.countDown(0, 0, 0, 1, 0);

        break;
      case ("03:00:00"):

        this.countDown(0, 0, 0, 3, 0);

        break;
      case ("06:00:00"):

        this.countDown(0, 0, 0, 6, 0);

        break;
    }
  }

  mapValuesTill3Days(valueToMapp) {
    switch (valueToMapp) {
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

  countDown(incAnno, incMese, incGG, incHH, incMM) {

    var auxData = [];
    auxData['0'] = (this.sondaggio['dataeora'].substring(0, 10).split("-")[0]);
    auxData['1'] = this.sondaggio['dataeora'].substring(0, 10).split("-")[1];
    auxData['2'] = this.sondaggio['dataeora'].substring(0, 10).split("-")[2];
    auxData['3'] = this.sondaggio['dataeora'].substring(11, 18).split(":")[0];
    auxData['4'] = this.sondaggio['dataeora'].substring(11, 18).split(":")[1];
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
        this.timerView = "Sondaggio scaduto";
        
      } else {
        this.timerView = days + "d " + hours + "h "
          + minutes + "m " + seconds + "s ";
      }

    }, 1000);

  }

  openMenu() {
    this.menuCtrl.open();
  }

  ionViewDidLeave() {
    clearInterval(this.interval);

  }


  goChat() {
    if (this.ospite === true) {
      this.toast('Effettua il login per chattare con gli altri utenti!', 'danger');
    } else {
      this.dataService.loadingView(2000);//visualizza il frame di caricamento
      this.dataService.setEmailOthers(this.sondaggioUser);
      this.navCtrl.navigateForward(['/chat'])
    }


  }

  clickProfilo(cod_utente) {
    this.dataService.loadingView(2000);//visualizza il frame di caricamento
    this.dataService.setEmailOthers(cod_utente);
    this.navCtrl.navigateForward(['/visualizza-profilo']);
  }

  deadlineCheck(): boolean {
    var date = new Date(this.dataeoraView.toLocaleString());
    var timer = this.viewTimer;
    var dateNow = new Date().getTime();
    var time2 = date.getTime();
    var seconds = new Date('1970-01-01T' + timer + 'Z').getTime();
    var diff = dateNow - time2;

    return diff > seconds;
  }

  async toastSondaggioScaduto() {
    const toast = await this.toastController.create({
      message: 'Sondaggio scaduto! Impossibile votare!',
      duration: 2000
    });
    toast.color = 'danger';
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.style.textAlign = 'center';
    toast.present();
  }


  async toastModificaSondaggioCiSonoVoti() {
    const toast = await this.toastController.create({
      message: 'Ci sono dei voti al tuo sondaggio, non è più possibile modificarlo!',
      duration: 2000
    });
    toast.color = 'danger';
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.style.textAlign = 'center';
    toast.present();
  }

  selezionaChecked(i) {

    if (i === this.numeroScelta) {
      this.numeroScelta = -1;
    }
    else {
      this.numeroScelta = i;
    }
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
}
