import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizzaChatPageRoutingModule } from './visualizza-chat-routing.module';

import { VisualizzaChatPage } from './visualizza-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizzaChatPageRoutingModule
  ],
  declarations: [VisualizzaChatPage]
})
export class VisualizzaChatPageModule {}
