import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';
@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {}
  onClick(valor: number){
    console.log('item',valor);
    this.popoverCtrl.dismiss(
      {
        item: valor
      }
    );
  }
}
