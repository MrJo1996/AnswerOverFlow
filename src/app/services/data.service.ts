import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class DataService {
  codice_domanda;
  email;
  utente={};

  codice_sondaggio;
  emailUtente;
  emailOthers;
  codice_chat;
  constructor(private http: HttpClient) { }
  setUtente(id:string, username:string,password:string, nome:string,cognome:string,bio:string){
    this.utente['0']=id;
    this.utente['1']=username;
    this.utente['2']=password;
    this.utente['3']=nome;
    this.utente['4']=cognome;
    this.utente['5']=bio;
  }
  setCod_domanda(id_domanda:number){
    this.codice_domanda = id_domanda;
  }
  setEmail_utente(id_utente:string){
    this.email = id_utente;}
  setCod_sondaggio(id_sondaggio:number){
    this.codice_sondaggio = id_sondaggio;
  }
  setEmail_Utente(cod_utente:string) {
    this.emailUtente = cod_utente;
  }
  setCodice_chat(cod_chat: number) {
    this.codice_chat = cod_chat;
  }
 
  setEmailOthers(emailOthers) {
    this.emailOthers = emailOthers;
  }
 
  getCod_domanda(){
    return this.codice_domanda;
  }
  getCod_sondaggio(){
    return this.codice_sondaggio;
  }
  getEmail_Utente() {
    return this.emailUtente;
  }
  getCodice_chat() {
    return this.codice_chat;
  }
 
  getEmailOthers(emailOthers) {
    return this.emailOthers;
  }
}
