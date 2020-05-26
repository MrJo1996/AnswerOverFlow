import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {


  constructor(private router: Router, public navCtrl: NavController,) { }

  ngOnInit() {
  }


  goback(){
    this.router.navigate(['home']);
  }

}

