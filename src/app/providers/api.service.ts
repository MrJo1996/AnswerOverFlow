import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { resolve } from 'url';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(public http: HttpClient) { }

  modificaDomanda(codice_domanda: number, dataeora: string, timer: string, titolo: string, descrizione: string, cod_categoria: number) {
    const body = {
      codice_domanda,
      dataeora,
      timer,
      titolo,
      descrizione,
      cod_categoria
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/modificaDomanda', body).subscribe(
        data => {
          let esito = data['message'];
          console.log('esito: ', esito);
          resolve(esito);
        },
        (err) => {
          reject();
        }
      );
    });
  }

  modificaProfilo(username: string, password: string, nome: string, cognome: string, bio: string, email: string) {
    const body = {
      username,
      password,
      nome,
      cognome,
      bio,
      email
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/modificaProfilo', body).subscribe(
        data => {
          let esito = data['message'];
          console.log('esito: ', esito);
          resolve(esito);
        },
        (err) => {
          reject();
        }
      );
    });
  }
  

  modificaSondaggio(titolo: string, timer: string, codice_sondaggio: Number) {
    const body = {
      titolo,
      timer,
      codice_sondaggio
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/modificaSondaggio', body).subscribe(
        data => {
          let esito = data['message'];
          resolve(esito);
        },
        (err) => {
          
          reject();
        }
      );
    });
  }

  getSondaggio(codice_sondaggio: Number) {
    const body = {
      codice_sondaggio: codice_sondaggio
    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaSondaggio', body).subscribe(
        data => {
          let sondaggio = data['Sondaggio']; 
          resolve(sondaggio); //restituirò al ts un oggetto di nome "sondaggio" con accesso già alla posizione "Sondaggio" avendo visto il json di data
         // console.log('ciao' ,sondaggio);
         
        },
        (err) => {
          reject();
        }
      );
    });
  }

  modificaRisposta(codice_risposta: Number, descrizione: string) {
    const body = {
      codice_risposta,
      descrizione
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/modificaRisposta', body).subscribe(
        data => {
          let esito = data['message'];
          console.log('esito: ', esito);
          resolve(esito);
        },
        (err) => {
          reject();
        }
      );
    });
  }

}
