import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificaProfiloPageRoutingModule } from './modifica-profilo-routing.module';

import { ModificaProfiloPage } from './modifica-profilo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificaProfiloPageRoutingModule
  ],
  declarations: [ModificaProfiloPage]
})
export class ModificaProfiloPageModule {}
