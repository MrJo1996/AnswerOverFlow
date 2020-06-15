import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, AlertController, IonCheckbox, MenuController } from '@ionic/angular';
import { PostServiceService } from "../services/post-service.service";
import { TransitiveCompileNgModuleMetadata, ThrowStmt } from '@angular/compiler';

import { ApiService } from '../providers/api.service';
import { DataService } from '../services/data.service';
import { NavController } from "@ionic/angular";
import { element } from 'protractor';
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

  thrashActive;

  codice_categoria;
  categoria;

  votato;
  voti_totali: number = 0;
  hasVoted: boolean;

  scelte = new Array();
  codici_scelte = new Array();
  sceltaSelezionata = " ";
  index_scelta_selezionata: number;
  codice_scelta_selezionata;
  percentualiScelte = new Array();

  profiloUserSondaggio = {};
  distanceTimer;

  isSondaggioActive;
  interval;
  timerView2;
  dataeoraView

  numeroScelta;
  formatsDate: string[] = [
    'd MMM y, H:mm'];




  private buttonColor: string = "#2a2a2a";
  private buttonColorBest: string = "#64F58D";


  arrayChecked = new Array();

  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/cancellaSondaggio/14'
  url2 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaSondaggio'
  url3 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaScelteSondaggio'

  constructor(private navCtrl: NavController,
    private service: PostServiceService,
    private dataService: DataService,

    private menuCtrl: MenuController,
    public apiService: ApiService,
    private storage: Storage,
    public alertController: AlertController,
    public toastController: ToastController) { }

  ngOnInit() {
    //this.storage.get('utente').then(data => { this.currentUser = data.email });

    this.visualizzaSondaggioSelezionato();
    this.visualizzaScelte();
    this.giaVotato();




    if (this.distanceTimer < 0)
      this.isSondaggioActive = false;

    else
      this.isSondaggioActive = true;

  }

  @ViewChild('content', { read: IonContent, static: false }) myContent: IonContent;

  goModificaSondaggio() {

    if (this.deadlineCheck()) {
      this.toastModificaSondaggioScaduto();
    }
    else if (this.voti_totali > 0) {
      //this.router.navigate(['modifica-sondaggio']);
      this.toastModificaSondaggioCiSonoVoti();
    }
    else {
      //this.router.navigate(['modifica-domanda']);
      //Visualizza il frame di caricamento
      const loading = document.createElement('ion-loading');
      loading.cssClass = 'loading';
      loading.spinner = 'crescent';
      loading.duration = 1500;
      document.body.appendChild(loading);
      loading.present();

      this.navCtrl.navigateForward(['/modifica-sondaggio']);
    }
  }



  async popUpEliminaSondaggio() {
    const alert = await this.alertController.create({
      header: 'Sei sicuro di voler eliminare questo sondaggio?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
  
            this.showDeleteToast();
            this.cancellaSondaggio();
            this.goBack();
          }
        },
        {
          text: 'No',
          role: 'cancel',
          //cssClass: 'secondary',
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
        this.timerView2 = sondaggio['data']['0'].timer;
        this.dataeoraView = sondaggio['data']['0'].dataeora;
        this.mappingIncrement(sondaggio['data']['0'].timer);

        this.getUserSondaggio();
        this.visualizzaCategoria();
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );



  }

  async visualizzaScelte() {

    this.apiService.getScelteSondaggio(this.codice_sondaggio).then(
      (scelte) => {


        this.scelte = scelte['Scelte']['data'];


        let i = 0;
        this.voti_totali = 0;
        this.arrayChecked = new Array();

        this.scelte.forEach(element => {
          var x = +element.num_favorevoli;
          this.voti_totali = this.voti_totali + x;
          this.arrayChecked.push(0);
        });
        this.calcolaPercentualiScelte();
      },
      (rej) => {

      }
    );

  }

  calcolaPercentualiScelte() {

    this.percentualiScelte = new Array();
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


        this.votato = risultato["0"]["data"];
      },
      (rej) => {
 
      }
    );

  }


  async inviaVoto() {
    this.codice_scelta_selezionata = this.scelte[this.index_scelta_selezionata]['codice_scelta'];
    console.log('codice scelta ->', this.codice_scelta_selezionata);
    console.log('codice sondaggio ->', this.codice_sondaggio);
    this.apiService.votaSondaggio(this.codice_scelta_selezionata, this.codice_sondaggio).then(
      (scelte) => {

      },
      (rej) => {
    
      }
    );


    this.apiService.inserisciVotante(this.codice_scelta_selezionata, this.currentUser, this.codice_sondaggio).then(
      (scelte) => {

      },
      (rej) => {
 
      }
    );

  }



  async goBack() {
    if (this.hasVoted === true) {
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
          

              //Visualizza il frame di caricamento
              const loading = document.createElement('ion-loading');
              loading.cssClass = 'loading';
              loading.spinner = 'crescent';
              loading.duration = 3000;
              document.body.appendChild(loading);
              loading.present();

              this.navCtrl.pop();
            }
          }
        ]
      });

      await alert.present();
    }
    else {
      //Visualizza il frame di caricamento
      const loading = document.createElement('ion-loading');
      loading.cssClass = 'loading';
      loading.spinner = 'crescent';
      loading.duration = 3000;
      document.body.appendChild(loading);
      loading.present();

      this.navCtrl.back();
    }
  }



  getScelta(scelta, i) {
    if (this.deadlineCheck()) {
      this.toastSondaggioScaduto();
    } else {

      this.selezionaChecked(i);

      if (!this.hasVoted || this.sceltaSelezionata != scelta) {
        this.hasVoted = true;

      }
      else {
        this.hasVoted = false;

      }

      this.sceltaSelezionata = scelta;
      this.index_scelta_selezionata = i;
      console.log();
    }
  }

  async confermaVoto(scelta) {
    const alert = await this.alertController.create({
      header: 'Sei sicuro della tua scelta',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            console.log('scelta confermata');
            this.inviaVoto().then(()=>{
              this.doRefresh(event);
            });
            //this.router.navigate(['home']);
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

  async doRefresh(event) {
    clearInterval(this.interval);
    this.votato = true;
    //this.visualizzaSondaggioSelezionato();

    this.ngOnInit();
    //this.visualizzaScelte();

    //this.giaVotato();
    this.hasVoted = false;
    setTimeout(() => {

      event.target.complete();
    }, 1000);
  }


  async doNormalRefresh(event) {
    clearInterval(this.interval);
    this.votato = false;
    this.hasVoted = false;
    //this.visualizzaSondaggioSelezionato();

    this.ngOnInit();
    //this.visualizzaScelte();

    //this.giaVotato();
   
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

    this.interval = setInterval(function () {


      var now = new Date().getTime();

      this.distanceTimer = countDownDate - now;

      var days = Math.floor(this.distanceTimer / (1000 * 60 * 60 * 24));
      var hours = Math.floor((this.distanceTimer % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((this.distanceTimer % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((this.distanceTimer % (1000 * 60)) / 1000);

      document.getElementById("timeLeft").innerHTML = days + "giorni " + hours + "ore "
        + minutes + "min " + seconds + "s ";
      if (this.distanceTimer < 0) {
        clearInterval(this.interval);
        this.isSondaggioActive = false;

        document.getElementById("timeLeft").innerHTML = "Sondaggio scaduto.";

      }
    }, 1000);

  }

  openMenu() {
    this.menuCtrl.open();
  }

  ionViewDidLeave() {

    clearInterval(this.interval);
  }

  ionViewDidEnter() {
    clearInterval(this.interval);
    this.mappingIncrement(this.timerView2);
  }

  goChat() {
    this.dataService.setEmailOthers(this.sondaggioUser);
    //Visualizza il frame di caricamento
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = 1500;
    document.body.appendChild(loading);
    loading.present();

    this.navCtrl.navigateForward(['/chat'])

  }


  clickProfilo(cod_utente) {
    this.dataService.setEmailOthers(cod_utente);
 
    this.navCtrl.navigateForward(['/visualizza-profilo']);
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

  async toastModificaSondaggioScaduto() {
    const toast = await this.toastController.create({
      message: 'Il tuo sondaggio è scaduto, non puoi più modificarlo!',
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
}
