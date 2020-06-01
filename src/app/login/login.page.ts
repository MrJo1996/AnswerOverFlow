import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";

import { Promise } from "q";
import { Storage } from '@ionic/storage';
import { PostServiceService } from "../services/post-service.service";
import { NavController } from "@ionic/angular";
import { DataService } from "../services/data.service";
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  click = false;
  email = '';
  username = "";
  password = "";
  nome = '';
  cognome = '';
  bio = '';

  request: Promise<any>;
  result: Promise<any>;
  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/login'

  constructor(public apiService: ApiService, public toastController: ToastController, private dataService: DataService, private service: PostServiceService, private router: Router, private navctrl: NavController, private storage: Storage) {

  }

  ngOnInit() {
    //disable scroll (anche su ios)
    var fixed = document.getElementById('fixed');

    fixed.addEventListener('touchmove', function (e) {

      e.preventDefault();

    }, false);
  }

  public reg() {
    this.router.navigate(['registrazione']);
  }


  postLogin() {
    if (this.password.length < 8) {
      const toast = document.createElement('ion-toast');
      toast.message = 'password troppo corta o non valida!';
      toast.duration = 2000;
      toast.position = "middle";
      toast.style.fontSize = '20px';
      toast.color = 'danger';
      toast.style.textAlign = 'center';
      document.body.appendChild(toast);
      return toast.present();
    } else {
      let postData = {
        "username": this.username,
        "password": this.password
      };

      this.result = this.service.postService(postData, this.url).then((data) => {
        this.request = data;
        console.log(data);

        this.checkField(data);
        this.clickLogin(!data.error, data);




      }, err => {
        console.log(err.message);

      })
    }
  }

  italian_bad_words_check(input: string) {
    let list = require('italian-badwords-list');
    let array = list.array;
    return array.includes(input);
  }

  checkField(data) {
    if ((this.italian_bad_words_check(this.username) || this.italian_bad_words_check(this.password))) {
      const toast = document.createElement('ion-toast');

      toast.message = 'Hai inserito una parola scorretta!';
      toast.duration = 2000;
      toast.position = "middle";
      toast.style.fontSize = '20px';
      toast.color = 'danger';
      toast.style.textAlign = 'center';

      document.body.appendChild(toast);
      return toast.present();

    }
    else if (this.username.length < 1 || this.password.length < 8) {
      const toast = document.createElement('ion-toast');
      toast.message = 'Devi inserire un username valido!';
      toast.duration = 2000;
      toast.position = "middle";
      toast.style.fontSize = '20px';
      toast.color = 'danger';
      toast.style.textAlign = 'center';
      document.body.appendChild(toast);
      return toast.present();


    } else if (data.error == (true)) {

      const toast = document.createElement('ion-toast');
      toast.message = 'Credenziali errate!';
      toast.duration = 2000;
      toast.position = "middle";
      toast.style.fontSize = '20px';
      toast.color = 'danger';
      toast.style.textAlign = 'center';
      document.body.appendChild(toast);
      return toast.present();


    }
  }

  clickLogin(condizione, data) {

    if (condizione) {

      this.storage.set('utente', data.data[0]);
      this.storage.set('session', true);
      console.log('false', data);
      this.click = true;

      this.storage.set('session', true);

      setTimeout(() => {
        this.storage.get('session').then(data => {
          console.log('SESSION:' + data)
        });
      }, 3000);

      this.storage.get('session').then(data => {
          this.storage.set('session', true);
          console.log('SESSION:' + data)
      });
      this.router.navigate(['home']);
    } else {
      console.log('error');




      /* this.dataService.setUtente(this.email, this.username, this.password, this.nome, this.cognome,this.bio);
       this.router.navigate(['home']);
       console.log(this.dataService.utente);*/

    }

  }


}



