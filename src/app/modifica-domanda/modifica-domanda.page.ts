import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, MenuController} from '@ionic/angular';
import { ApiService } from 'src/app/providers/api.service';
import { DataService } from "../services/data.service";

import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";

import { NavController } from '@ionic/angular';

import { __await } from 'tslib';

@Component({
  selector: 'app-modifica-domanda',
  templateUrl: './modifica-domanda.page.html',
  styleUrls: ['./modifica-domanda.page.scss'],
})
export class ModificaDomandaPage implements OnInit {
  urlCategorie = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaCategorie'


  codice_domanda: number;
  cod_preferita: number;
  cod_categoria: number;

  dataeoraToPass: string;
  timerToPass: string;
  titoloToPass: string;
  descrizioneToPass: string;
  categoriaToPass;
  
  categoriaScelta;
  categoriaSettings: any = [];
  codCategoriaScelta;
  codice_categoria;
  
  cod_categoriaView;
  categoriaView;
  dataeoraView;
  timerView;
  titoloView;
  descrizioneView;

  domanda = {};
  categories = {};

  timerSettings: string[] = ["5 min", "15 min", "30 min", "1 ora", "3 ore", "6 ore", "12 ore", "1 giorno", "3 giorni"]; //scelte nel picker


  
  constructor( private dataService: DataService, 
    public alertController: AlertController, 
    public apiService: ApiService,
    private pickerController: PickerController,
    private menuCtrl: MenuController,
    public toastController: ToastController,
    public navCtrl: NavController) { }

  ngOnInit() {
    
    this.apiService.prendiCategorie(this.urlCategorie).then(
      (categories) => {
        this.categoriaSettings = categories;
      },
    );

    this.showSurvey();
  }

  async modify() {

    if( this.titoloToPass == null) {
      this.titoloToPass = this.titoloView;
    }
    if (this.descrizioneToPass == null) {
      this.descrizioneToPass = this.descrizioneView;
    }

    if (this.dataeoraToPass == null) {
      this.dataeoraToPass = this.dataeoraView;
    }
    
    if (this.timerToPass == null) {
      this.timerToPass = this.timerView;
    }

    if (this.stringDescriptionChecker()) {
      this.popupInvalidDescription();
    } else if (this.stringTitleLengthChecker()) {
      this.popupInvalidTitle();
    } else if (this.checkIfThereAreEnglishBadWords(this.descrizioneToPass)
    || this.checkIfThereAreItalianBadWords(this.descrizioneToPass)
    || this.checkIfThereAreEnglishBadWords(this.titoloToPass)
    || this.checkIfThereAreItalianBadWords(this.titoloToPass)) {
      this.toastParolaScoretta();
    }
    else {
    this.apiService.modificaDomanda(this.codice_domanda, this.dataeoraToPass, this.timerToPass, this.titoloToPass, this.descrizioneToPass, this.categoriaToPass||this.categoriaView, this.cod_preferita);
    this.toastSuccess();
    }
  }

