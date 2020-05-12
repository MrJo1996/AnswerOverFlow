import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ApiService } from './../providers/api.service';
//Picker - import e poi definire nel constructor
import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";
import { isEmptyExpression } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inserimento-sondaggio',
  templateUrl: './inserimento-sondaggio.page.html',
  styleUrls: ['./inserimento-sondaggio.page.scss'],
})
export class InserimentoSondaggioPage implements OnInit {

  url = "http://localhost/AnswerOverFlow-BackEnd/public/inseriscisondaggio";
  urlCategorie = 'http://localhost/AnswerOverFlow-BackEnd/public/ricercaCategorie'
  urlScelta = 'http://localhost/AnswerOverFlow-BackEnd/public/inserisciScelteSondaggio';

  emailUtente = "gmailverificata";

  scelte:any=[];
  categorie: any;
  //parametri per le funzioni
  sondaggioInserito: number;
  categoriaScelta: number = -1;
  titolo: string = "";
  timerToPass: string = ""; 
  dataeora: any;

  timerView; //var per la view dei valori
  timerSettings: string[] = ["5 min", "15 min", "30 min", "1 ora", "3 ore", "6 ore", "12 ore", "1 giorno", "3 giorni"]; //scelte nel picker
  
  constructor(private service: ApiService,
              public navCtrl: NavController, 
              private pickerController: PickerController,
              public alertController: AlertController, 
              private router: Router) { }

  ngOnInit() {
    this.service.prendiCategorie(this.urlCategorie).then(
      (categories) => {
        console.log('Categorie visualizzate con successo', categories);
        this.categorie = categories;
        // this.categorie.push({
        //   'codice_categoria': 0,
        //   'titolo': 'Non hai trovato la categoria che cercavi?'
        // })
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );
  }

  Add(){
    this.scelte.push({'value':''});
    }
  
  Remove(index: any){
    this.scelte.splice(index, 1);
    }

  showScelta(event){
    console.log(event.value);
  }

  switchCategoria() {
    this.router.navigate(['proponi-categoria']);
  }

  inserisciSondaggio(){
    this.dataeora = new Date;
    this.dataeora.setHours(this.dataeora.getHours() + 2);
    let datoMancante = false;
    let errMex = "Hey, hai dimenticato di inserire";

    if(this.titolo === ""){
      datoMancante = true;
      errMex = errMex + " il titolo"
    }
    if(this.scelte.length < 2){
      if (datoMancante){
        errMex = errMex + ", le scelte"
      }
      else {
      datoMancante = true;
      errMex = errMex + " le scelte"
      }
    }
    if(this.timerToPass === ""){
      if (datoMancante){
        errMex = errMex + ", il timer"
      }
      else {
      datoMancante = true;
      errMex = errMex + " il timer"
      }
    }
    if(this.categoriaScelta == -1){
      if (datoMancante){
        errMex = errMex + " e la categoria"
      }
      else {
      datoMancante = true;
      errMex = errMex + " la categoria"
      }
    }
    this.checkField(datoMancante, errMex)
  }

    async checkField(datiMancanti: Boolean, text: string) {
      if (datiMancanti) {
        const alert = await this.alertController.create({
          header: text,
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
          header: 'Confermi il sondaggio?',
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
              }
            }
          ]
        });
        await alert.present();
      }
    }


    async postInvio(){
      this.service.inserisciSondaggio(this.url, this.timerToPass, this.dataeora, this.emailUtente, this.titolo, this.categoriaScelta).then(
        (sondaggio) => {
          this.sondaggioInserito = sondaggio['data']['codice_sondaggio'];
          console.log("il codice del sondaggio inserito è ", this.sondaggioInserito);
          for (let scelta of this.scelte){
            this.service.inserisciSceltaSondaggio(this.urlScelta, this.sondaggioInserito, scelta.value); 
          }
        },
        (rej) => {
          console.log("C'è stato un errore durante l'inserimento");
        }
      );
    }


  //PICKER
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

}
