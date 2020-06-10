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

export class RecuperaPasswordPage implements OnInit {

  email = '';
  request: Promise<any>;
  result: Promise<any>;
  url = 'http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/recupero'

  constructor(private service: PostServiceService, private router: Router, private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(false);
    //disable scroll (anche su ios)
    var fixed = document.getElementById('fixed');

    fixed.addEventListener('touchmove', function (e) {

      e.preventDefault();

    }, false);
  }

  is_email_valid(email: string) {
    var format: RegExp;

    format = /^([a-zA-z0-9_.\-/])+\@([a-zA-z0-9_.\-/])+\.([a-zA-Z]{2,4})$/;
    if (!format.test(email)) {
      return false;
    }
    return true;
  }

  email_length_toast() {
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

  post_invio() {
    if (this.email.length > 100) {
      this.email_length_toast();
    } else {
      let postData = {
        "email": this.email
      };
      this.result = this.service.postService(postData, this.url).then(
        (data) => {
          this.request = data;
          console.log(data);
        }, (err) => {
          console.log(err.message);
        });
      this.goToConfirm();
    }
  }

  goback() {
    this.router.navigate(['login']);
  }

  goToConfirm() {
    this.router.navigate(['conferma-recupero']);
  }
}
