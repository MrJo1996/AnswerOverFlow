import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificaDomandaPageRoutingModule } from './modifica-domanda-routing.module';

import { ModificaDomandaPage } from './modifica-domanda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificaDomandaPageRoutingModule
  ],
  declarations: [ModificaDomandaPage]
})
export class ModificaDomandaPageModule {}
