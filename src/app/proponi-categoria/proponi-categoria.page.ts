import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { ApiService } from '../providers/api.service';
import { DataService } from '../services/data.service';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-proponi-categoria',
  templateUrl: './proponi-categoria.page.html',
  styleUrls: ['./proponi-categoria.page.scss'],
})
export class ProponiCategoriaPage implements OnInit {

  selezione = '';
  proposta =  '';
  cod_utente;
  request: Promise<any>;
  result: Promise<any>;

  constructor(public apiService: ApiService, private storage: Storage, public alertController: AlertController, private router: Router, private navCtrl: NavController, private dataService: DataService) { }

  ngOnInit() {
    this.storage.get('utente').then(
      (data)=>{
        this.cod_utente = data.email
      });
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

  bad_words_toast(){
    const toast = document.createElement('ion-toast');
    toast.message = 'Hai inserito una o più parole non consentite!';
    toast.duration = 2000;
    toast.position = "middle";
    toast.style.fontSize = '20px';
    toast.color = 'danger';
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
    return toast.present();    
  }

  max_lenght_exceeded_toast(){
    const toast = document.createElement('ion-toast');
    toast.message = 'Il nome inserito per la nuova categoria o sottocategoria è troppo lungo!';
    toast.duration = 2000;
    toast.position = "middle";
    toast.style.fontSize = '20px';
    toast.color = 'danger';
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
    return toast.present();
  }

  post_invio(){
    if(this.proposta.length>20){
      this.max_lenght_exceeded_toast();
    } else{
      if((!this.english_bad_words_check(this.proposta)) && (!this.italian_bad_words_check(this.proposta))){
        this.apiService.proponi_categoria(this.selezione, this.proposta).then(
          (result)=>{
            console.log("Proposta inviata con successo")
          }, (rej)=>{
            console.log("Invio proposta non riuscito")
          }
        );
        this.goToConfirm();
      } else{
        this.bad_words_toast();
      }
    }
  }

  goToConfirm(){
    this.dataService.setSelezioneCategoria(this.selezione);
    this.dataService.setNuovaProposta(this.proposta);
    this.router.navigate(['conferma-invio-proposta']);
  }

  goback(){
    this.navCtrl.back();
  }
}