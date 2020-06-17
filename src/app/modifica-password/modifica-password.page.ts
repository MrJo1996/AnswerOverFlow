import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController} from '@ionic/angular';
import {NavController} from "@ionic/angular";
import { ApiService } from 'src/app/providers/api.service';
import { DataService } from "../services/data.service";

@Component({
  selector: 'app-modifica-password',
  templateUrl: './modifica-password.page.html',
  styleUrls: ['./modifica-password.page.scss'],
})

export class ModificaPasswordPage implements OnInit {

  constructor(
    public alertController: AlertController,
    public apiService: ApiService, 
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private dataService: DataService
    ) { 
      this.userId = this.dataService.getEmail_Utente();
    }

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
          }
        }, {
          text: "Conferma",
          handler: () => {
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
     }
    else if (this.password.length > 100){
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
      (result) => { 
      
      },
      (rej) => {
    
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
          this.dataService.loadingView(1000);
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