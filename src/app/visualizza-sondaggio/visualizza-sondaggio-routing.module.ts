import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizzaSondaggioPage } from './visualizza-sondaggio.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizzaSondaggioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizzaSondaggioPageRoutingModule {}
