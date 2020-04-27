import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificaSondaggioPage } from './modifica-sondaggio.page';

const routes: Routes = [
  {
    path: '',
    component: ModificaSondaggioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificaSondaggioPageRoutingModule {}
