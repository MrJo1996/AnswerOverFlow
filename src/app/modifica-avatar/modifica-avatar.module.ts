import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificaAvatarPageRoutingModule } from './modifica-avatar-routing.module';

import { ModificaAvatarPage } from './modifica-avatar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificaAvatarPageRoutingModule
  ],
  declarations: [ModificaAvatarPage]
})
export class ModificaAvatarPageModule {}
