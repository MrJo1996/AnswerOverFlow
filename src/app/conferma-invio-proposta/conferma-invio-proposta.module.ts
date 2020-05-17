import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfermaInvioPropostaPageRoutingModule } from './conferma-invio-proposta-routing.module';

import { ConfermaInvioPropostaPage } from './conferma-invio-proposta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfermaInvioPropostaPageRoutingModule
  ],
  declarations: [ConfermaInvioPropostaPage]
})
export class ConfermaInvioPropostaPageModule {}
