import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizzaChatPage } from './visualizza-chat.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizzaChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizzaChatPageRoutingModule {}
