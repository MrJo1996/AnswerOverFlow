import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvancedSearchPageRoutingModule } from './advanced-search-routing.module';

import { AdvancedSearchPage } from './advanced-search.page';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AdvancedSearchPageRoutingModule
  ],
  declarations: [AdvancedSearchPage]
})
export class AdvancedSearchPageModule {}
