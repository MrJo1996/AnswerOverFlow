import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizzaDomandaPageRoutingModule } from './visualizza-domanda-routing.module';

import { VisualizzaDomandaPage } from './visualizza-domanda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizzaDomandaPageRoutingModule
  ],
  declarations: [VisualizzaDomandaPage]
})
export class VisualizzaDomandaPageModule {}
