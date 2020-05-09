import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BenvenutoPage } from './benvenuto.page';

const routes: Routes = [
  {
    path: '',
    component: BenvenutoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BenvenutoPageRoutingModule {}
