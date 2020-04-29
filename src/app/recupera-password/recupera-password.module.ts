import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperaPasswordPageRoutingModule } from './recupera-password-routing.module';

import { RecuperaPasswordPage } from './recupera-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperaPasswordPageRoutingModule
  ],
  declarations: [RecuperaPasswordPage]
})
export class RecuperaPasswordPageModule {}
