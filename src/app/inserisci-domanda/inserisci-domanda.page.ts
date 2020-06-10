import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/providers/api.service';
import { PostServiceService } from "../services/post-service.service";
import { DataService } from "../services/data.service";
import { AlertController, MenuController } from '@ionic/angular';
import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inserisci-domanda',
  templateUrl: './inserisci-domanda.page.html',
  styleUrls: ['./inserisci-domanda.page.scss'],
})

export class InserisciDomandaPage implements OnInit {

  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/inserisciDomanda'
  urlCategorie = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaCategorie'

  titolo = '';
  categorie: any;
  descrizione = '';

  cod_utente;
  cod_categoria: any;

  codCategoriaScelta;
  categoriaScelta;
  categoriaView;
  categoriaSettings: any = [];

  timerToPass: string;   //param per le funzioni
  timerView;             //var per la view dei valori
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
    this.menuCrtl.swipeGesture(false);
    this.apiService.prendiCategorie(this.urlCategorie).then(
      (categories) => {
        this.categoriaSettings = categories;
        console.log('Categorie visualizzate con successo.', this.categoriaSettings);
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione delle categorie.");
      }
    );

    this.storage.get('utente').then(data => { this.cod_utente = data.email });
      console.log(this.cod_utente);
  }


  //INVIO DATI AL SERVER

  async postInvio() {

    this.apiService.inserisciDomanda(this.timerToPass, this.titolo, this.descrizione, this.cod_utente, this.codCategoriaScelta).then(
      (result) => {

        console.log('INSERIMENTO AVVENUTO CON SUCCESSO:', this.titolo, this.timerToPass, this.descrizione, this.cod_utente, this.cod_categoria);

      },
      (rej) => {
        console.log('INSERIMENTO NON RIUSCITO');
      }
    );
  }


  //CHECK  ALL FIELD

  async checkField() {

    if ((this.checkIfThereAreItalianBadWords(this.titolo) || this.checkIfThereAreEnglishBadWords(this.titolo)) || (this.checkIfThereAreItalianBadWords(this.descrizione) || this.checkIfThereAreEnglishBadWords(this.descrizione))) {
      const toast = document.createElement('ion-toast');

      toast.message = 'Hai inserito una parola scorretta!';
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = '20px';
      toast.color = 'danger';
      toast.style.textAlign = 'center';

      document.body.appendChild(toast);
      return toast.present();
    } else if (this.titolo.length < 1 || this.titolo.length > 150 || !(this.titolo.match(/[a-zA-Z0-9_]+/))) {

      const toast = document.createElement('ion-toast');
      toast.message = 'Devi inserire un titolo valido!';
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = '20px';
      toast.color = 'danger';
      toast.style.textAlign = 'center';
      document.body.appendChild(toast);
      return toast.present();

    } else if (this.descrizione.length > 1000) {

      const toast = document.createElement('ion-toast');
      toast.message = 'Descrizione troppo lunga!';
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = '20px';
      toast.color = 'danger';
      toast.style.textAlign = 'center';
      document.body.appendChild(toast);
      return toast.present();

    } else if (this.categoriaScelta === undefined) {

      const toast = document.createElement('ion-toast');
      toast.message = 'Devi selezionare una categoria!';
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = '20px';
      toast.color = 'danger';
      toast.style.textAlign = 'center';
      document.body.appendChild(toast);
      return toast.present();

    } else if (this.timerToPass === undefined) {

      const toast = document.createElement('ion-toast');
      toast.message = 'Devi impostare un timer!';
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = '20px';
      toast.color = 'danger';
      toast.style.textAlign = 'center';
      document.body.appendChild(toast);
      return toast.present();

    } else {

      const alert = await this.alertController.create({
        header: 'Confermi la domanda?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Si',
            handler: () => {
              console.log('Confirm Okay');
              this.showOKToast();
              this.postInvio();
              this.dataService.setRefreshIndex(true);
              this.goHome();
            }
          }
        ]
      });
      await alert.present();
    }
  }

 checkIfThereAreItalianBadWords(string: string): boolean {

    let list = require('italian-badwords-list');

    let array = list.array

    console.log(array);

    let stringArray = [];
    let stringPassed = string.split(' ');
    stringArray = stringArray.concat(stringPassed);

    console.log(stringArray);

    var check;

    stringArray.forEach(element => {
      if (array.includes(element))
        check = true;
    });

    console.log(check);

    return check;

  }

  checkIfThereAreEnglishBadWords(string: string): boolean {

    var Filter = require('bad-words'),
      filter = new Filter();

    return filter.isProfane(string)

  }
 

  //CATEGORIA PICKER

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
            console.log(value);

            this.categoriaView = value['ValoreCategoriaSettata'].text; //setto timerPopUp al valore inserito nel popUp una volta premuto ok così viene visualizzato
            this.categoriaScelta = this.categoriaView;
            this.cod_categoria = value['ValoreCategoriaSettata'].value;
            this.codCategoriaScelta = this.cod_categoria;
            console.log('Codice catgoria settata: ', this.codCategoriaScelta);

          }
        }
      ],
      columns: [{
        name: 'ValoreCategoriaSettata', //nome intestazione json dato 
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


  //TIMER PICKER

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
            console.log(value);

            this.timerView = value['ValoreTimerSettato'].value;
            this.mappingTimerValueToPass(value['ValoreTimerSettato'].value);
            console.log('Timer settato: ', this.timerToPass);
          }
        }
      ],
      columns: [{
        name: 'ValoreTimerSettato', //nome intestazione json dato 
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
    //converto valore timer da passare nel formato giusto per il db
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


  //ROUTING

  goToCategoria() {
    this.router.navigate(['proponi-categoria']);
  }

  goHome() {
    this.router.navigate(['home']);
  }

  goBack() {
    this.navCtrl.back();
  }

  openMenu(){
    this.menuCrtl.open()
    console.log(this.menuCrtl.swipeGesture.length);
  }


  //SUCCESS TOAST

  async showOKToast() {
    const toast = document.createElement('ion-toast');
    toast.message = 'Inserimento avvenuto con successo!';
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.color = 'success';
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
    return toast.present();
  }

}
