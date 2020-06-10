import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from 'src/app/providers/api.service';
import { AlertController } from '@ionic/angular';
import { PickerController } from "@ionic/angular";
import { DataService } from "../services/data.service";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-bio',
  templateUrl: './bio.page.html',
  styleUrls: ['./bio.page.scss'],
})
export class BioPage implements OnInit {
  bio;
  utente = {};
  constructor(private navCtrl: NavController, 
    private storage: Storage, 
    private dataService: DataService, 
    public apiService: ApiService, 
    public alertController: AlertController, 
    private pickerController: PickerController, 
    private router: Router) { }
  ngOnInit() {
    this.utente = this.dataService.utente;
  }

  ionViewWillLeave() {
    this.storage.get("utente").then((data) => {
      console.log("SESSION:" + data);
    });
  }

  async buttonClick() {
    const alert = await this.alertController.create({
      header: 'Confermi i dati?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            console.log('Confirm Okay');
            this.clickRegistrazione();
          }
        }
      ]
    });
    await alert.present();
  }
  async buttonsaltaClick() {
    const alert = await this.alertController.create({
      header: 'Sicuro di voler saltare?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            console.log('Confirm Okay');
            this.postRegistrazione();
          }
        }
      ]
    });
    await alert.present();
  }
  clickRegistrazione() {
    this.dataService.setUtente(this.utente['0'], this.utente['1'], this.utente['2'], this.utente['3'], this.utente['4'], this.bio);
    console.log(this.dataService.utente);
    this.dataService.setEmail_Utente(this.utente['0']);
    this.postRegistrazione();
  }

  renameKey(obj, old_key, new_key) {    
    // check if old key = new key   
        if (old_key !== new_key) {                   
           Object.defineProperty(obj, new_key, // modify old key 
                                // fetch description from object 
           Object.getOwnPropertyDescriptor(obj, old_key)); 
           delete obj[old_key];                // delete old key 
           } 
    } 

  async postRegistrazione() {
    this.utente = this.dataService.utente;
    console.log(this.utente)
    this.apiService.registrazione(this.utente['0'], this.utente['1'], this.utente['2'], this.utente['3'], this.utente['4'], this.utente['5'], this.utente['6']).then(
      (result) => {
        console.log('Inserimento avvenuto con successo:', this.utente['0'], this.utente['1'], this.utente['2'], this.utente['3'], this.utente['4'], this.utente['5']
          , this.utente['6']);
        this.dataService.setUsername(this.utente['1']);
        this.dataService.setNome(this.utente['3']);
        this.dataService.setCognome(this.utente['4']);
        this.dataService.setAvatarUtente(this.utente['6']);

        //Formatto i valori da inserire nello storage
        this.renameKey(this.utente, '0', "email")
        this.renameKey(this.utente, '1', "username")
        this.renameKey(this.utente, '3', "nome")
        this.renameKey(this.utente, '4', "cognome")
        this.renameKey(this.utente, '6', "avatar")
        delete this.utente['2']
        console.log(this.utente)

        //Inserisco i valori che servono
        this.storage.set("utente", this.utente);
        this.storage.set("session", true);

        
      setTimeout(() => {
        this.storage.get("session").then((data) => {
          console.log("SESSION:" + data);
        });

        this.storage.get("utente").then((data) => {
          this.dataService.emailUtente = data.email;
        });
      }, 1000);
        this.router.navigate(['/benvenuto']);
      },
      (rej) => {
        console.log('Inserimento non riuscito!');
      }
    );
  }
  goback() {
    this.navCtrl.pop();
  }
}
