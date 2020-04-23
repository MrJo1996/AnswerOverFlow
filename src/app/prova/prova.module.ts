import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PROVAPageRoutingModule } from './prova-routing.module';

import { PROVAPage } from './prova.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PROVAPageRoutingModule
  ],
  declarations: [PROVAPage]
})
export class PROVAPageModule {}
