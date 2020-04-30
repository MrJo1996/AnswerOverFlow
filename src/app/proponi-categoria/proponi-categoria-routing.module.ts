import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProponiCategoriaPage } from './proponi-categoria.page';

const routes: Routes = [
  {
    path: '',
    component: ProponiCategoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProponiCategoriaPageRoutingModule {}
