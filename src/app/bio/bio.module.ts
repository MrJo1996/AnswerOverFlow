import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BioPageRoutingModule } from './bio-routing.module';

import { BioPage } from './bio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BioPageRoutingModule
  ],
  declarations: [BioPage]
})
export class BioPageModule {}
