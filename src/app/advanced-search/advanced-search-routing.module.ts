import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvancedSearchPage } from './advanced-search.page';

const routes: Routes = [
  {
    path: '',
    component: AdvancedSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvancedSearchPageRoutingModule {}
