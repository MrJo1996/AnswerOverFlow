

    import { Component, ViewChild } from '@angular/core';
    import { Chart } from 'chart.js';
    import { NavController, MenuController } from "@ionic/angular";
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
      domandeBtn;
      risposteBtn;
      likeBtn;
  
     
    
      constructor( private menuCrtl: MenuController,
                   public toastController: ToastController, 
                   private storage: Storage, 
                  private dataService: DataService,
                  private navCtrl: NavController,
                  public apiService: ApiService) {}
                                                
      ngOnInit() {
    
        //this.storage.get('utente').then(data => { this.cod_utente = data.email });
        this.emailOther = this.dataService.getEmailOthers();
        this.emailProva = this.dataService.getEmail_Utente();
        setTimeout(() => {
          if(this.emailOther === "undefined"){    
              this.cod_utente=this.emailProva;
              console.log("email prova", this.emailProva);
          }else{    
            this.cod_utente=this.emailOther;  
            console.log("codice utente", this.cod_utente);
            this.viewDomande();
          }   
        },800)
        
      }

      ionViewWillEnter() {}

      ionViewDidEnter() {

        this.visualizzaStatitischeRisposta();
        this.visualizzaTOTStatitischeRisposta();
        this.generateColorArray(8);
        this.createBarChart();
        this.doughnutChartMethod();
        this.secondbars();
        this.sdoughnutChartMethod();
        this.lineChartMethod();
        this.Valutazioni();
        this.viewDomande();
        this.viewRisposte();
        this.viewLike();
       }

  //_________________________________________________________________

  viewDomande() {
        
    this.visualizzaStatisticheDomanda();
    this.visualizzaTOTStatisticheDomanda();
    
    this.risposteBtn = false;
    this.domandeBtn = true;
    this.likeBtn = false;

  }

  viewRisposte() {
    this.risposteBtn = true;
    this.domandeBtn = false;
    this.likeBtn = false;

    this.visualizzaStatitischeRisposta();
    this.visualizzaTOTStatitischeRisposta();
  }

  viewLike() {
    this.likeBtn = true;
    this.risposteBtn = false;
    this.domandeBtn = false;
    

    this.Valutazioni();
  }
    //_____________________________________________________________________Carica al click del segmentB
    
      goBack() {
        this.dataService.loadingView(3000);//visualizza il frame di caricamento
        this.navCtrl.back();
      }

      openMenu(){
        this.menuCrtl.open()
        console.log(this.menuCrtl.swipeGesture.length  )
       }
      //-------------------------------------------------------------------Colori random per i grafici
      generateColorArray(num) {
        this.colorArray = [];
        for (let i = 0; i < num; i++) {
          this.colorArray.push('#' + Math.floor(Math.random() * 16777215).toString(16));
        }
      }
    
      //-----------------------------------------------------------------------valutaioni
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
                      this.numLIKE[j] = valutazioni['Numero risposte']['data'].num_like;
                      this.numDISLIKE[j] = valutazioni['Numero risposte']['data'].num_dislike;  
                      this.lineChartMethod();  
                    },
                    (rej) => {                     
                    } 
                  );
                }
              )
    
            }
    
          },
          (rej) => {
          }
        )
      }
    
    
      //__________________________________________________________________
    
      //--------------------------------------------------------------------------------domande TOP 3
      async visualizzaStatisticheDomanda() {
    
        this.apiService.get_top_Domande(this.cod_utente).then( 
          (domande) => {
    
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
            this.visualizzaCategoria2();  
          },
          (rej) => {
          }
        )
      }
    
    
    //____________________________________________________________________________________CATEGORIE PER DOMANDE TOP3
    
    
      async visualizzaCategoria() {
    
        this.apiService.getCategoria(this.categoriaTOP).then(
          (categoria) => {
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
            this.categoriaText2 = categoria['Categoria']['data']['0'].titolo;
            this.createBarChart();
          },
          (rej) => {
            console.log("C'è stato un errore durante la visualizzazione");
          }
        );
      }
    
      async visualizzaCategoria2() {
        this.apiService.getCategoria(this.categoriaTOP3).then(
          (categoria) => { 
            this.categoriaText3 = categoria['Categoria']['data']['0'].titolo;
            this.createBarChart();    
          },
          (rej) => {
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
          }
    
        );
      }
    

    
    
    
      //------------------------------------------------------------------Fine domande top
      async visualizzaTOTStatisticheDomanda() {
    
        this.apiService.getDomande(this.cod_utente).then(
          (domandeT) => {
            for (let j = 0; j < domandeT['Domande']['data'].length; j++) {
              this.Dlabels[j] = domandeT['Domande']['data'][j].cod_categoria;
              this.num_domandeTot[j] = domandeT['Domande']['data'][j].num_domande;
              this.apiService.getCategoria(this.Dlabels[j]).then(
                (categoria) => {
                  this.DlabelsTitle[j] = categoria['Categoria']['data']['0'].titolo;
                  this.doughnutChartMethod();
                },
                (rej) => {
                }
              );
            }
           },
          (rej) => {
          }
        )
      }
    
    
      //---------------------------------------------------------------------------------Risposte top 3-
      async visualizzaStatitischeRisposta() {
        this.apiService.get_top_Risposte(this.cod_utente).then(
          (risposte) => {
    
            this.risposteTOP = risposte['Risposte']['data'];
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
          }
        )
      }
    
    //___________________________________________________________________TOT
      async visualizzaTOTStatitischeRisposta() {
        this.apiService.get_tot_Risposte(this.cod_utente).then(
          (risposte) => {
           
            for (let j = 0; j < risposte['Risposte']['data'].length; j++) {
              this.LabelRisposte[j] = risposte['Risposte']['data'][j].cod_categoria;
              this.num_risposteTot[j] = risposte['Risposte']['data'][j].num_risposte;
              this.apiService.getCategoria(this.LabelRisposte[j]).then(
                (categoria) => {
                  this.RisposteDlabelsTitle[j] = categoria['Categoria']['data']['0'].titolo;
                  this.sdoughnutChartMethod()
                },
                (rej) => {
                }
              );
            }
    
          },
          (rej) => {
          }
        )
      }
    
    //__________________________________________________________________________GRAFICI
    
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
                  stepSize: 1,
                  beginAtZero: true,
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
                  stepSize: 1,
                  beginAtZero: true,
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
                backgroundColor: '#008000',
                borderColor: '#008000',
                borderWidth: 1
              },
                {
                label: 'DISLIKE ▼',
                data: this.numDISLIKE,
                backgroundColor: '#dd1144', 
                borderColor: '#dd1144',
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                xAxes: [{
                  ticks: {
                    stepSize: 1,
                    beginAtZero: true,
                    
                  }
                }]
              }
            }
    
          });
        
      }
      
    
    }
    



