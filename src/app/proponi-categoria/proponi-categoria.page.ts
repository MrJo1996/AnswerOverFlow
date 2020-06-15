import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, MenuController } from '@ionic/angular';
import { ApiService } from '../providers/api.service';
import { DataService } from '../services/data.service';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-proponi-categoria',
  templateUrl: './proponi-categoria.page.html',
  styleUrls: ['./proponi-categoria.page.scss'],
})
export class ProponiCategoriaPage implements OnInit{
  proposta =  '';
  cod_utente = '';
  request: Promise<any>;
  result: Promise<any>;

  constructor(private menuCtrl: MenuController, public apiService: ApiService, private storage: Storage, public alertController: AlertController, private router: Router, private navCtrl: NavController, private dataService: DataService) {}

  ngOnInit(){
    //Richiamo dei dati dell'utente loggato dallo storage
    this.storage.get('utente').then(
      (data)=>{
        this.cod_utente = data.email
      });
    }

  italian_bad_words_check(input: string){//controllo parole scorrette dal dizionario italiano
    var check: boolean;
    
    let list = require('italian-badwords-list');
    let array = list.array;
    let stringArray = [];
    let stringPassed = input.split(' ');
    stringArray = stringArray.concat(stringPassed);

    stringArray.forEach(element =>{
      if (array.includes(element)){
        check = true;
      }
    });
    return check;
  }

  english_bad_words_check(input: string){//controllo parole scorrette dal dizionario inglese
    var Filter = require('bad-words'),
    filter = new Filter();
    
    return filter.isProfane(input);
  }

  bad_words_toast(){//Alert di errore per inserimento parola scorretta
    const toast = document.createElement('ion-toast');
    toast.message = 'Hai inserito una o più parole non consentite!';
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.color = 'danger';
    toast.style.textAlign = 'center';
    
    document.body.appendChild(toast);
    return toast.present();    
  }

  max_lenght_exceeded_toast(){//Alert di errore per inserimento proposta troppo lunga
    const toast = document.createElement('ion-toast');
    toast.message = 'Il nome inserito per la nuova categoria è troppo lungo!';
    toast.duration = 2000;
    toast.position = "top";
    toast.style.fontSize = '20px';
    toast.color = 'danger';
    toast.style.textAlign = 'center';
    
    document.body.appendChild(toast);
    return toast.present();
  }

  post_invio(){//Invio dei dati al backend
    if(this.proposta.length>20){
      this.max_lenght_exceeded_toast();
    } else{
      if((!this.english_bad_words_check(this.proposta)) && (!this.italian_bad_words_check(this.proposta))){
        this.apiService.proponi_categoria(this.proposta);
        this.goToConfirm();
      } else{
        this.bad_words_toast();
      }
    }
  }

  goToConfirm(){//Reindirizzamento alla pagina di conferma dei dati inseriti e dell'invio mail
    this.dataService.setNuovaProposta(this.proposta);
    this.router.navigate(['conferma-invio-proposta']);
  }

  goback(){//Reindirizzamento alla pagina precedente
    this.navCtrl.back();
  }

  openMenu(){//Funzione per l'apertura del menu laterale
    this.menuCtrl.open();
  }
}