import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MieAttivitaPage } from './mie-attivita.page';

const routes: Routes = [
  {
    path: '',
    component: MieAttivitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MieAttivitaPageRoutingModule {}
