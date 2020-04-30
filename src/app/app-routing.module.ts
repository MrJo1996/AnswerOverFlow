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
  },
  {
    path: 'modifica-profilo',
    loadChildren: () => import('./modifica-profilo/modifica-profilo.module').then( m => m.ModificaProfiloPageModule)
  },
  {
    path: 'modifica-domanda',
    loadChildren: () => import('./modifica-domanda/modifica-domanda.module').then( m => m.ModificaDomandaPageModule)
  },
  {
    path: 'segnala-utente',
    loadChildren: () => import('./segnala-utente/segnala-utente.module').then( m => m.SegnalaUtentePageModule)
  },
  {
    path: 'inserisci-domanda',
    loadChildren: () => import('./inserisci-domanda/inserisci-domanda.module').then( m => m.InserisciDomandaPageModule)
  },
  {
    path: 'recupera-password',
    loadChildren: () => import('./recupera-password/recupera-password.module').then( m => m.RecuperaPasswordPageModule)
  },
  {
    path: 'proponi-categoria',
    loadChildren: () => import('./proponi-categoria/proponi-categoria.module').then( m => m.ProponiCategoriaPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
