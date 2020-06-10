import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from 'src/app/providers/api.service';
import { AlertController } from '@ionic/angular';
import { PickerController } from "@ionic/angular";
import { DataService } from "../services/data.service";
import { Storage } from '@ionic/storage';
import { PostServiceService } from '../services/post-service.service';

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
  url = 
  'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/registrazione'
  urlControlloEmail = 
  "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/controlloEmail"

  emailAvailable: boolean;


  constructor(private storage: Storage,
    private dataService: DataService, 
    public apiService: ApiService, 
    public alertController: AlertController, 
    private pickerController: PickerController, 
    private servicePost: PostServiceService,
    private router: Router) { }
  ngOnInit() {
    //disable scroll (anche su ios)
    var fixed = document.getElementById('fixed');

    fixed.addEventListener('touchmove', function (e) {

      e.preventDefault();

    }, false);
  }

  checkForEmail(emailInserita){
    console.log(emailInserita)
    let postData = {
      email: emailInserita,
    };

    this.servicePost.postService(postData, this.urlControlloEmail).then(
      (data) => {
        console.log(data)
        if(data['data'] == false){
          this.emailAvailable = true;
        console.log(this.emailAvailable)
        } else {
          this.emailAvailable = false;
          console.log(this.emailAvailable)
        }
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  checkForUser(usernameInserito){
    console.log(usernameInserito)
  }

  async checkFields() {
    if ((this.nome.length < 1) || (this.cognome.length < 1) || (this.email.length < 1) || (this.username.length < 1)) {
      
      const toast = document.createElement("ion-toast");

      toast.message = "Compilare tutti i campi contrassegnati da *!";
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = "20px";
      toast.color = "danger";
      toast.style.textAlign = "center";

      document.body.appendChild(toast);
      return toast.present();
    }
    else
    if(this.nome.length > 19){
      
      const toast = document.createElement("ion-toast");

      toast.message = "Nome troppo lungo";
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = "20px";
      toast.color = "danger";
      toast.style.textAlign = "center";

      document.body.appendChild(toast);
      return toast.present();
    }else
    if(this.cognome.length > 19){
      
      const toast = document.createElement("ion-toast");

      toast.message = "Cognome troppo lungo!";
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = "20px";
      toast.color = "danger";
      toast.style.textAlign = "center";

      document.body.appendChild(toast);
      return toast.present();;
    }else
    if(this.username.length > 19){
      
      const toast = document.createElement("ion-toast");

      toast.message = "Username troppo lungo!";
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = "20px";
      toast.color = "danger";
      toast.style.textAlign = "center";

      document.body.appendChild(toast);
      return toast.present();
    }else
      if (this.password.length < 8) {
        
      const toast = document.createElement("ion-toast");

      toast.message = "Password troppo corta. Utilizzare una password con almeno 8 caratteri";
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = "20px";
      toast.color = "danger";
      toast.style.textAlign = "center";

      document.body.appendChild(toast);
      return toast.present();
      } else 
      if (!this.emailAvailable) {
        
        const toast = document.createElement("ion-toast");
  
        toast.message = "Email già registrata, ritenta con la login";
        toast.duration = 2000;
        toast.position = "top";
        toast.style.fontSize = "20px";
        toast.color = "danger";
        toast.style.textAlign = "center";
  
        document.body.appendChild(toast);
        return toast.present();
        }
      else
        if (this.password != this.confermapassword) {
      const toast = document.createElement("ion-toast");

      toast.message = "'Le password non coincidono!";
      toast.duration = 2000;
      toast.position = "top";
      toast.style.fontSize = "20px";
      toast.color = "danger";
      toast.style.textAlign = "center";

      document.body.appendChild(toast);
      return toast.present();
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
