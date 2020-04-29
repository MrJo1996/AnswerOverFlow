import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InserisciDomandaPage } from './inserisci-domanda.page';

const routes: Routes = [
  {
    path: '',
    component: InserisciDomandaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InserisciDomandaPageRoutingModule {}
