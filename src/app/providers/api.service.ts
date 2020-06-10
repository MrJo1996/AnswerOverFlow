import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { resolve } from 'url';
import { Data } from '@angular/router';


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
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzadomanda', body).subscribe(
        data => {

          let domanda = data['Domande'];

          resolve(domanda);
          console.log(domanda);

        },
        (err) => {
          reject();
        }
      );
    });
  }
  getDomandaHome() {
    const body = {
    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzadomandehome', body).subscribe(
        data => {

          let domande = data['Domande']['data'];

          resolve(domande);
        },
        (err) => {
          reject();
        }
      );
    });
  }
  getSondaggioHome() {
    const body = {
    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzasondaggihome', body).subscribe(
        data => {

          let sondaggi = data['Sondaggi']['data'];

          resolve(sondaggi);
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
    console.log(body)
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

  modificaProfilo(username: string, password: string, nome: string, cognome: string, bio: string, email: string, avatar: string) {
    const body = {
      username,
      password,
      nome,
      cognome,
      bio,
      email,
      avatar
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

  modificaProfiloNoPass(username: string, nome: string, cognome: string, bio: string, email: string, avatar: string) {
    const body = {
      username,
      nome,
      cognome,
      bio,
      email,
      avatar
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


  getProfilo(email: string) {
    const body = {
      email: email
    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaProfilo', body).subscribe(
        data => {
          let profilo = data['Profilo'];
          resolve(profilo); //restituirò al ts un oggetto di nome "profilo" con accesso già alla posizione "Profilo" avendo visto il json di data
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
          console.log('ciao', sondaggio);

        },
        (err) => {
          reject();
        }
      );
    });
  }

  getScelteSondaggio(codice_sondaggio: Number) {
    const body = {
      codice_sondaggio: codice_sondaggio
    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaScelteSondaggio', body).subscribe(
        data => {
          let scelte = data;
          resolve(scelte); //restituirò al ts un oggetto di nome "sondaggio" con accesso già alla posizione "Sondaggio" avendo visto il json di data
          console.log(scelte);

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

  getCategoria(codice_categoria: Number) {
    const body = {
      codice_categoria: codice_categoria

    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzacategoria', body).subscribe(
        data => {
          let categoria = data;
          resolve(categoria);
        },
        (err) => {
          reject();
        }
      );
    });
  }

  getRispostePerDomanda(codice_domanda: Number) {
    const body = {
      codice_domanda: codice_domanda

    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/risposteperdomanda', body).subscribe(
        data => {
          let risposte = data;
          resolve(risposte);
          console.log(risposte)

        },
        (err) => {
          reject();
        }
      );
    });
  }

  rimuoviSondaggio(codice_sondaggio: Number) {
    return new Promise((resolve, reject) => {
      var url = "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/cancellaSondaggio/";
      var urlAndCode = url.concat(codice_sondaggio.toString());
      this.http.delete(urlAndCode).subscribe(
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

  rimuoviDomanda(cod_domanda: number) {

    return new Promise((resolve, reject) => {
      var url = "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/cancellaDomanda/";
      var urlAndCode = url.concat(cod_domanda.toString());
      this.http.delete(urlAndCode).subscribe(
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

  inserisciRisposta(descrizione: string, cod_utente: string, cod_domanda: Number) {
    const body = {
      descrizione,
      cod_utente,
      cod_domanda
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/inserisci_risposta', body).subscribe(
        data => {
          let esito = data['message'];
          console.log('esito inserisci risposta: ', esito);
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

  prendiUltimoMessaggio(cod_chat: number, url: string) {
    const body = {
      cod_chat
    };
    const URL = url;
    return new Promise((resolve, reject) => {
      this.http.post(URL, body).subscribe(
        data => {
          let messaggio = data;
          resolve(messaggio);
        },
        (err) => {
          reject("Non sono prensenti messaggi in questa chat");
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

  inserisciSondaggio(URL: string, timer: string, dataeora: Data, cod_utente: string, titolo: string, cod_categoria: number) {
    const body = {
      timer,
      dataeora,
      titolo,
      cod_utente,
      cod_categoria
    };
    return new Promise((resolve, reject) => {
      this.http.post(URL, body).subscribe(
        data => {
          let sondaggio = data['data']['codice_sondaggio'];
          let esito = data['message'];
          console.log("L'esito dell'inserimento sondaggio è che ", esito);
          console.log("il codice sondaggio è ", sondaggio);
          resolve(sondaggio);
        },
        (err) => {
          reject("Url errato");
        }
      )
    })
  }



  inserisciSceltaSondaggio(URL: string, codice_sondaggio: number, descrizione: string) {
    const body = {
      codice_sondaggio,
      descrizione
    };
    return new Promise((resolve, reject) => {
      this.http.post(URL, body).subscribe(
        data => {
          let esito = data['Scelte']['message'];
          console.log("L'esito è che ", esito);
          resolve(esito);
        },
        (err) => {
          reject("Url errato");
        }
      )
    })
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

  registrazione(email: string, username: string, password: string, nome: string, cognome: string, bio: string, avatar:string) {
    const body = {
      email,
      username,
      password,
      nome,
      cognome,
      bio,
      avatar
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/registrazione', body).subscribe(
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

  proponi_categoria(proposta) {
    const body = {
      proposta
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/proponi_categoria', body).subscribe(
        data => {
          let esito = data['message'];
          resolve(esito);
        }, (err) => {
          reject();
        }
      );
    });
  }

  segnala_utente(segnalazione: string, utente_segnalato: string, email_utente_segnalato: string) {
    const body = {
      segnalazione,
      utente_segnalato,
      email_utente_segnalato
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/segnala_utente', body).subscribe(
        data => {
          let esito = data['message'];
          resolve(esito);
        }, (err) => {
          reject();
        }
      );
    });
  }


  votaSondaggio(codice_scelta: number, cod_sondaggio: number) {
    const body = {
      codice_scelta,
      cod_sondaggio
    };
    return new Promise((resolve, reject) => {
      this.http.post('//answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/votasondaggio', body).subscribe(
        data => {
          let esitoVoto = data
          console.log(esitoVoto);
          resolve(esitoVoto);
        },
        (err) => {
          reject();
        }
      )
    })
  }

  inserisciVotante(cod_scelta: number, cod_utente: String, cod_sondaggio: number) {
    const body = {
      cod_scelta,
      cod_utente, 
      cod_sondaggio
    };
    return new Promise((resolve, reject) => {
      this.http.post('//answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/inserisciVotante', body).subscribe(
        data => {
          let esitoInserimentoVotante = data
       
          resolve(esitoInserimentoVotante);
        },
        (err) => {
          reject();
        }
      )
    })
  }



  get_top_Domande(cod_utente: string) {
    const body = {
      cod_utente: cod_utente

    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzastatistichedomanda', body).subscribe(
        data => {
          let domande = data;
          resolve(domande);


        },
        (err) => {
          reject();
        }
      );
    });
  }


  get_tot_Domande(cod_utente: string) {
    const body = {
      cod_utente: cod_utente

    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaTOTStatisticheDomanda', body).subscribe(
        data => {
          let domande = data;
          resolve(domande);
          console.log(domande)

        },
        (err) => {
          reject();
        }
      );
    });
  }

  get_top_Risposte(cod_utente: string) {
    const body = {
      cod_utente: cod_utente

    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaStatisticherisposta', body).subscribe(
        data => {
          let risposte = data;
          resolve(risposte);
          console.log(risposte)

        },
        (err) => {
          reject();
        }
      );
    });
  }

  get_tot_Risposte(cod_utente: string) {
    const body = {
      cod_utente: cod_utente

    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaStatisticheTOTrisposta', body).subscribe(
        data => {
          let risposte = data;
          resolve(risposte);
          console.log(risposte)

        },
        (err) => {
          reject();
        }
      );
    });
  }

  scegliRispostaPreferita(codice_domanda: number, cod_preferita: number) {
    const body = {
      codice_domanda,
      cod_preferita
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/sceglirispostapreferita', body).subscribe(
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

  getMieDomande(cod_utente: string) {
    const body = {
      cod_utente: cod_utente
    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaDomandeMie', body).subscribe(
        data => {
         
          let domande = data;['Domande']['data'];
          console.log(domande);
          resolve(domande); 
        },
        (err) => {
          reject();
        }
      );
    });
  }

  getMieiSondaggi(cod_utente: string) {
    const body = {
      cod_utente: cod_utente
    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/visualizzaSondaggiMiei', body).subscribe(
        data => {
         
          let sondaggi = data['Sondaggi']['data'];
          console.log(sondaggi);
          resolve(sondaggi); 
        },
        (err) => {
          reject();
        }
      );
    });
  }



  //RICERCA
  ricercaDomanda(keyword: string) {
    const body = {
      keyword
    };
    return new Promise((resolve, reject) => {
      
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaDomandaKeyword', body).subscribe(
        (data) => {
          let esito = data['Domanda']['data'];
          resolve(esito);
        },
        (err) => {
          console.log(err);
          reject();
        }
      );
    });
  }

  ricercaSondaggio(keyword: string) {
    const body = {
      keyword
    };
    return new Promise((resolve, reject) => {
      
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaSondaggioKeyword', body).subscribe(
        (data) => {
          let esito = data['Sondaggio']['data'];
          resolve(esito);
        },
        (err) => {
          console.log("Rej sond",err);
          reject();
        }
      );
    });
  }

  ricercaUtente(keyword: string) {

    
    const body = {
      keyword
    };
    return new Promise((resolve, reject) => {
      
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaUserKeyword', body).subscribe(
        (data) => {
          let esito = data['utente']['data'];
          console.log(data);

          resolve(esito);
        },
        (err) => {
          console.log("Rej utente",err);
          reject();
        }
      );
    });
  }

  
  controllaGiaVotato(cod_utente: string, cod_sondaggio: number) {
    const body = {
      cod_utente: cod_utente,
      cod_sondaggio: cod_sondaggio
    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/controllogiavotato', body).subscribe(
        (data) => {
          let risultato = data;
          
          console.log("API SERVICE GIA VOTATO: ", body, data)
          resolve(risultato); 


        },
        (err) => {
          reject();
        }
      );
    });
  }

  inserisciValutazione(cod_risposta: number, cod_utente: string, tipo_like: number) {
    const body = {
      cod_risposta,
      cod_utente,
      tipo_like
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/inserisci_valutazione', body).subscribe(
        data => {
          let esito = data['message'];
          console.log('esito inserimento valutazione: ', esito);
          resolve(esito);
        },
        (err) => {
          reject();
        }
      );
    });
  }



  modificaNumLike(codice_risposta: number) {
    const body = {
      codice_risposta
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/modifica_num_like', body).subscribe(
        data => {
          let esito = data;
          console.log('esito modifica num like: ', esito);
          resolve(esito);
        },
        (err) => {
          reject();
        }
      );
    });
  }

  togliLike(codice_risposta: number) {
    const body = {
      codice_risposta
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/togli_like', body).subscribe(
        data => {
          let esito = data;
          console.log('esito modifica num like: ', esito);
          resolve(esito);
        },
        (err) => {
          reject();
        }
      );
    });
  }

  modificaNumDislike(codice_risposta: number) {
    const body = {
      codice_risposta
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/modifica_num_dislike', body).subscribe(
        data => {
          let esito = data;
          console.log('esito modifica num dislike: ', esito);
          resolve(esito);
        },
        (err) => {
          reject();
        }
      );
    });
  }

  togliDislike(codice_risposta: number) {
    const body = {
      codice_risposta
    };
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/togli_dislike', body).subscribe(
        data => {
          let esito = data;
          console.log('esito modifica num dislike: ', esito);
          resolve(esito);
        },
        (err) => {
          reject();
        }
      );
    });
  }


  controllaGiaValutatoRisposta(cod_utente: string, cod_risposta: number) {
    const body = {
      cod_utente: cod_utente,
      cod_risposta: cod_risposta
    };

    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/controllogiavalutatorisposta', body).subscribe(
        (data) => {
          let risultato = data;
          
          console.log("API SERVICE GIA VALUTATA RISPOSTA: ", body, data)
          resolve(risultato); 


        },
        (err) => {
          reject();
        }
      );
    });
  }


  rimuoviValutazione(codice_valutazione: Number) {
    return new Promise((resolve, reject) => {
      var url = "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/eliminaVal/";
      var urlAndCode = url.concat(codice_valutazione.toString());
      this.http.delete(urlAndCode).subscribe(
        data => {
          let esito = data['message'];
          console.log('esito cancella valutazione: ', esito, urlAndCode);
          resolve(esito);
        },
        (err) => {
          reject();
          console.log('esito andato a : ', urlAndCode, err);
        }
      );
    });
  }

/*
  rimuoviValutazione(cod_risposta: Number, cod_utente: string) {
    return new Promise((resolve, reject) => {
      var url = "http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/eliminaVal/";
      var urlAndCode = url.concat(cod_risposta.toString());
      var urlAlmostComplete = urlAndCode.concat(",");
      var urlComplete = urlAlmostComplete.concat(cod_utente.toString());
      this.http.delete(urlComplete).subscribe(
        data => {
          let esito = data['message'];
          console.log('esito: ', esito, url);
          resolve(esito);
        },
        (err) => {
          reject();
          console.log('esito andato a : ', urlComplete, err);
        }
      );
    });
  }*/

  

  ContaValutazioni(email: string, codice_categoria: number) {
    const body = {
      email, 
      codice_categoria
  
    };
  
    return new Promise((resolve, reject) => {
      this.http.post('http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/contaValutazioni', body).subscribe(
        data => {
          let valutazioni = (data);
          resolve(valutazioni)
          console.log(valutazioni);
  
  
        },
        (err) => {
          reject();
        }
      );
    });

}

}