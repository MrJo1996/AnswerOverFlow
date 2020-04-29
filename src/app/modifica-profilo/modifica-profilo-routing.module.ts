import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificaProfiloPage } from './modifica-profilo.page';

const routes: Routes = [
  {
    path: '',
    component: ModificaProfiloPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificaProfiloPageRoutingModule {}
