import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizzaProfiloPageRoutingModule } from './visualizza-profilo-routing.module';

import { VisualizzaProfiloPage } from './visualizza-profilo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizzaProfiloPageRoutingModule
  ],
  declarations: [VisualizzaProfiloPage]
})
export class VisualizzaProfiloPageModule {}
