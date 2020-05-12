import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ApiService } from './../providers/api.service';
//Picker - import e poi definire nel constructor
import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";
import { isEmptyExpression } from '@angular/compiler';

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

  timerView; //var per la view dei valori
  timerSettings: string[] = ["5 min", "15 min", "30 min", "1 ora", "3 ore", "6 ore", "12 ore", "1 giorno", "3 giorni"]; //scelte nel picker
  
  constructor(private service: ApiService,
              public navCtrl: NavController, 
              private pickerController: PickerController) { }

  ngOnInit() {
    this.service.prendiCategorie(this.urlCategorie).then(
      (categories) => {
        console.log('Categorie visualizzate con successo', categories);
        this.categorie = categories;
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

  inserisciSondaggio(){
    let dataeora = new Date;
    dataeora.setHours(dataeora.getHours() + 2);
    let datoMancante = false;
    let errMex = "Hey, hai dimenticato di inserire";


    console.log("Il timer passato è ", this.timerToPass, 
    " la categoria scelta è ", this.categoriaScelta,
    " il titolo immesso è ", this.titolo,
    " il numero di scelte inserito è ", this.scelte.length);


    if(this.titolo === ""){
      datoMancante = true;
      errMex = errMex + " il titolo"
      console.log("Manca il titolo amico");
    }
    if(this.scelte.length < 2){
      if (datoMancante){
        errMex = errMex + ", le scelte"
      }
      else {
      datoMancante = true;
      errMex = errMex + " le scelte"
      }
      console.log("Mancano le scelte amico");
    }
    for (let scelta of this.scelte){
      if(scelta['value'])
          datoMancante  = true;
          console.log("Non vale inserire scelte vuote zì");
    }
    if(this.timerToPass === ""){
      if (datoMancante){
        errMex = errMex + ", il timer"
      }
      else {
      datoMancante = true;
      errMex = errMex + " il timer"
      }
      console.log("Manca il timer amico");
    }
    if(this.categoriaScelta == -1){
      if (datoMancante){
        errMex = errMex + " e la categoria"
      }
      else {
      datoMancante = true;
      errMex = errMex + " la categoria"
      }
      console.log("Manca la categoria amico");
    }
    console.log(errMex)



    // this.service.inserisciSondaggio(this.url, '07:00', dataeora, this.emailUtente, "Un bel sondaggio", 1).then(
    //   (sondaggio) => {
    //     this.sondaggioInserito = sondaggio['data']['codice_sondaggio'];
    //     console.log("il codice del sondaggio inserito è ", this.sondaggioInserito);
    //     this.service.inserisciSceltaSondaggio(this.urlScelta, this.sondaggioInserito, "Questa è una bella descrizione per il mio primo sondaggio da App"); 
    //   },
    //   (rej) => {
    //     console.log("C'è stato un errore durante la visualizzazione");
    //   }
    // );

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
