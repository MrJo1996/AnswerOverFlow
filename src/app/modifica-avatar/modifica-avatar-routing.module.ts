import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificaAvatarPage } from './modifica-avatar.page';

const routes: Routes = [
  {
    path: '',
    component: ModificaAvatarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificaAvatarPageRoutingModule {}
