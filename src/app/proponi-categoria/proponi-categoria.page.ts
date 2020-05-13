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
  bad_words = new Array (/fancul/i, /cazz/i, /zoccol/i, /stronz/i, /bastard/i, /coglion/i, /puttan/i);

  constructor(public apiService: ApiService, private service: PostServiceService, public alertController: AlertController, private router: Router) { }

  ngOnInit() {
  }

  controllo_parole(){
    var i: number;
    var cod: number;
    var array_length: number;

    array_length = this.bad_words.length;

    for(i=0;i<array_length;i++){
      cod = this.proposta.search(this.bad_words[i]);
      if(cod>=0){
        return true;
      }
    }
    return false;
  }

  async post_invio(){
    if(this.proposta.length>15){
      const alert = await this.alertController.create({
        header: "Il nome inserito per la nuova categoria o sottocategoria è troppo lungo!",
        buttons:[
          {
            text: 'OK',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah)=>{
              console.log('Confirm cancel: blah');
            }
          }
        ]
      });
      await alert.present();
    } else{
      if(this.controllo_parole()==false){
        this.apiService.proponi_categoria(this.selezione, this.proposta).then(
          (result)=>{
            console.log("Proposta inviata con successo")
          },
          (rej)=>{
            console.log("Invio proposta non riuscito")
          }
        );
      } else{
        const alert = await this.alertController.create({
          header: "Hai inserito una o più parole non consentite! Rimuoverle per andare avanti",
          buttons:[
            {
              text: 'OK',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah)=>{
                console.log('Confirm cancel: blah');
              }
            }
          ]
        });
        await alert.present();
      }
    }
  }
}