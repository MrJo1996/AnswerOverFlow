import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { resolve } from 'url';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public http: HttpClient) { }

  getDomanda(codice_domanda: number) {
    const body = {
      codice_domanda: codice_domanda
    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaDomanda', body).subscribe(
        data => {
          let domanda = data['Domanda'];
          resolve(domanda); 
          console.log(domanda);

        },
        (err) => {
          reject();
        }
      );
    });
  }


  modificaDomanda(codice_domanda: number, dataeora: string, timer: string, titolo: string, descrizione: string, cod_categoria: number, cod_preferita: number) {
    const body = {
      codice_domanda,
      dataeora,
      timer,
      titolo,
      descrizione,
      cod_categoria,
      cod_preferita
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/modificaDomanda', body).subscribe(
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
          //console.log('esito: ', esito);
          resolve(esito);
        },
        (err) => {
          reject();
        }
      );
    });
  }

  getProfilo(email: string){
    const body = {
      email: email
    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaProfilo', body).subscribe(
        data => {
          let profilo = data['Profilo'];
          resolve(profilo); //restituirò al ts un oggetto di nome "profilo" con accesso già alla posizione "Profilo" avendo visto il json di data
          console.log('ciao' ,profilo);

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
          console.log('ciao' ,sondaggio);

        },
        (err) => {
          reject();
        }
      );
    });
  }

 
  getRisposta(codice_risposta: Number) {
    const body = {
      codice_risposta: codice_risposta

    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzarisposta', body).subscribe(
        data => {
          let risposta = data['Risposte'];
          resolve(risposta); 
          console.log(risposta)//restituirò al ts un oggetto di nome "risposta" con accesso già alla posizione "Risposta" avendo visto il json di data
          // console.log('ciao' ,);

        },
        (err) => {
          reject();
        }
      );
    });
  }

  rimuoviSondaggio(codice_sondaggio: Number) {
    //TODO code lancio endPoint
  }

  modificaRisposta(codice_risposta: Number, descrizione: string) {
    const body = {
      descrizione,
      codice_risposta
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
  
  prendiChats(codice_utente: string, url: string) {
    const body = {
      codice_utente
    };
    const URL = url;
    return new Promise((resolve, reject) => {
      this.http.post(URL, body).subscribe(
        data => {
          console.log('Obj Chats', data);
          let chats = data['Chats']['data'];
          resolve(chats); 

        },
        (err) => {
          reject();
        }
      );
    });
  }

  prendiCategorie(url: string) {
    const URL = url;
    return new Promise((resolve, reject) => {
      this.http.post(URL, "").subscribe(
        data => {
          console.log('Obj Categorie', data);
          let categorie = data['Categorie']['data'];
          resolve(categorie);

        },
        (err) => {
          reject();
        }
      );
    });
  }

  inserisciDomanda(timer: string, titolo: string, descrizione: string, cod_utente: string, cod_categoria: number) {
    const body = {
      timer,
      titolo,
      descrizione,
      cod_utente,
      cod_categoria
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/inserisciDomanda', body).subscribe(
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

  modificaPassword(password: string, email: string) {
    const body = {

      
      password,
      email
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/modificaPassword', body).subscribe(
        data => {
          let esito = data['message'];
          resolve(esito);
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
