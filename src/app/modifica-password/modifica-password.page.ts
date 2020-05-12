import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';

import { ApiService } from 'src/app/providers/api.service';

//Picker - import e poi definire nel constructor
import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";

@Component({
  selector: 'app-modifica-password',
  templateUrl: './modifica-password.page.html',
  styleUrls: ['./modifica-password.page.scss'],
})


export class ModificaPasswordPage implements OnInit {

  constructor(public alertController: AlertController,public apiService: ApiService, private pickerController: PickerController) { }


  email: string; //param per le funzioni
  password: string;
  confermapassword: string;

  
  async popupModificaPassw() {
    const alert = await this.alertController.create({
      header: 'Sei sicuro di voler modificare la password?',
     
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
   
    this.modify();
  }


  goback(){}



  ngOnInit() {

    this.email = 'proviamo la mail'
    this.password = 'password'
  }

  async modify() {

    if(this.password.length < 8){
      alert('password troppo corta')
    }
    else if (this.password != this.confermapassword){
      alert('password non coincidono');
    }else{
      
      this.apiService.modificaPassword(this.password, this.email).then(
      (result) => { // nel caso in cui va a buon fine la chiama
      

      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('Modifica effetutata', this.password, this.email); //anche se va nel rej va bene, modifiche effettive nel db

      }
    );

  }

}

}
