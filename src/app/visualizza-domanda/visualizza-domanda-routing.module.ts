import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizzaDomandaPage } from './visualizza-domanda.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizzaDomandaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizzaDomandaPageRoutingModule {}
