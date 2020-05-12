import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from './../providers/api.service';
//Picker - import e poi definire nel constructor
import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";

@Component({
  selector: 'app-inserimento-sondaggio',
  templateUrl: './inserimento-sondaggio.page.html',
  styleUrls: ['./inserimento-sondaggio.page.scss'],
})
export class InserimentoSondaggioPage implements OnInit {

  url = "http://localhost/AnswerOverFlow-BackEnd/public/ricercaCategorie";
  scelte:any=[];
  data: boolean;
  categorie: any;
  categoriaScelta = "xxx";
  
  timerToPass: string; //param per le funzioni

  timerView; //var per la view dei valori
  timerSettings: string[] = ["5 min", "15 min", "30 min", "1 ora", "3 ore", "6 ore", "12 ore", "1 giorno", "3 giorni"]; //scelte nel picker
  
  constructor(private service: ApiService,
              public navCtrl: NavController, 
              private pickerController: PickerController) { }

  ngOnInit() {
    this.service.prendiCategorie(this.url).then(
      (categories) => {
        console.log('Visualizzato con successo', categories);
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
    console.log(event);
  }

  // showTimer(){
  //   console.log(this.myTime)
  // }

    //PICKER PROVA
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
