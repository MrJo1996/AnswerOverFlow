import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NavController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {


  constructor(private router: Router, private menuCtrl: MenuController) { }

  ngOnInit() {
  }


  goback(){
    this.router.navigate(['home']);
  }

  openMenu(){
    this.menuCtrl.open();
  }

}

