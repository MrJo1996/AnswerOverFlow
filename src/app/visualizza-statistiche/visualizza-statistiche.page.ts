

    import { Component, ViewChild } from '@angular/core';
    import { Chart } from 'chart.js';
    import { NavController } from "@ionic/angular";
    import { ApiService } from '../providers/api.service';
    import { DataService } from "../services/data.service";
    import { element } from 'protractor';
    import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';
    import { Storage } from "@ionic/storage";
    import { ToastController } from "@ionic/angular";
    
    @Component({
      selector: 'app-visualizza-statistiche',
      templateUrl: './visualizza-statistiche.page.html',
      styleUrls: ['./visualizza-statistiche.page.scss'],
    })
    
    export class VisualizzaStatistichePage {
    
      segmentChanged(ev: any) {
        console.log('Segment changed', ev);
      }
    
      @ViewChild('barChart', { static: false }) barChart;
      @ViewChild('doughnutCanvas', { static: false }) doughnutCanvas;
      @ViewChild('barChart2', { static: false }) barChart2;
      @ViewChild('doughnutCanvas2', { static: false }) doughnutCanvas2;
      @ViewChild('lineCanvas', { static: false }) lineCanvas;
    
      colorArray: any;
    
      bars: any;
      doughnutChart: any;
      sbars: any;
      sdoughnutChart: any;
      lineChart: any;
      num_domande: any;
      num_domandeTot: any = [];
      num_risposteTot: any = [];
    
      Domande = {};
    
      cod_utente;
      domandeTOP = new Array();
      risposteTOP = new Array();
      categorieTOP = new Array();
      CategorieA = new Array();
      Dlabels = {};
      DlabelsTitle: any = [];
      LabelRisposte = {};
      RisposteDlabelsTitle: any = [];
      categoriaxLtitle: any = [];
      numLIKE: any = [];
      numDISLIKE: any = [];
    
      num_domandeTOP: any;
      num_domandeTOP2: any;
      num_domandeTOP3: any;
      num_risposteTOP: any;
      num_risposteTOP1: any;
      num_risposteTOP2: any;
      categoriaTOP: any;
      categoriaTOP2: any;
      categoriaTOP3: any;
      categoriaText1: any;
      categoriaText2: any;
      categoriaText3: any;
      categoriaxL = {};
      emailOther;
      emailProva;
    
      provaDomandeTOP = new Array();
    
    
      constructor(public toastController: ToastController, private storage: Storage, private dataService: DataService, private navCtrl: NavController, public apiService: ApiService) {
    
      }
    
      ngOnInit() {
    
        //this.storage.get('utente').then(data => { this.cod_utente = data.email });
        this.emailOther = this.dataService.getEmailOthers();
        this.emailProva = this.dataService.getEmail_Utente();
        setTimeout(() => {
          if(this.emailOther === "undefined"){    
              this.cod_utente=this.emailProva;
          }else{    
            this.cod_utente=this.emailOther;  
          }   
        },800)
        
      }
      ionViewDidEnter() {
    
    
    
        this.visualizzaStatisticheDomanda();
        this.visualizzaCategoria();
        this.visualizzaTOTStatisticheDomanda();
        this.visualizzaStatitischeRisposta();
        this.visualizzaTOTStatitischeRisposta();
        this.generateColorArray(8);
        this.createBarChart();
        this.doughnutChartMethod();
        this.secondbars();
        this.sdoughnutChartMethod();
        this.lineChartMethod();
        this.Valutazioni();
        this.carica();
        this.caricaR();
        this.caricaLD();
    
    
    
      }
      
    
    
      carica() {
       
    
        this.visualizzaStatisticheDomanda();
        this.visualizzaTOTStatisticheDomanda();
       
      }
    
      caricaR() {
        this.visualizzaStatitischeRisposta();
        this.visualizzaTOTStatitischeRisposta();
      }
    
      caricaLD() {
         this.Valutazioni();
      }
    
    
      goBack() {
        this.navCtrl.back();
      }
      //---------------Colori random per i grafici-------------------------------
      generateColorArray(num) {
        this.colorArray = [];
        for (let i = 0; i < num; i++) {
          this.colorArray.push('#' + Math.floor(Math.random() * 16777215).toString(16));
        }
      }
    
      //------------------------valutaioni----------------
    
    
      async Valutazioni() {
        this.apiService.get_tot_Risposte(this.cod_utente).then(
          (risposte) => {
            for (let j = 0; j < risposte['Risposte']['data'].length; j++) {
              this.categoriaxL[j] = risposte['Risposte']['data'][j].cod_categoria;
              this.apiService.getCategoria(this.categoriaxL[j]).then(
                (categorie) => {
                  this.categoriaxLtitle[j] = categorie['Categoria']['data']['0'].titolo;
    
    
                  this.apiService.ContaValutazioni(this.cod_utente, this.categoriaxL[j]).then(
                    (valutazioni) => {
                      console.log("Valutazioni ssssssssssssssssss:", valutazioni['Numero risposte']['data']);
                      this.numLIKE[j] = valutazioni['Numero risposte']['data'].num_like;
    
    
                      this.numDISLIKE[j] = valutazioni['Numero risposte']['data'].num_dislike;
    
                      this.lineChartMethod();
    
    
                    },
                    (rej) => {
                      console.log("C'è stato un errore durante la visualizzazione");
                    }
    
                  );
                }
              )
    
            }
    
          },
          (rej) => {
            console.log("C'è stato un errore durante la visualizzazione");
          }
        )
      }
    
    
      //__________________________________________________________________
    
      //--------------domande TOP 3-----------------------------------------------
      async visualizzaStatisticheDomanda() {
    
        this.apiService.get_top_Domande(this.cod_utente).then(
          (domande) => {
            console.log("CLOG domande ", domande);
    
            this.domandeTOP = domande['Domande']['data'];
    
            let i = 0;
            this.domandeTOP.forEach(element => {
              if (i === 0) {
                this.num_domandeTOP = element.num_domande;
              }
    
              if (i === 1) {
                this.num_domandeTOP2 = element.num_domande;
              }
    
              if (i === 2) {
                this.num_domandeTOP3 = element.num_domande;
              }
              i++;
            });
    
            let k = 0;
            this.domandeTOP.forEach(element => {
              if (k === 0) {
                this.categoriaTOP = element.cod_categoria;
              }
    
              if (k === 1) {
                this.categoriaTOP2 = element.cod_categoria;
    
              }
    
              if (k === 2) {
                this.categoriaTOP3 = element.cod_categoria;
              }
              k++;
            });
    
            this.visualizzaCategoria();
            this.visualizzaCategoria1();
    
            this.visualizzaCategoria2(); //se quello a sx non è nulla fa quello a dx
    
    
          },
          (rej) => {
            console.log("C'è stato un errore durante la visualizzazione");
          }
        )
      }
    
    
    
    
    
      async visualizzaCategoria() {
    
        this.apiService.getCategoria(this.categoriaTOP).then(
          (categoria) => {
    
            console.log("Categoria1", categoria['Categoria']['data']['0'].titolo);
            this.categoriaText1 = categoria['Categoria']['data']['0'].titolo;
            this.createBarChart();
    
          },
          (rej) => {
            console.log("C'è stato un errore durante la visualizzazione");
          }
        );
      }
    
    
      async visualizzaCategoria1() {
        this.apiService.getCategoria(this.categoriaTOP2).then(
          (categoria) => {
    
            console.log("Categoria 2", categoria['Categoria']['data']['0'].titolo);
            this.categoriaText2 = categoria['Categoria']['data']['0'].titolo;
            this.createBarChart();
    
    
    
    
          },
          (rej) => {
            console.log("C'è stato un errore durante la visualizzazione");
          }
        );
      }
    
      async visualizzaCategoria2() {
        this.apiService.getCategoria(this.categoriaTOP3 /* || 3 */).then(
          (categoria) => {
    
            console.log("Categoria 3", categoria['Categoria']['data']['0'].titolo);
            this.categoriaText3 = categoria['Categoria']['data']['0'].titolo;
            this.createBarChart();
    
          },
          (rej) => {
            console.log("C'è stato un errore durante la visualizzazione");
          }
    
        );
      }
    
      async visualizzaCategoriaR() {
        this.apiService.getCategoria(this.categoriaTOP).then(
          (categoria) => {
    
            this.categoriaText1 = categoria['Categoria']['data']['0'].titolo;
            this.secondbars();
    
          },
          (rej) => {
            console.log("C'è stato un errore durante la visualizzazione");
          }
    
        );
      }
      async visualizzaCategoriaR1() {
        this.apiService.getCategoria(this.categoriaTOP2).then(
          (categoria) => {
    
            this.categoriaText2 = categoria['Categoria']['data']['0'].titolo;
            this.secondbars();
    
          },
          (rej) => {
            console.log("C'è stato un errore durante la visualizzazione");
          }
    
        );
      }
      async visualizzaCategoriaR2() {
        this.apiService.getCategoria(this.categoriaTOP3).then(
          (categoria) => {
    
            this.categoriaText3 = categoria['Categoria']['data']['0'].titolo;
            this.secondbars();
    
          },
          (rej) => {
            console.log("C'è stato un errore durante la visualizzazione");
          }
    
        );
      }
    
    
    
    
      //--------------------Fine domande top--------------------------------
      async visualizzaTOTStatisticheDomanda() {
    
        this.apiService.get_tot_Domande(this.cod_utente).then(
          (domande) => {
    
            for (let j = 0; j < domande['Domande']['data'].length; j++) {
    
              this.Dlabels[j] = domande['Domande']['data'][j].cod_categoria;
              this.num_domandeTot[j] = domande['Domande']['data'][j].num_domande;
              // console.log('Il codice è', this.Dlabels[j]);
    
    
              this.apiService.getCategoria(this.Dlabels[j]).then(
                (categoria) => {
    
                  //console.log("ciaoOoooOOooO", categoria['Categoria']['data']['0'].titolo) ;
                  this.DlabelsTitle[j] = categoria['Categoria']['data']['0'].titolo;
                  //console.log('Il titolo è',this.DlabelsTitle[j]);
                  this.doughnutChartMethod();
                },
                (rej) => {
                  console.log("C'è stato un errore durante la visualizzazione");
                }
              );
    
    
            }
    
          },
          (rej) => {
            console.log("C'è stato un errore durante la visualizzazione");
          }
        )
      }
    
    
      //----------------------Risposte top 3-------------------------------------
      async visualizzaStatitischeRisposta() {
        this.apiService.get_top_Risposte(this.cod_utente).then(
          (risposte) => {
    
            console.log("Clog RIsposte top", risposte['Risposte']);
            this.risposteTOP = risposte['Risposte']['data'];
    
    
    
            //  this.num_risposteTOP=this.risposteTOP['data']['0'].num_risposte;
            //  this.num_risposteTOP1=this.risposteTOP['data']['1'].num_risposte;
            //  this.num_risposteTOP2=this.risposteTOP['data']['2'].num_risposte;
            let i = 0;
            this.risposteTOP.forEach(element => {
              if (i === 0) {
                this.num_risposteTOP = element.num_risposte;
              }
    
              if (i === 1) {
                this.num_risposteTOP1 = element.num_risposte;
              }
    
              if (i === 2) {
                this.num_risposteTOP2 = element.num_risposte;
              }
              i++;
            });
            let k = 0;
            this.risposteTOP.forEach(element => {
              if (k === 0) {
                this.categoriaTOP = element.cod_categoria;
              }
    
              if (k === 1) {
                this.categoriaTOP2 = element.cod_categoria;
    
              }
    
              if (k === 2) {
                this.categoriaTOP3 = element.cod_categoria;
              }
              k++;
            });
    
    
            this.visualizzaCategoriaR();
            this.visualizzaCategoriaR1();
            this.visualizzaCategoriaR2();
    
    
    
    
    
    
    
          },
          (rej) => {
            console.log("C'è stato un errore durante la visualizzazione");
          }
        )
      }
    
    
      async visualizzaTOTStatitischeRisposta() {
        this.apiService.get_tot_Risposte(this.cod_utente).then(
          (risposte) => {
            console.log(risposte['Risposte']['Data']);
            for (let j = 0; j < risposte['Risposte']['data'].length; j++) {
    
              this.LabelRisposte[j] = risposte['Risposte']['data'][j].cod_categoria;
              this.num_risposteTot[j] = risposte['Risposte']['data'][j].num_risposte;
              // console.log('Il codice è', this.LabelRisposte[j]);
    
    
              this.apiService.getCategoria(this.LabelRisposte[j]).then(
                (categoria) => {
    
                  //console.log("ciaoOoooOOooO", categoria['Categoria']['data']['0'].titolo) ;
                  this.RisposteDlabelsTitle[j] = categoria['Categoria']['data']['0'].titolo;
                  //console.log('Il titolo è',this.RisposteDlabelsTitle[j]);
    
    
                  this.sdoughnutChartMethod()
    
                },
                (rej) => {
                  console.log("C'è stato un errore durante la visualizzazione");
                }
              );
    
    
            }
    
          },
          (rej) => {
            console.log("C'è stato un errore durante la visualizzazione");
          }
        )
      }
    
    
    
      createBarChart() {
    
        var categorie = [];
        if (this.categoriaText1 != null) {
          categorie.push(this.categoriaText1);
    
        }
    
        if (this.categoriaText2 != null) {
          categorie.push(this.categoriaText2);
    
        }
    
        if (this.categoriaText3 != null) {
          categorie.push(this.categoriaText3);
    
        }
    
        this.bars = new Chart(this.barChart.nativeElement, {
          type: 'bar',
          data: {
            labels: categorie,
            datasets: [{
              label: 'Numero di domande',
              data: [this.num_domandeTOP, this.num_domandeTOP2, this.num_domandeTOP3],
              backgroundColor: this.colorArray,
              borderColor: this.colorArray,
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
      }
    
      doughnutChartMethod() {
     this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
            type: 'doughnut',
            data: {
              labels: this.DlabelsTitle,
              datasets: [{
                label: 'ciaooo',
                data: this.num_domandeTot,
                backgroundColor: this.colorArray,
                hoverBackgroundColor: this.colorArray
              }]
            }
          });
        
      }
    
    
      secondbars() {
        
        var categorie = [];
        if (this.categoriaText1 != null) {
          categorie.push(this.categoriaText1);
    
        }
    
        if (this.categoriaText2 != null) {
          categorie.push(this.categoriaText2);
    
        }
    
        if (this.categoriaText3 != null) {
          categorie.push(this.categoriaText3);
    
        }
        this.sbars = new Chart(this.barChart2.nativeElement, {
          type: 'bar',
          data: {
            labels: categorie,
            datasets: [{
              label: 'Numero di risposte',
              data: [this.num_risposteTOP, this.num_risposteTOP1, this.num_risposteTOP2],
              backgroundColor: this.colorArray,
              borderColor: this.colorArray,
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
      }
    
    
      sdoughnutChartMethod() {
    
        this.sdoughnutChart = new Chart(this.doughnutCanvas2.nativeElement, {
            type: 'doughnut',
            data: {
              labels: this.RisposteDlabelsTitle,
              datasets: [{
    
                data: this.num_risposteTot,
                backgroundColor: this.colorArray,
                hoverBackgroundColor: this.colorArray
              }]
            }
          });
        
      }
    
    
    
    
      lineChartMethod() {
       
    
          this.lineChart = new Chart(this.lineCanvas.nativeElement, {
            type: 'horizontalBar',
            data: {
              labels: this.categoriaxLtitle,
              datasets: [{
                label: 'LIKE ▲',
                data: this.numLIKE,
                backgroundColor: '#008000', // array should have same number of elements as number of dataset
                borderColor: '#008000',// array should have same number of elements as number of dataset
                borderWidth: 1
              },
              {
                label: 'DISLIKE ▼',
                data: this.numDISLIKE,
                backgroundColor: '#dd1144', // array should have same number of elements as number of dataset
                borderColor: '#dd1144',// array should have same number of elements as number of dataset
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
    
          });
        
      }
    
    
    }
    