  async showSurvey() {
    this.codice_domanda = this.dataService.codice_domanda;

    this.apiService.getDomanda(this.codice_domanda).then(
      (domanda) => {
        
        this.domanda = domanda['data'];
        
        this.dataeoraView = this.domanda['0'].dataeora;
        this.timerView = this.domanda['0'].timer;
        this.titoloView = this.domanda['0'].titolo;
        this.descrizioneView = this.domanda['0'].descrizione;
        this.cod_preferita = this.domanda['0'].cod_preferita;
        this.cod_categoriaView = this.domanda['0'].cod_categoria;

        this.getCategoriaView();
      
        this.mappingIncrement(this.domanda['0'].timer);

        var auxData = [];
        auxData['0'] = (this.domanda['0'].dataeora.substring(0, 10).split("-")[0]);
        auxData['1'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[1];
        auxData['2'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[2];
        auxData['3'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[0];
        auxData['4'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[1];
        
        var dataCreazioneToView = new Date(auxData['0'], parseInt(auxData['1'], 10) - 1, auxData['2'], auxData['3'], auxData['4']);
       
        document.getElementById("dataOraCreazione").innerHTML = dataCreazioneToView.toLocaleString();
      
      },
      (rej) => {
        
      }
    );

  }

  getCategoriaView() {
    for (let j = 0; j < this.categoriaSettings.length; j++) {

      if (this.cod_categoriaView == this.categoriaSettings[j].codice_categoria)
        this.categoriaView = this.categoriaSettings[j].titolo;
    }
  }
  async showCategoriaPicker() {

    let options: PickerOptions = {
      buttons: [
        {
          text: "Annulla",
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: (value: any) => {

            this.categoriaView = value['ValoreCategoriaSettata'].text;
            this.categoriaToPass = this.categoriaView;
            this.cod_categoria = value['ValoreCategoriaSettata'].value;
            this.codCategoriaScelta = this.cod_categoria;
            this.categoriaToPass=this.codCategoriaScelta

          }
        }
      ],
      columns: [{
        name: 'ValoreCategoriaSettata',
        options: this.getCategorieOptions()
      }]

    };

    let picker = await this.pickerController.create(options);
    picker.present()
  }

  getCategorieOptions() {
    let options = [];
    this.categoriaSettings.forEach(x => {
      options.push({ text: x.titolo, value: x.codice_categoria });
    });
    return options;
  }

  stringDescriptionChecker():boolean {
    if (this.descrizioneToPass.length > 200) {
      return true;
    } else {
      return false;
    }
  }
  stringTitleLengthChecker():boolean {

    if ((this.titoloToPass.length > 200) || !(this.titoloToPass.match(/[a-zA-Z0-9_]+/))) {
    return true;
  } else {
    return false;
  }
}
async popupInvalidDescription(){
  const toast = document.createElement('ion-toast');
  toast.message = 'ERRORE! Hai superato la lunghezza massima!';
  toast.duration = 2000;
  toast.position = "top";
  toast.style.fontSize = '20px';
  toast.color = 'danger';
  toast.style.textAlign = 'center';
  document.body.appendChild(toast);
  return toast.present();
}
async popupInvalidTitle(){
    const toast = document.createElement('ion-toast');
    toast.message = 'ERRORE! Hai lasciato il titolo vuoto o hai superato la lunghezza massima!';
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.color = 'danger';
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
    return toast.present();
  }

  async popupModificaTitolo() {
    const alert = await this.alertController.create({
      header: 'Modifica titolo',
      inputs: [
        {
          name: 'titoloPopUp',
          type: 'text',
          placeholder: this.titoloView 
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.titoloView = this.domanda['0'].titolo; 
          }
        }, {
          text: 'Ok',

            handler: insertedData => {
           
            this.titoloView = insertedData.titoloPopUp; 
            this.titoloToPass = insertedData.titoloPopUp;

            if (insertedData.titoloPopUp == "") { 
              this.titoloView = this.domanda['0'].titolo;
              this.titoloToPass = this.domanda['0'].titolo;
            }
          }
        }
      ]
    });

    await alert.present();
  }
  
  async popupModificaDescrizione() {
    const alert = await this.alertController.create({
      header: 'Modifica descrizione',
      inputs: [
        {
          name: 'descrizionePopUp',
          type: 'text',
          placeholder: this.descrizioneView 
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.descrizioneView = this.domanda['0'].descrizione; 
          }
        }, {
          text: 'Ok',
          handler: insertedData => {
            this.descrizioneView = insertedData.descrizionePopUp;
            this.descrizioneToPass = insertedData.descrizionePopUp; 

            if (insertedData.descrizionePopUp == "") { 
              this.descrizioneView = this.domanda['0'].descrizione;
              this.descrizioneToPass = this.domanda['0'].descrizione;
            }
          }
        }
      ]
    });

    await alert.present();
  }


  async popupConfermaEliminaDomanda() {
    const alert = await this.alertController.create({
      header: 'Elimina domanda',
      message: 'Sicuro di voler eliminare questa domanda?',
      buttons: ['Conferma']
    });

    await alert.present();
  }


  async popupConfermaModificheDomanda() {
    const alert = await this.alertController.create({
      header: 'Conferma modifiche',
      message: 'Vuoi confermare le modifiche effettuate?',
      buttons: [
        {
          text: "Annulla",
          role: 'cancel'
        },
        {
          text: 'Conferma',
          handler: (value: any) => {

            
            this.modify();

            this.dataService.loadingView(3000);//visualizza il frame di caricamento
            this.navCtrl.navigateRoot('/visualizza-domanda');

          }
        }
      ],
    });
   
    await alert.present();
  }

  async showTimerPicker() {
    let options: PickerOptions = {
      buttons: [
        {
          text: "Cancel",
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
    auxDataPicker['0'] = (this.domanda['0'].dataeora.substring(0, 10).split("-")[0]); 
    auxDataPicker['1'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[1]; 
    auxDataPicker['2'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[2]; //gg
    auxDataPicker['3'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[0]; //hh
    auxDataPicker['4'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[1]; //mm
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

  interval
  async countDown(incAnno, incMese, incGG, incHH, incMM) {

    var auxData = [];
    auxData['0'] = (this.domanda['0'].dataeora.substring(0, 10).split("-")[0]);
    auxData['1'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[1];
    auxData['2'] = this.domanda['0'].dataeora.substring(0, 10).split("-")[2];
    auxData['3'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[0];
    auxData['4'] = this.domanda['0'].dataeora.substring(11, 18).split(":")[1];


    var countDownDate = new Date(parseInt(auxData['0'], 10) + incAnno, parseInt(auxData['1'], 10) - 1 + incMese, parseInt(auxData['2'], 10) + incGG, parseInt(auxData['3'], 10) + incHH, parseInt(auxData['4'], 10) + incMM).getTime();

    this.interval = setInterval(function () {

      var now = new Date().getTime();
      var distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);


      document.getElementById("timeMissingDomanda").innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

      this.timerView = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";
    

      if (distance < 0) {
        clearInterval(this.interval);
        document.getElementById("timeMissingDomanda").innerHTML = "Domanda scaduta.";
        this.timerView = "OMBO TIMER,SCADUTA";
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

  toastSuccess() {
    const toast = document.createElement("ion-toast");
    toast.message = "Modifiche effettuate!";
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = "20px";
    toast.color = "success";
    toast.style.textAlign = "center";
    document.body.appendChild(toast);
    return toast.present();
  }


  goBack() {
    this.dataService.loadingView(3000);//visualizza il frame di caricamento
    this.navCtrl.pop();
  }

  openMenu(){
    this.menuCtrl.open();
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
      toastParolaScoretta() {
      const toast = document.createElement("ion-toast");
      toast.message = 'Hai inserito una parola scorretta!',
      toast.duration = 2000;
      toast.color = 'danger';
      toast.position = "top";
      toast.style.fontSize = '20px';
      toast.style.textAlign = 'center';
      document.body.appendChild(toast);
    return toast.present();
    }
}
