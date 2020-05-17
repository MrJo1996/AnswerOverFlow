import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfermaInvioPropostaPage } from './conferma-invio-proposta.page';

const routes: Routes = [
  {
    path: '',
    component: ConfermaInvioPropostaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfermaInvioPropostaPageRoutingModule {}
