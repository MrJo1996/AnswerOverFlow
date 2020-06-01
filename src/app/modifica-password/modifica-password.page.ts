import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';
import {NavController} from "@ionic/angular";
import { Router } from "@angular/router";

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

  constructor(public alertController: AlertController,public apiService: ApiService, private pickerController: PickerController, private navCtrl: NavController,private router: Router) { }


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



  ngOnInit() {

    this.email = ''
    this.password = ''
  }

  is_email_valid(email: string){
    var format: RegExp;

    format = /^([a-zA-z0-9_.\-/])+\@([a-zA-z0-9_.\-/])+\.([a-zA-Z]{2,4})$/;
    if(!format.test(email)){
      return false;
    }
    return true;
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
    }else if (this.password.length > 14){
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
      
      this.apiService.modificaPassword(this.password, this.email).then(
      (result) => { // nel caso in cui va a buon fine la chiama
      

      },
      (rej) => {// nel caso non vada a buon fine la chiamata
        console.log('Modifica effetutata', this.password, this.email); //anche se va nel rej va bene, modifiche effettive nel db

      }
    );

  }

}

goback(){
  this.router.navigate(['modifica-profilo']);
}

}