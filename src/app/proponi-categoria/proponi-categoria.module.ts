import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProponiCategoriaPageRoutingModule } from './proponi-categoria-routing.module';

import { ProponiCategoriaPage } from './proponi-categoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProponiCategoriaPageRoutingModule
  ],
  declarations: [ProponiCategoriaPage]
})
export class ProponiCategoriaPageModule {}
