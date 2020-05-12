import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from 'src/app/providers/api.service';
import { AlertController } from '@ionic/angular';
import { PickerController } from "@ionic/angular";
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
  bio;
  confermapassword;
  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/registrazione'


  constructor(public apiService: ApiService, public alertController: AlertController, private pickerController: PickerController, private router: Router) { }
  ngOnInit() {

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
                  this.postRegistrazione();
                }
              }
            ]
          });
          await alert.present();
        }
  }

  async postRegistrazione() {
    this.apiService.registrazione(this.email, this.username, this.password, this.nome, this.cognome, this.bio).then(
      (result) => {
        console.log('Inserimento avvenuto con successo:', this.email, this.username, this.password, this.nome, this.cognome, this.bio);
        this.benvenuto();
      },
      (rej) => {
        console.log('Inserimento non riuscito!');
      }
    );
  }
  login() {
    this.router.navigate(['login']);
  }
  termini() {
    this.router.navigate(['termini']);
  }
  benvenuto() {
    this.router.navigate(['benvenuto']);
  }
}
