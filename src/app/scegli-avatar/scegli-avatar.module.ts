import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScegliAvatarPageRoutingModule } from './scegli-avatar-routing.module';

import { ScegliAvatarPage } from './scegli-avatar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScegliAvatarPageRoutingModule
  ],
  declarations: [ScegliAvatarPage]
})
export class ScegliAvatarPageModule {}
