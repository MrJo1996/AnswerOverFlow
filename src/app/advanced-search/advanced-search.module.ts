import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvancedSearchPageRoutingModule } from './advanced-search-routing.module';

import { AdvancedSearchPage } from './advanced-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdvancedSearchPageRoutingModule
  ],
  declarations: [AdvancedSearchPage]
})
export class AdvancedSearchPageModule {}
