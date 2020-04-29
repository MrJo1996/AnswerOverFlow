import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'prova',
    loadChildren: () => import('./prova/prova.module').then( m => m.PROVAPageModule)
  },
  {
    path: 'modifica-sondaggio',
    loadChildren: () => import('./modifica-sondaggio/modifica-sondaggio.module').then( m => m.ModificaSondaggioPageModule)
  },
  {
    path: 'modifica-risposta',
    loadChildren: () => import('./modifica-risposta/modifica-risposta.module').then( m => m.ModificaRispostaPageModule)
  },  {
    path: 'segnala-utente',
    loadChildren: () => import('./segnala-utente/segnala-utente.module').then( m => m.SegnalaUtentePageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
