import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule)
  },
  {
    path: 'prova',
    loadChildren: () => import('./prova/prova.module').then(m => m.PROVAPageModule)
  },
  {
    path: 'modifica-sondaggio',
    loadChildren: () => import('./modifica-sondaggio/modifica-sondaggio.module').then(m => m.ModificaSondaggioPageModule)
  },
  {
    path: 'modifica-risposta',
    loadChildren: () => import('./modifica-risposta/modifica-risposta.module').then(m => m.ModificaRispostaPageModule)
  },
  {
    path: 'modifica-profilo',
    loadChildren: () => import('./modifica-profilo/modifica-profilo.module').then(m => m.ModificaProfiloPageModule)
  },
  {
    path: 'modifica-domanda',
    loadChildren: () => import('./modifica-domanda/modifica-domanda.module').then(m => m.ModificaDomandaPageModule)
  },
  {
    path: 'inserisci-domanda',
    loadChildren: () => import('./inserisci-domanda/inserisci-domanda.module').then(m => m.InserisciDomandaPageModule)
  },
  {
    path: 'recupera-password',
    loadChildren: () => import('./recupera-password/recupera-password.module').then(m => m.RecuperaPasswordPageModule)
  },
  {
    path: 'proponi-categoria',
    loadChildren: () => import('./proponi-categoria/proponi-categoria.module').then(m => m.ProponiCategoriaPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'visualizza-profilo',
    loadChildren: () => import('./visualizza-profilo/visualizza-profilo.module').then(m => m.VisualizzaProfiloPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'registrazione',
    loadChildren: () => import('./registrazione/registrazione.module').then(m => m.RegistrazionePageModule)
  },
  {
    path: 'visualizza-domanda',
    loadChildren: () => import('./visualizza-domanda/visualizza-domanda.module').then(m => m.VisualizzaDomandaPageModule)
  },
  {
    path: 'visualizza-sondaggio',
    loadChildren: () => import('./visualizza-sondaggio/visualizza-sondaggio.module').then(m => m.VisualizzaSondaggioPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatPageModule)
  },
  {
    path: 'modifica-password',
    loadChildren: () => import('./modifica-password/modifica-password.module').then(m => m.ModificaPasswordPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./info/info.module').then(m => m.InfoPageModule)
  },
  {
    path: 'visualizza-chats',
    loadChildren: () => import('./visualizza-chats/visualizza-chat.module').then(m => m.VisualizzaChatPageModule)
  },
  {
    path: 'inserimento-sondaggio',
    loadChildren: () => import('./inserimento-sondaggio/inserimento-sondaggio.module').then(m => m.InserimentoSondaggioPageModule)
  },
  {
    path: 'termini',
    loadChildren: () => import('./termini/termini.module').then(m => m.TerminiPageModule)
  },
  {
    path: 'benvenuto',
    loadChildren: () => import('./benvenuto/benvenuto.module').then(m => m.BenvenutoPageModule)
  },
  {
    path: 'conferma-recupero',
    loadChildren: () => import('./conferma-recupero/conferma-recupero.module').then(m => m.ConfermaRecuperoPageModule)
  },
  {
    path: 'bio',
    loadChildren: () => import('./bio/bio.module').then(m => m.BioPageModule)
  },
  {
    path: 'visualizza-statistiche',
    loadChildren: () => import('./visualizza-statistiche/visualizza-statistiche.module').then(m => m.VisualizzaStatistichePageModule)
  },
  {
    path: 'conferma-invio-proposta',
    loadChildren: () => import('./conferma-invio-proposta/conferma-invio-proposta.module').then( m => m.ConfermaInvioPropostaPageModule)
  },  {
    path: 'search-results',
    loadChildren: () => import('./search-results/search-results.module').then( m => m.SearchResultsPageModule)
  }




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
