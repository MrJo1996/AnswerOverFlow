import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificaPasswordPage } from './modifica-password.page';

const routes: Routes = [
  {
    path: '',
    component: ModificaPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificaPasswordPageRoutingModule {}
