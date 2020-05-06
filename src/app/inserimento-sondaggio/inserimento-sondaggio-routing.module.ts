import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InserimentoSondaggioPage } from './inserimento-sondaggio.page';

const routes: Routes = [
  {
    path: '',
    component: InserimentoSondaggioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InserimentoSondaggioPageRoutingModule {}
