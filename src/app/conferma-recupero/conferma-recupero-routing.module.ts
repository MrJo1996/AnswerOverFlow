import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfermaRecuperoPage } from './conferma-recupero.page';

const routes: Routes = [
  {
    path: '',
    component: ConfermaRecuperoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfermaRecuperoPageRoutingModule {}
