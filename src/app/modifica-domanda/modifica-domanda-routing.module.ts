import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificaDomandaPage } from './modifica-domanda.page';

const routes: Routes = [
  {
    path: '',
    component: ModificaDomandaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificaDomandaPageRoutingModule {}
