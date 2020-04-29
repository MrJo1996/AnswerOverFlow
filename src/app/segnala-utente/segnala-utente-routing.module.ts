import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SegnalaUtentePage } from './segnala-utente.page';

const routes: Routes = [
  {
    path: '',
    component: SegnalaUtentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SegnalaUtentePageRoutingModule {}
