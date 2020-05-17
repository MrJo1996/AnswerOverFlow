import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class DataService {
  codice_domanda;
  email;
  utente={};

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
    this.email = id_utente;
  }
}
