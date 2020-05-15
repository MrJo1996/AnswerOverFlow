import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Promise} from 'q';
@Injectable({
  providedIn: 'root'
})

export class DataService {
  codice_domanda;
  codice_sondaggio;
  emailUtente;
  codice_chat;
  constructor(private http: HttpClient) { }

  setCod_domanda(id_domanda:number){
    this.codice_domanda = id_domanda;
  }
  setCod_sondaggio(id_sondaggio:number){
    this.codice_sondaggio = id_sondaggio;
  }
  setEmail_Utente(cod_utente:string) {
    this.emailUtente = cod_utente;
  }
  setCodice_chat(cod_chat: number) {
    this.codice_chat = cod_chat;
  }
}
