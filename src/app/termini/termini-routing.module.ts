import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TerminiPage } from './termini.page';

const routes: Routes = [
  {
    path: '',
    component: TerminiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminiPageRoutingModule {}
