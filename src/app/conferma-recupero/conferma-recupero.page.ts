import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-conferma-recupero',
  templateUrl: './conferma-recupero.page.html',
  styleUrls: ['./conferma-recupero.page.scss'],
})
export class ConfermaRecuperoPage implements OnInit {

  constructor(private router: Router, private menuCtrl: MenuController) { }

  ngOnInit() {
  }

  goback(){
    this.router.navigate(['recupera-password'])
  }

  goTo_login(){
    this.router.navigate(['login']);
  }
}
