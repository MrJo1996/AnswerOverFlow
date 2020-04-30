import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizzaProfiloPage } from './visualizza-profilo.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizzaProfiloPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizzaProfiloPageRoutingModule {}
