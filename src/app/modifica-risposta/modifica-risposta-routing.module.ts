import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificaRispostaPage } from './modifica-risposta.page';

const routes: Routes = [
  {
    path: '',
    component: ModificaRispostaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificaRispostaPageRoutingModule {}
