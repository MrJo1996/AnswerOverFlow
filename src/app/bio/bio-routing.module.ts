import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BioPage } from './bio.page';

const routes: Routes = [
  {
    path: '',
    component: BioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BioPageRoutingModule {}
