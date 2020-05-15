import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Promise} from 'q';
@Injectable({
  providedIn: 'root'
})

export class DataService {
  codice_domanda;

  constructor(private http: HttpClient) { }

  setCod_domanda(id_domanda:number){
    this.codice_domanda = id_domanda;
  }
}
