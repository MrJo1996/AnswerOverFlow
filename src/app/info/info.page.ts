import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MenuController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {


  constructor(private router: Router, private menuCtrl: MenuController, private dataService: DataService) { }

  ngOnInit() {
  }


  goback(){
    this.dataService.loadingView(5000);//visualizza il frame di caricamento
    this.router.navigate(['home']);
  }

  openMenu(){
    this.menuCtrl.open();
  }

}

