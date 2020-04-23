import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PROVAPage } from './prova.page';

const routes: Routes = [
  {
    path: '',
    component: PROVAPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PROVAPageRoutingModule {}
