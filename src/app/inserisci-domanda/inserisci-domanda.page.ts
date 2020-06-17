import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/providers/api.service';
import { DataService } from "../services/data.service";
import { AlertController, MenuController } from '@ionic/angular';
import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { ToastController } from '@ionic/angular';
import { PostServiceService } from "../services/post-service.service";

@Component({
  selector: 'app-inserisci-domanda',
  templateUrl: './inserisci-domanda.page.html',
  styleUrls: ['./inserisci-domanda.page.scss'],
})

export class InserisciDomandaPage implements OnInit {

  url = 'https://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/inserisciDomanda'
  urlCategorie = 'https://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaCategorie'

  titolo = '';
  categorie: any;
  descrizione = '';

  cod_utente;
  cod_categoria: any;

  codCategoriaScelta;
  categoriaScelta;
  categoriaView;
  categoriaSettings: any = [];

  timerToPass: string;
  timerView;
  timerSettings: string[] = ["5 min", "15 min", "30 min", "1 ora", "3 ore", "6 ore", "12 ore", "1 giorno", "3 giorni"];

  constructor(public apiService: ApiService,
    public alertController: AlertController,
    private pickerController: PickerController,
    private router: Router,
    private menuCrtl: MenuController,
    private dataService: DataService,
    private navCtrl: NavController,
    private storage: Storage,
    public toastController: ToastController) { }


  ngOnInit() {

    this.apiService.prendiCategorie(this.urlCategorie).then(
      (categories) => {
        this.categoriaSettings = categories;
      },
      (rej) => { }
    );
    this.storage.get('utente').then(data => { this.cod_utente = data.email });

  }


  async checkField() {

    if ((this.checkIfThereAreItalianBadWords(this.titolo) || this.checkIfThereAreEnglishBadWords(this.titolo))
      || (this.checkIfThereAreItalianBadWords(this.descrizione) || this.checkIfThereAreEnglishBadWords(this.descrizione))) {
      this.showMessage("Hai inserito una parola scorretta!", "danger");
    } else if (this.titolo.length < 1 || this.titolo.length > 150 || !(this.titolo.match(/[a-zA-Z0-9_]+/))) {
      this.showMessage("Devi inserire un titolo valido!", "danger");
    } else if (this.descrizione.length > 1000) {
      this.showMessage("Devi inserire una descrizione valida!", "danger");
    } else if (this.categoriaScelta === undefined) {
      this.showMessage("Devi selezionare una categoria!", "danger");
    } else if (this.timerToPass === undefined) {
      this.showMessage("Devi impostare un timer!", "danger");
    } else {
      this.confirmAlert();
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
            this.categoriaScelta = this.categoriaView;
            this.cod_categoria = value['ValoreCategoriaSettata'].value;
            this.codCategoriaScelta = this.cod_categoria;
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
  async showTimerPicker() {

    let options: PickerOptions = {
      buttons: [
        {
          text: "Annulla",
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
    this.timerSettings.forEach(x => {
      options.push({ text: x, value: x });
    });
    return options;

  }
  mappingTimerValueToPass(valueToMapp) {

    switch (valueToMapp) {
      case (this.timerSettings['0']):
        this.timerToPass = "00:05";
        break;
      case (this.timerSettings['1']):
        this.timerToPass = "00:15";
        break;
      case (this.timerSettings['2']):
        this.timerToPass = "00:30";
        break;
      case (this.timerSettings['3']):
        this.timerToPass = "01:00";
        break;
      case (this.timerSettings['4']):
        this.timerToPass = "03:00";
        break;
      case (this.timerSettings['5']):
        this.timerToPass = "06:00";
        break;
      case (this.timerSettings['6']):
        this.timerToPass = "12:00";
        break;
      case (this.timerSettings['7']):
        this.timerToPass = "24:00";
        break;
      case (this.timerSettings['8']):
        this.timerToPass = "72:00";
        break;
    }

  }


  async sendData() {

    this.apiService.inserisciDomanda(this.timerToPass, this.titolo, this.descrizione, this.cod_utente, this.codCategoriaScelta).then(
      (result) => { },
      (rej) => { }
    );

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
  checkIfThereAreEnglishBadWords(string: string): boolean {

    var Filter = require('bad-words'),
      filter = new Filter();

    return filter.isProfane(string)

  }


  showMessage(message: string, color: string) {

    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 2000;
    toast.position = "top";
    toast.color = color;
    document.body.appendChild(toast);
    return toast.present();

  }
  async confirmAlert() {

    const alert = await this.alertController.create({
      header: 'Confermi la domanda?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Si',
          handler: () => {
            this.showMessage("Inserimento avvenuto con successo!", "success");
            this.sendData();
            this.goHome();
          }
        }
      ]
    });
    await alert.present();

  }


  goProponiCategoria() {
    this.router.navigate(['proponi-categoria']);
  }
  goHome() {
    this.dataService.loadingView(5000);//visualizza il frame di caricamento
    this.router.navigate(['home']);

  }
  goBack() {
    this.dataService.loadingView(5000);//visualizza il frame di caricamento
    this.navCtrl.back();

  }
  openMenu() {
    this.menuCrtl.open()
    console.log(this.menuCrtl.swipeGesture.length);
  }

}
