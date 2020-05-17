import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizzaStatistichePage } from './visualizza-statistiche.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizzaStatistichePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizzaStatistichePageRoutingModule {}
