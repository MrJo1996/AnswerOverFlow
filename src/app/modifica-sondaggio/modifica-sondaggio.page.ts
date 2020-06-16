import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { ApiService } from 'src/app/providers/api.service';

import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";

import { NavController } from '@ionic/angular';
import { __await } from 'tslib';

import { DataService } from "../services/data.service";

@Component({
  selector: 'app-modifica-sondaggio',
  templateUrl: './modifica-sondaggio.page.html',
  styleUrls: ['./modifica-sondaggio.page.scss'],
})
export class ModificaSondaggioPage implements OnInit {

  codice_sondaggio: number;

  titoloToPass: string;
  timerToPass: string;

  titoloView;
  timerView;
  sondaggio = {};

  timerSettings: string[] = ["5 min", "15 min", "30 min", "1 ora", "3 ore", "6 ore", "12 ore", "1 giorno", "3 giorni"];
  interval;

  timerView2;

  constructor(private alertController: AlertController, public apiService: ApiService, private pickerController: PickerController,
    public navCtrl: NavController, public dataService: DataService, private toastController: ToastController, private menuCtrl: MenuController) { }


  ngOnInit() {

    this.codice_sondaggio = this.dataService.getCod_sondaggio();

    this.showSurvey();

  }

  async modify() {
   

    if (this.timerToPass == null) {
      this.timerToPass = this.timerView;
    }
    if (this.titoloToPass == null) {
      this.titoloToPass = this.titoloView;
    }

    if (this.stringLengthChecker()) {
      this.toastInvalidString();
    } else if (this.deadlineCheck()) {
      this.toastSondaggioScaduto();
    } else if (this.checkIfThereAreEnglishBadWords(this.titoloToPass) || this.checkIfThereAreItalianBadWords(this.titoloToPass)) {
      this.toastParolaScoretta();
    } else {
      this.apiService.modificaSondaggio(this.titoloToPass, this.timerToPass, this.codice_sondaggio).then(
        (result) => {
        },
        (rej) => {
  
        }
      );
      this.dataService.loadingView(3000);
      this.toastModificheEffettuate();
      this.navCtrl.back();
    }

  }

  async showSurvey() {
    this.apiService.getSondaggio(this.codice_sondaggio).then(
      (sondaggio) => {

        this.sondaggio = sondaggio['data'];
        this.titoloView = this.sondaggio['0'].titolo;
        this.timerView = this.sondaggio['0'].timer;

        this.mappingIncrement(this.sondaggio['0'].timer);

        var auxData = [];
        auxData['0'] = (this.sondaggio['0'].dataeora.substring(0, 10).split("-")[0]);
        auxData['1'] = this.sondaggio['0'].dataeora.substring(0, 10).split("-")[1];
        auxData['2'] = this.sondaggio['0'].dataeora.substring(0, 10).split("-")[2];
        auxData['3'] = this.sondaggio['0'].dataeora.substring(11, 18).split(":")[0];
        auxData['4'] = this.sondaggio['0'].dataeora.substring(11, 18).split(":")[1];

        var dataCreazioneToView = new Date(auxData['0'], parseInt(auxData['1'], 10) - 1, auxData['2'], auxData['3'], auxData['4']);

        document.getElementById("dataOraCreazione").innerHTML = dataCreazioneToView.toLocaleString();
      },
      (rej) => {
        
      }
    );

  }

