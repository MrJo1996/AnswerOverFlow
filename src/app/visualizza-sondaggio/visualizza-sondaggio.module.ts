import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizzaSondaggioPageRoutingModule } from './visualizza-sondaggio-routing.module';

import { VisualizzaSondaggioPage } from './visualizza-sondaggio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizzaSondaggioPageRoutingModule
  ],
  declarations: [VisualizzaSondaggioPage]
})
export class VisualizzaSondaggioPageModule {}
