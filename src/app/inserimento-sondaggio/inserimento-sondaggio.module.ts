import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InserimentoSondaggioPageRoutingModule } from './inserimento-sondaggio-routing.module';

import { InserimentoSondaggioPage } from './inserimento-sondaggio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InserimentoSondaggioPageRoutingModule
  ],
  declarations: [InserimentoSondaggioPage]
})
export class InserimentoSondaggioPageModule {}
