import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificaSondaggioPageRoutingModule } from './modifica-sondaggio-routing.module';

import { ModificaSondaggioPage } from './modifica-sondaggio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificaSondaggioPageRoutingModule
  ],
  declarations: [ModificaSondaggioPage]
})
export class ModificaSondaggioPageModule {}
