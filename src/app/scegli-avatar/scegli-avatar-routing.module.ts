import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScegliAvatarPage } from './scegli-avatar.page';

const routes: Routes = [
  {
    path: '',
    component: ScegliAvatarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScegliAvatarPageRoutingModule {}
