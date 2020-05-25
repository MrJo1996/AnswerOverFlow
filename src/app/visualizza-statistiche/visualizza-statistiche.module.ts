import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { VisualizzaStatistichePageRoutingModule } from './visualizza-statistiche-routing.module';

import { VisualizzaStatistichePage } from './visualizza-statistiche.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizzaStatistichePageRoutingModule
  ],
  declarations: [VisualizzaStatistichePage]
})
export class VisualizzaStatistichePageModule {}
