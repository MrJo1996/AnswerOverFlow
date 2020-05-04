import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificaPasswordPageRoutingModule } from './modifica-password-routing.module';

import { ModificaPasswordPage } from './modifica-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificaPasswordPageRoutingModule
  ],
  declarations: [ModificaPasswordPage]
})
export class ModificaPasswordPageModule {}
