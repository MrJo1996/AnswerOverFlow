import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';
import { DataService } from "../services/data.service";

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  index_modifica;
  constructor(private dataService: DataService,private popoverCtrl: PopoverController) { }

  ngOnInit(){
    this.index_modifica=this.dataService.popover_modifica;
  }

  onClick(valor: number){
    console.log('item',valor);
    this.popoverCtrl.dismiss(
      {
        item: valor
      }
    );
  }
}
