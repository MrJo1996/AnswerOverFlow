import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InserisciDomandaPageRoutingModule } from './inserisci-domanda-routing.module';

import { InserisciDomandaPage } from './inserisci-domanda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InserisciDomandaPageRoutingModule
  ],
  declarations: [InserisciDomandaPage]
})
export class InserisciDomandaPageModule {}
