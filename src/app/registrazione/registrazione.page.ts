import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from 'src/app/providers/api.service';
import { AlertController } from '@ionic/angular';
import { PickerController } from "@ionic/angular";
import { DataService } from "../services/data.service";
import { Storage } from '@ionic/storage';

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


  constructor(private storage: Storage,private dataService: DataService, public apiService: ApiService, public alertController: AlertController, private pickerController: PickerController, private router: Router) { }
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
  
  clickstorage(){
    this.storage.set('utente',this.username);
    this.storage.set('session', true);
    this.storage.set('session', true);

    setTimeout(() => {
      this.storage.get('session').then(data => {
        console.log('SESSION:' + data)
      });

      this.storage.get('utente').then(data => {
        this.dataService.emailUtente = data.email;
    });

    }, 3000);

    this.storage.get('session').then(data => {
        this.storage.set('session', true);
        console.log('SESSION:' + data)
    });
    this.router.navigate(['home']);
  }

  clickRegistrazione() {
    this.dataService.setUtente(this.email, this.username, this.password, this.nome, this.cognome, this.bio);
    this.router.navigate(['scegli-avatar']);
    console.log(this.dataService.utente);

  }
  login() {
    this.router.navigate(['login']);
  }
  termini() {
    this.router.navigate(['termini']);
  }
}
