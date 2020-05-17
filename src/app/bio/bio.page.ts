import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from 'src/app/providers/api.service';
import { AlertController } from '@ionic/angular';
import { PickerController } from "@ionic/angular";
import { DataService } from "../services/data.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-bio',
  templateUrl: './bio.page.html',
  styleUrls: ['./bio.page.scss'],
})
export class BioPage implements OnInit {
  bio;
  utente = {};
  constructor(private navCtrl:NavController,private dataService: DataService,public apiService: ApiService, public alertController: AlertController, private pickerController: PickerController, private router: Router) { }
  ngOnInit() {
    this.utente = this.dataService.utente;
  }
  buttonClick(){
    this.clickRegistrazione();
  }
  clickRegistrazione(){
    this.dataService.setUtente( this.utente['0'],this.utente['1'],this.utente['2'],this.utente['3'],this.utente['4'],this.bio);
    console.log(this.dataService.utente);
    this.dataService.setEmail_utente(this.utente['0']);
    this.postRegistrazione();
  }
  async postRegistrazione() {
    this.utente=this.dataService.utente;
    this.apiService.registrazione(this.utente['0'],this.utente['1'],this.utente['2'],this.utente['3'],this.utente['4'],this.utente['5']).then(
      (result) => {
        console.log('Inserimento avvenuto con successo:', this.utente['0'],this.utente['1'],this.utente['2'],this.utente['3'],this.utente['4'],this.utente['5']);
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
