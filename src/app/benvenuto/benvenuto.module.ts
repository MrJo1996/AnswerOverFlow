import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BenvenutoPageRoutingModule } from './benvenuto-routing.module';

import { BenvenutoPage } from './benvenuto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BenvenutoPageRoutingModule
  ],
  declarations: [BenvenutoPage]
})
export class BenvenutoPageModule {}
