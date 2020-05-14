import { Component, OnInit } from '@angular/core';
import { PostServiceService } from "../services/post-service.service";
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../providers/api.service';

@Component({
  selector: 'app-proponi-categoria',
  templateUrl: './proponi-categoria.page.html',
  styleUrls: ['./proponi-categoria.page.scss'],
})
export class ProponiCategoriaPage implements OnInit {

  selezione = '';
  proposta =  '';
  request: Promise<any>;
  result: Promise<any>;

  constructor(public apiService: ApiService, private service: PostServiceService, public alertController: AlertController, private router: Router) { }

  ngOnInit() {
  }

  italian_bad_words_check(input: string){
    let list = require('italian-badwords-list');
    let array = list.array;
    return array.includes(input);
  }

  english_bad_words_check(input: string){
    var Filter = require('bad-words'),
    filter = new Filter();

    filter.addWords('cazzi');
    
    return filter.isProfane(input);
  }

  async bad_words_alert(){
    const alert = await this.alertController.create({
      header: 'ATTENZIONE!',
      subHeader: 'Hai inserito una o più parole non consentite. Rimuoverle per andare avanti',
      buttons: ['OK']
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  async max_lenght_exceeded_alert(){
    const alert = await this.alertController.create({
      header: 'ATTENZIONE!',
      subHeader: 'Il nome inserito per la nuova categoria o sottocategoria è troppo lungo. Inserire una nuova proposta',
      buttons: ['OK']
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  post_invio(){
    if(this.proposta.length > 15){
      this.max_lenght_exceeded_alert();
    } else{
      if((!this.english_bad_words_check(this.proposta)) && (!this.italian_bad_words_check(this.proposta))){
        this.apiService.proponi_categoria(this.selezione, this.proposta).then(
          (result)=>{
            console.log("Proposta inviata con successo")
          }, (rej)=>{
            console.log("Invio proposta non riuscito")
          }
        );
      } else{
        this.bad_words_alert();
      }
    }
  }
}