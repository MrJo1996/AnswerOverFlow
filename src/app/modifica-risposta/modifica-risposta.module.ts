import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificaRispostaPageRoutingModule } from './modifica-risposta-routing.module';

import { ModificaRispostaPage } from './modifica-risposta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificaRispostaPageRoutingModule
  ],
  declarations: [ModificaRispostaPage]
})
export class ModificaRispostaPageModule {}
