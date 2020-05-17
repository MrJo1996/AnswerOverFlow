import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, AlertController } from '@ionic/angular';
import { PostServiceService } from "../services/post-service.service";
import { TransitiveCompileNgModuleMetadata, ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';
import { ApiService } from '../providers/api.service';
import { DataService } from '../services/data.service';



@Component({
  selector: 'app-visualizza-sondaggio',
  templateUrl: './visualizza-sondaggio.page.html',
  styleUrls: ['./visualizza-sondaggio.page.scss'],
})
export class VisualizzaSondaggioPage implements OnInit {

  codice_sondaggio = 15
  sondaggio = {};
  scelte;
  currentUser = "gmailverificata"
  sondaggioUser;



  thrashActive;

  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/cancellaSondaggio/14'
  url2 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaSondaggio'
  url3 = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaScelteSondaggio'

  constructor(private service: PostServiceService, private dataService: DataService,private router: Router, public apiService: ApiService, public alertController: AlertController) { }

  ngOnInit() {
    this.visualizzaSondaggioSelezionato();
    this.visualizzaScelte();

  }

  @ViewChild('content', { read: IonContent, static: false }) myContent: IonContent;

/*   elimina() {

    let deleteData = {
      "codice_sondaggio": this.codice_sondaggio

    }

    this.resultDelete = this.service.deleteService(this.url, deleteData).then((data) => {
      this.requestDelete = data;


      console.log(data);
    }, err => {
      console.log(err.message);
    });
  }
 */

  goModificaDomanda() {
    this.router.navigate(['modifica-domanda']);
  }

  async popUpEliminaSondaggio(){
    const alert = await this.alertController.create({
      header: 'Sei sicuro di voler eliminare questo sondaggio?',
      buttons: [
         {
          text: 'Si',
          handler: () => {
            console.log('sondaggio eliminato');
          this.cancellaSondaggio();
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

  async visualizzaSondaggioSelezionato() {
    //this.codice_sondaggio= this.dataService.codice_sondaggio;
    this.apiService.getSondaggio(this.codice_sondaggio).then(
      (sondaggio) => {
      
        console.log('Visualizzato con successo');
     
        this.sondaggio = sondaggio['data']['0']; 
        this.sondaggioUser = sondaggio['data']['0'].cod_utente;
        
        
        //assegno alla variabile locale il risultato della chiamata. la variabile sarà utilizzata nella stampa in HTML
        /*this.titoloView = this.sondaggio['0'].titolo;  //setto var da visualizzare a video per risolvere il problema del crop schermo durante il serve dell'app ( problema stava nell'utilizzo di: ['0'] per accedere alla var da visualizzare)
        this.timerView = this.sondaggio['0'].timer;

        console.log('Sondaggio: ', this.sondaggio['0']);
        //il json di risposta della chiamata è così impostato-> Sondaggio: data: posizione{vari paramentri}
        //bisogna quindi accedere alla posizione del sondaggio da visualizzare
        //in apiservice accediamo già alla posizione 'Sondaggio'. Per sapere l'ordine di accesso ai dati ho stampato a video "data" da apiservice

        //stampo tempo mancante -> passare come parametri gli incrementi che ha già settati nel campo timer
        this.mappingIncrement(this.sondaggio['0'].timer);

        var auxData = []; //var ausialiaria per parsare la data di creazione
        auxData['0'] = (this.sondaggio['0'].dataeora.substring(0, 10).split("-")[0]); //anno
        auxData['1'] = this.sondaggio['0'].dataeora.substring(0, 10).split("-")[1]; //mese [0]=gennaio
        auxData['2'] = this.sondaggio['0'].dataeora.substring(0, 10).split("-")[2]; //gg
        auxData['3'] = this.sondaggio['0'].dataeora.substring(11, 18).split(":")[0]; //hh
        auxData['4'] = this.sondaggio['0'].dataeora.substring(11, 18).split(":")[1]; //mm
        //metto dati parsati nella var dataCreazioneToview così da creare una nuova var da poter stampare nel formato adatto
        var dataCreazioneToView = new Date(auxData['0'], parseInt(auxData['1'], 10) - 1, auxData['2'], auxData['3'], auxData['4']);
        //stampo la var appena creata nell'elemento con id="dataOraCreazione"
        document.getElementById("dataOraCreazione").innerHTML = dataCreazioneToView.toLocaleString(); */
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );



  }

  visualizzaScelte() {

    this.apiService.getScelteSondaggio(this.codice_sondaggio).then(
      (scelte) => {
      
        console.log('Visualizzato con successo');

        this.scelte = scelte['Scelte']['data'];
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );

  }

  cancellaSondaggio() {

    this.apiService.rimuoviSondaggio(this.codice_sondaggio).then(
      (scelte) => {
      
        console.log('Eliminato con successo');

        this.scelte = scelte['Scelte']['data'];
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    );

  }

}





