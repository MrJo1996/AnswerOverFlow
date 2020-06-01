import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from 'src/app/providers/api.service';
import { AlertController } from '@ionic/angular';
import { PickerController } from "@ionic/angular";
import { DataService } from "../services/data.service";

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.page.html',
  styleUrls: ['./registrazione.page.scss'],
})
export class RegistrazionePage implements OnInit {
  nome = '';
  cognome = '';
  email = '';
  username = '';
  password = '';
  bio = '';
  confermapassword;
  id;
  utente = {};
  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/registrazione'


  constructor(private dataService: DataService, public apiService: ApiService, public alertController: AlertController, private pickerController: PickerController, private router: Router) { }
  ngOnInit() {
    //disable scroll (anche su ios)
    var fixed = document.getElementById('fixed');

    fixed.addEventListener('touchmove', function (e) {

      e.preventDefault();

    }, false);
  }
  async checkFields() {
    if ((this.nome.length < 1) || (this.cognome.length < 1) || (this.email.length < 1) || (this.username.length < 1)) {
      const alert = await this.alertController.create({
        header: 'Compilare tutti i campi contrassegnati da *',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }
        ]
      });
      await alert.present();
    }
    else
    if(this.nome.length > 19){
      const alert = await this.alertController.create({
        header: 'Nome troppo lungo (Max 20 caratteri)',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }
        ]
      });
      await alert.present();
    }else
    if(this.cognome.length > 19){
      const alert = await this.alertController.create({
        header: 'Cognome troppo lungo (Max 20 caratteri)',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }
        ]
      });
      await alert.present();
    }else
    if(this.username.length > 19){
      const alert = await this.alertController.create({
        header: 'Username troppo lungo (Max 20 caratteri)',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }
        ]
      });
      await alert.present();
    }else
      if (this.password.length < 8) {
        const alert = await this.alertController.create({
          header: 'Password troppo corta. Utilizzare una password con almeno 8 caratteri',
          buttons: [
            {
              text: 'Ok',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                console.log('Confirm Cancel: blah');
              }
            }
          ]
        });
        await alert.present();
      }
      else
        if (this.password != this.confermapassword) {
          const alert = await this.alertController.create({
            header: 'Le password non coincidono',
            buttons: [
              {
                text: 'Ok',
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {
                  console.log('Confirm Cancel: blah');
                }
              }
            ]
          });
          await alert.present();
        }
        else {
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
  }


  clickRegistrazione() {
    this.dataService.setUtente(this.email, this.username, this.password, this.nome, this.cognome, this.bio);
    this.router.navigate(['bio']);
    console.log(this.dataService.utente);

  }
  login() {
    this.router.navigate(['login']);
  }
  termini() {
    this.router.navigate(['termini']);
  }
}
