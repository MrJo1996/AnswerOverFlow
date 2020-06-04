import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MieAttivitaPageRoutingModule } from './mie-attivita-routing.module';

import { MieAttivitaPage } from './mie-attivita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MieAttivitaPageRoutingModule
  ],
  declarations: [MieAttivitaPage]
})
export class MieAttivitaPageModule {}
