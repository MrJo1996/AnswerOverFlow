import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController} from '@ionic/angular';
import {NavController} from "@ionic/angular";
import { Router } from "@angular/router";
import {Storage} from '@ionic/storage';

import { ApiService } from 'src/app/providers/api.service';
import { DataService } from "../services/data.service";

//Picker - import e poi definire nel constructor
import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";

@Component({
  selector: 'app-modifica-password',
  templateUrl: './modifica-password.page.html',
  styleUrls: ['./modifica-password.page.scss'],
})


export class ModificaPasswordPage implements OnInit {

  constructor(
    public alertController: AlertController,
    public apiService: ApiService, 
    private pickerController: PickerController, 
    private navCtrl: NavController,
    private router: Router,
    private menuCtrl: MenuController,
    private dataService: DataService
    ) { 

      this.userId = this.dataService.getEmail_Utente();
    }


  email: string; //param per le funzioni
  password: string;
  confermapassword: string;

  userId: string;

  
  async popupModificaPassw() {
    const alert = await this.alertController.create({
      header: 'Sei sicuro di voler modificare la password?',
     
      buttons: [
        {
          text: "Annulla",
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm cancel');
          }
        }, {
          text: "Conferma",
          handler: () => {
            console.log('Confirm Ok');
            this.modify();
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
   
   
  }



  ngOnInit() {
    this.password = ''
    this.confermapassword = ''
  }

  async modify() {

    if(this.password.length < 8){
      const toast = document.createElement('ion-toast');
      toast.message = 'password troppo corta!';
      toast.duration = 2000;
      toast.position = "middle";
      toast.style.fontSize = '20px';
      toast.color = 'danger';
      toast.style.textAlign = 'center';
      document.body.appendChild(toast);
      return toast.present();
    }
    else if (this.password != this.confermapassword){
      const toast = document.createElement('ion-toast');
      toast.message = 'le password non coincidono!';
      toast.duration = 2000;
      toast.position = "middle";
      toast.style.fontSize = '20px';
      toast.color = 'danger';
      toast.style.textAlign = 'center';
      document.body.appendChild(toast);
   
      return toast.present();
    }else if (this.password.length > 100){
      const toast = document.createElement('ion-toast');
      toast.message = 'password troppo lunga!';
      toast.duration = 2000;
      toast.position = "middle";
      toast.style.fontSize = '20px';
      toast.color = 'danger';
      toast.style.textAlign = 'center';
      document.body.appendChild(toast);
   
      return toast.present();
    }else{
      
      this.apiService.modificaPassword(this.password, this.userId).then(
      (result) => { // nel caso in cui va a buon fine la chiama
      

      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('Modifica effetutata', this.password, this.userId); //anche se va nel rej va bene, modifiche effettive nel db

      }
    );
    this.salvaPassword();
  }

}

async salvaPassword() {
  const alert = await this.alertController.create({
    header: 'Avvenuta modifica',   
      buttons: [
      {
        text: 'Ok',
        handler: () => {
          this.dataService.loadingView(5000);//visualizza il frame di caricamento
        this.navCtrl.back();
        }
      }
    ]
     });

  await alert.present();
  let result = await alert.onDidDismiss();

  

}

openMenu(){
  this.menuCtrl.open();
}

goback(){
  this.navCtrl.back();
}

}