import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperaPasswordPage } from './recupera-password.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperaPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperaPasswordPageRoutingModule {}
