import { Component, OnInit } from '@angular/core';
import { Promise } from "q";
import { PostServiceService } from "../services/post-service.service";
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-recupera-password',
  templateUrl: './recupera-password.page.html',
  styleUrls: ['./recupera-password.page.scss'],
})

export class RecuperaPasswordPage implements OnInit{

  email = '';
  request: Promise<any>;
  result: Promise<any>;
  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/recupero'

  constructor(private service: PostServiceService, private router: Router, private menuCtrl: MenuController){}

  ngOnInit(){
    this.menuCtrl.enable(false);//disabilita menu laterale
    
    //disabilita scroll (anche su ios)
    var fixed = document.getElementById('fixed');
    fixed.addEventListener('touchmove', function (e){
      e.preventDefault();
    }, false);
  }

  is_email_valid(input_email: string){//Funzione per il controllo del formato della mail (esempio@mail.it)
    var email_format: RegExp;

    email_format = /^([a-zA-z0-9_.\-/])+\@([a-zA-z0-9_.\-/])+\.([a-zA-Z]{2,4})$/;
    if (!email_format.test(input_email)){
      return false;
    }
    return true;
  }

  email_length_exceeded_toast(){//Alert di errore per inserimento email troppo lunga
    const toast = document.createElement('ion-toast');
    toast.message = 'La mail inserita è troppo lunga!';
    toast.duration = 2000;
    toast.position = "middle";
    toast.style.fontSize = '20px';
    toast.color = 'danger';
    toast.style.textAlign = 'center';
    
    document.body.appendChild(toast);
    return toast.present();
  }

  post_invio(){//Invio dei dati al backend
    if (this.email.length > 100){
      this.email_length_exceeded_toast();
    } else{
      let postData={
        "email": this.email
      };
      this.result = this.service.postService(postData, this.url).then(
        (data)=>{
          this.request = data;
        });
      this.goToConfirm();
    }
  }

  goback(){//funzione di reindirizzamento alla pagina precedente
    this.router.navigate(['login']);
  }

  goToConfirm(){//funzione di reindirizzamento alla pagina di conferma 
    this.router.navigate(['conferma-recupero']);
  }
}
