import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SegnalaUtentePageRoutingModule } from './segnala-utente-routing.module';

import { SegnalaUtentePage } from './segnala-utente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SegnalaUtentePageRoutingModule
  ],
  declarations: [SegnalaUtentePage]
})
export class SegnalaUtentePageModule {}
