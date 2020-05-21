import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/providers/api.service';
import { PostServiceService } from "../services/post-service.service";
import { DataService } from "../services/data.service";
import { AlertController } from '@ionic/angular';
import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";

@Component({
  selector: 'app-inserisci-domanda',
  templateUrl: './inserisci-domanda.page.html',
  styleUrls: ['./inserisci-domanda.page.scss'],
})

export class InserisciDomandaPage implements OnInit {

  titolo = '';
  categorie: any;
  descrizione = '';
  cod_utente = 'gmailverificata';  //gmailVerificata
  cod_categoria: any;
  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/inserisciDomanda'
  urlCategorie = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaCategorie'

  timerToPass: string; //param per le funzioni
  timerView; //var per la view dei valori
  timerSettings: string[] = ["5 min", "15 min", "30 min", "1 ora", "3 ore", "6 ore", "12 ore", "1 giorno", "3 giorni"]; //scelte nel picker

  constructor(public apiService: ApiService,
    public alertController: AlertController,
    private pickerController: PickerController,
    private router: Router,
    private dataService: DataService,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.apiService.prendiCategorie(this.urlCategorie).then(
      (categories) => {
        console.log('Categorie visualizzate con successo', categories);
        this.categorie = categories;
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );

    this.cod_utente = this.dataService.getEmail_Utente();

  }

  async checkField() {
    if ((this.titolo.length < 1) || (this.timerToPass == undefined) || (this.cod_categoria == undefined)) {
      const alert = await this.alertController.create({
        header: 'Devi compilare i campi obbligatori!',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel');
            }
          }
        ]
      });
      await alert.present();
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
              this.postInvio();
              this.goHome();
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async postInvio() {
    this.apiService.inserisciDomanda(this.timerToPass, this.titolo, this.descrizione, this.cod_utente, this.cod_categoria).then(
      (result) => {

        console.log('Inserimento avvenuto con successo:', this.titolo, this.timerToPass, this.descrizione, this.cod_utente, this.cod_categoria);
      },
      (rej) => {
        console.log('Inserimento non riuscito!');
      }
    );
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
            console.log(value);

            this.timerView = value['ValoreTimerSettato'].value; //setto timerPopUp al valore inserito nel popUp una volta premuto ok così viene visualizzato
            //this.timerToPass = value['ValoreTimerSettato'].value; //setto timerPopUp al valore inserito nel popUp una volta premuto ok 
            /* this.timerToPass = this.timerToPass.split(" ")[0]; //taglio la stringa dopo lo spazio e prendo a partira da carattere zero */
            this.mappingTimerValueToPass(value['ValoreTimerSettato'].value);
            console.log('timer to pass: ', this.timerToPass);
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

  switchCategoria() {
    this.router.navigate(['proponi-categoria']);
  }

  goHome() {
    this.router.navigate(['home']);
  }

  goBack() {
    this.navCtrl.back();
  }

}
