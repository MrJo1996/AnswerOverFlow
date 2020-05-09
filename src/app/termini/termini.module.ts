import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TerminiPageRoutingModule } from './termini-routing.module';

import { TerminiPage } from './termini.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TerminiPageRoutingModule
  ],
  declarations: [TerminiPage]
})
export class TerminiPageModule {}