  async popupModificaTitolo() {
    const alert = await this.alertController.create({
      header: 'Modifica',
      inputs: [
        {
          name: 'titoloPopUp',
          type: 'textarea',
          value: this.titoloView
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.titoloView = this.sondaggio['0'].titolo;
          }
        }, {
          text: 'Ok',
          handler: insertedData => {
            this.titoloView = insertedData.titoloPopUp;
            this.titoloToPass = insertedData.titoloPopUp;
            
            if (insertedData.titoloPopUp == "") {
              this.titoloView = this.sondaggio['0'].titolo;
              this.titoloToPass = this.sondaggio['0'].titolo;
            }
          }
        }
      ]
    });
    await alert.present();
  }
  async popupConfermaModificheSondaggio() {
    var header = "Conferma modifiche";
    var message = "Vuoi confermare le modifiche effettuate?";

    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: "Annulla",
          role: 'cancel'
        },
        {
          text: 'Conferma',
          handler: (value: any) => {
            
            this.modify();

          }
        }
      ],
    });

    await alert.present();
    let result = await alert.onDidDismiss();
  }

  async showTimerPicker() {
    let options: PickerOptions = {
      buttons: [
        {
          text: "Cancella",
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: (value: any) => {
            this.timerView = value['ValoreTimerSettato'].value;
            this.mappingTimerValueToPass(value['ValoreTimerSettato'].value);
         
          }
        }
      ],
      columns: [{
        name: 'ValoreTimerSettato',
        options: this.getColumnOptions()
      }]
    };

    let picker = await this.pickerController.create(options);
    picker.present()
  }

  getColumnOptions() {
    let options = [];

    var auxDataPicker = [];
    auxDataPicker['0'] = (this.sondaggio['0'].dataeora.substring(0, 10).split("-")[0]); //anno
    auxDataPicker['1'] = this.sondaggio['0'].dataeora.substring(0, 10).split("-")[1]; //mese [0]=gennaio
    auxDataPicker['2'] = this.sondaggio['0'].dataeora.substring(0, 10).split("-")[2]; //gg
    auxDataPicker['3'] = this.sondaggio['0'].dataeora.substring(11, 18).split(":")[0]; //hh
    auxDataPicker['4'] = this.sondaggio['0'].dataeora.substring(11, 18).split(":")[1]; //mm
    var dataPicker = new Date(parseInt(auxDataPicker['0'], 10), parseInt(auxDataPicker['1'], 10) - 1, parseInt(auxDataPicker['2'], 10), parseInt(auxDataPicker['3'], 10), parseInt(auxDataPicker['4'], 10));

    var nowPicker = new Date();

    var increment;
    this.timerSettings.forEach(x => {

      switch (x) {
        case (this.timerSettings['0']):
          increment = 5 * 60 * 1000;
          break;

        case (this.timerSettings['1']):
          increment = 15 * 60 * 1000;
          break;

        case (this.timerSettings['2']):
          increment = 30 * 60 * 1000;
          break;

        case (this.timerSettings['3']):
          increment = 60 * 60 * 1000;
          break;

        case (this.timerSettings['4']):
          increment = 3 * 60 * 60 * 1000;
          break;

        case (this.timerSettings['5']):
          increment = 6 * 60 * 60 * 1000;
          break;

        case (this.timerSettings['6']):
          increment = 12 * 60 * 60 * 1000;
          break;

        case (this.timerSettings['7']):
          increment = 24 * 60 * 60 * 1000;
          break;

        case (this.timerSettings['8']):
          increment = 72 * 60 * 60 * 1000;
          break;

      }

      if ((dataPicker.getTime() + increment) > (nowPicker.getTime())) {
        options.push({ text: x, value: x });
      }

    });
    return options;
  }

  mappingTimerValueToPass(valueToMapp) {

    switch (valueToMapp) {
      case (this.timerSettings['0']):
        this.timerToPass = "00:05:00";

        break;
      case (this.timerSettings['1']):
        this.timerToPass = "00:15:00";

        break;
      case (this.timerSettings['2']):
        this.timerToPass = "00:30:00";

        break;
      case (this.timerSettings['3']):
        this.timerToPass = "01:00:00";

        break;
      case (this.timerSettings['4']):
        this.timerToPass = "03:00:00";

        break;
      case (this.timerSettings['5']):
        this.timerToPass = "06:00:00";

        break;
      case (this.timerSettings['6']):
        this.timerToPass = "12:00:00";

        break;
      case (this.timerSettings['7']):
        this.timerToPass = "24:00:00";

        break;
      case (this.timerSettings['8']):
        this.timerToPass = "72:00:00";

        break;
    }
  }
  countDown(incAnno, incMese, incGG, incHH, incMM) {

    var auxData = [];
    auxData['0'] = (this.sondaggio['0'].dataeora.substring(0, 10).split("-")[0]);
    auxData['1'] = this.sondaggio['0'].dataeora.substring(0, 10).split("-")[1];
    auxData['2'] = this.sondaggio['0'].dataeora.substring(0, 10).split("-")[2];
    auxData['3'] = this.sondaggio['0'].dataeora.substring(11, 18).split(":")[0];
    auxData['4'] = this.sondaggio['0'].dataeora.substring(11, 18).split(":")[1];

    var countDownDate = new Date(parseInt(auxData['0'], 10) + incAnno, parseInt(auxData['1'], 10) - 1 + incMese, parseInt(auxData['2'], 10) + incGG, parseInt(auxData['3'], 10) + incHH, parseInt(auxData['4'], 10) + incMM).getTime();

    this.interval = setInterval(() => {

      var now = new Date().getTime();

      var distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      //document.getElementById("timeMissing").innerHTML = days + "giorni " + hours + "ore "
        //+ minutes + "min " + seconds + "s ";

      if (distance < 0) {
        clearInterval(this.interval);
        //document.getElementById("timeMissing").innerHTML = "Sondaggio scaduto.";
        this.timerView2 = 'sondaggio scaduto';
      } else {
        this.timerView2 = days + "d " + hours + "h "
          + minutes + "m " + seconds + "s ";
      }
    }, 1000);

  }

  ionViewDidLeave() {
    clearInterval(this.interval)
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

    stringArray.forEach( element => {
      if (array.includes(element))
      check = true; 
    });

    return check;

  }

    async toastParolaScoretta() {
      const toast = await this.toastController.create({
        message: 'Hai inserito una parola scorretta!',
        duration: 2000
      });
      toast.color = 'danger';
      toast.position = "top";
      toast.style.fontSize = '20px';
      toast.style.textAlign = 'center';
      toast.present();
    }


    goBack(){
      this.dataService.loadingView(3000);
      this.navCtrl.back();
    }

    async toastSondaggioScaduto() {
      const toast = await this.toastController.create({
        message: 'Sondaggio scaduto! Impossibile effettuare le modifiche!',
        duration: 2000
      });
      toast.color = 'danger';
      toast.position = "top";
      toast.style.fontSize = '20px';
      toast.style.textAlign = 'center';
      toast.present();
    }

    deadlineCheck(): boolean {
      var date = new Date(this.sondaggio['0'].dataeora.toLocaleString());
      var timer = this.sondaggio['0'].timer;
      var dateNow = new Date().getTime();
  

      var time2 = date.getTime();
      var seconds = new Date('1970-01-01T' + timer + 'Z').getTime();

      var diff = dateNow - time2;

      return diff > seconds;
    }

    stringLengthChecker():boolean {

      if ((this.titoloToPass.length > 300) || !(this.titoloToPass.match(/[a-zA-Z0-9_]+/))) {
      return true;
    } else {
      return false;
    }
  }

  async toastInvalidString() {
    const toast = await this.toastController.create({
      message: 'ATTENZIONE! Hai lasciato un campo vuoto oppure hai superato la lunghezza massima!',
      duration: 2000
    });
    toast.color = 'danger';
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.style.textAlign = 'center';
    toast.present();
  }

  async toastModificheEffettuate() {
    const toast = await this.toastController.create({
      message: 'Modifiche effettuate con successo!',
      duration: 2000
    });
    toast.color = 'success';
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.style.textAlign = 'center';
    toast.present();
  }

  openMenu(){
    this.menuCtrl.open();
  }

}