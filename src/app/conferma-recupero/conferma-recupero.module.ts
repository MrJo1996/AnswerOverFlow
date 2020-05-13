import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfermaRecuperoPageRoutingModule } from './conferma-recupero-routing.module';

import { ConfermaRecuperoPage } from './conferma-recupero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfermaRecuperoPageRoutingModule
  ],
  declarations: [ConfermaRecuperoPage]
})
export class ConfermaRecuperoPageModule {}
