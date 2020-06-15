import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class DataService {
  codice_domanda;
  email;
  utente = {};
  popover_modifica;
  session;
  codice_sondaggio;
  emailUtente;
  emailOthers: string;
  codice_chat = null;
  codice_risposta;
  nuova_proposta;
  nome;
  cognome;
  username;
  domanda;
  user_domanda;
  cod_domanda;
  avatar; // var per l'avatar dell'utente loggato
  avatarTemporary; // var per cambiare l'avatar

  index2;
  //Var Ricerca
  keywordToSearch;
  filters = [];
  NotificationsState: boolean = false;
  


  constructor(private http: HttpClient) { }
  setUtente(id: string, username: string, password: string, nome: string, cognome: string, bio: string) {
    this.utente['0'] = id;
    this.utente['1'] = username;
    this.utente['2'] = password;
    this.utente['3'] = nome;
    this.utente['4'] = cognome;
    this.utente['5'] = bio;
  }

  setFilters(tipo: string, codCategoria: string, status: string, filtered: boolean) {
    this.filters['tipo'] = tipo;
    this.filters['codCategoria'] = codCategoria;
    this.filters['status'] = status;
    this.filters['isFiltered'] = filtered; //bool

  }

  setAvatar(avatar: string) {
    this.utente['6'] = avatar;
  }
  settaTemporaryAvatar(avatar: string) {
    this.avatarTemporary = avatar;
  }
  setPopoverModifica(index: boolean,index2: number) {
    this.popover_modifica = index;
    this.index2 = index2;
  }
  setCod_domanda(id_domanda: number) {
    this.codice_domanda = id_domanda;
  }
  setEmail_utente(id_utente: string) {
    this.email = id_utente;
  }
  setCod_sondaggio(id_sondaggio: number) {
    this.codice_sondaggio = id_sondaggio;
  }
  setEmail_Utente(cod_utente: string) {
    this.emailUtente = cod_utente;
  }
  setCodice_chat(cod_chat: number) {
    this.codice_chat = cod_chat;
  }
  setAvatarUtente(avatar: string) {
    this.avatar = avatar;
  }

  setEmailOthers(emailOthers) {
    this.emailOthers = emailOthers;
  }
  setNuovaProposta(proposta) {
    this.nuova_proposta = proposta;
  }

  //Ricerca
  setKeywordToSearch(key: string) {
    this.keywordToSearch = key;
  }
  //

  setSession(session) {
    this.session = session;
  }

  setDomanda(domanda) {
    this.cod_domanda = domanda.codice_domanda;
    this.user_domanda = domanda.cod_utente;
  }

  
  setNotificationsState(value: boolean) {
    this.NotificationsState = value;
  }


  getNotificationsState(): boolean {
    return this.NotificationsState;
  }


  getSession() {
    return this.session;
  }
  getCod_domanda() {
    return this.codice_domanda;
  }
  getCod_sondaggio() {
    return this.codice_sondaggio;
  }
  getEmail_Utente() {
    return this.emailUtente;
  }
  getCodice_chat() {
    return this.codice_chat;
  }
  getAvatar() {
    return this.avatar;
  }
  getTemporaryAvatar() {
    return this.avatarTemporary
  }
  getEmailOthers() {
    return this.emailOthers;
  }
  getNuovaProposta() {
    return this.nuova_proposta;
  }

  getCodiceRisposta() {

    return this.codice_risposta;
  }

  //Ricerca
  getKeywordToSearch() {
    return this.keywordToSearch;
  }

  getFilters() {
    return this.filters;
  }
  //

  getUtente() {
    return this.utente;
  }

  setUsername(pUsername) {
    this.username = pUsername;
  }

  getUsername() {
    return this.username;
  }

  setNome(pNome) {
    this.nome = pNome;
  }

  getNome() {
    return this.nome;
  }

  setCognome(pCognome) {
    this.cognome = pCognome;
  }

  getCognome() {
    return this.cognome;
  }
  getUserDomanda() {
    return this.user_domanda;
  }
  getCodDomanda() {
    return this.cod_domanda;
  }
  getPopoverModifica(){
    return this.popover_modifica;
  }
  getIndex2(){
    return this.index2;
  }

  //Funzione per il caricamento delle pagine e dei relativi dati
  loadingView(time: number){
    const loading = document.createElement('ion-loading');
    
    loading.cssClass = 'loading';
    loading.spinner = 'crescent';
    loading.duration = time;

    document.body.appendChild(loading);
    return loading.present();
  }
}
