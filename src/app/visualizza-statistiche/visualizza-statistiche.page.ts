import { Component, ViewChild } from '@angular/core';
import {Chart} from 'chart.js';
import {NavController} from "@ionic/angular";
import { ApiService } from '../providers/api.service';
import { DataService } from "../services/data.service";
import { element } from 'protractor';
import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';
import { Storage } from "@ionic/storage";
@Component({
  selector: 'app-visualizza-statistiche',
  templateUrl: './visualizza-statistiche.page.html',
  styleUrls: ['./visualizza-statistiche.page.scss'],

})

export class VisualizzaStatistichePage {



  @ViewChild('barChart', {static:false}) barChart;
  @ViewChild('doughnutCanvas', {static:false}) doughnutCanvas;
  @ViewChild('barChart2', {static:false}) barChart2;
  @ViewChild('doughnutCanvas2', {static:false}) doughnutCanvas2;
  @ViewChild('lineCanvas', {static:false}) lineCanvas;





  cod_utente = "";
  colorArray: any;

  bars: any;
  doughnutChart: any;
  sbars: any;
  sdoughnutChart: any;
  lineChart: any;
  num_domande: any;
  num_domandeTot: any = [];

  Domande = {};
  
  
  domandeTOP = new Array();
  risposteTOP = new Array();
  categorieTOP = new Array();
  CategorieA = new Array();
  Dlabels = {};
  DlabelsTitle: any = [];  
  num_domandeTOP: any;
  num_domandeTOP2: any;
  num_domandeTOP3 : any;
  num_risposteTOP: any;
  num_risposteTOP1: any;
  num_risposteTOP2 : any;
  categoriaTOP: any;
  categoriaTOP2: any;
  categoriaTOP3: any;
  categoriaText1: any;
  categoriaText2: any;
  categoriaText3: any;
  provaDomandeTOP = new Array();
  

  constructor( private storage: Storage, private dataService: DataService, private navCtrl: NavController,public apiService: ApiService) {
    
   }


   ngOnInit() {

  this.storage.get('utente').then(data => { this.cod_utente = data.email});
    
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

  }
  goBack(){
    this.navCtrl.back();
  }
//---------------Colori random per i grafici-------------------------------
    generateColorArray(num) {
      this.colorArray = [];
      for (let i = 0; i < num; i++) {
        this.colorArray.push('#' + Math.floor(Math.random() * 16777215).toString(16));
      }
    }
//--------------domande TOP 3-----------------------------------------------
async visualizzaStatisticheDomanda(){

  this.apiService.get_top_Domande(this.cod_utente).then(
    (domande) => {
     console.log("CLOG domande ", domande);

    // this.categoriaTOP = domande['Domande']['data']['0'].cod_categoria ;
    // this.categoriaTOP2 = domande['Domande']['data']['1'].cod_categoria ;
    // this.categoriaTOP2 = domande['Domande']['data']['2'].cod_categoria ;

    this.domandeTOP = domande['Domande']['data'];
    
    
    //console.log("consoleLOg2",this.domandeTOP['data'].num_domande);

        //this.num_domandeTOP=domande['Domande']['data']['0'].num_domande;
       /*  this.num_domandeTOP2=domande['Domande']['data']['1'].num_domande;
        this.num_domandeTOP3=domande['Domande']['data']['2'].num_domande; */
      let i = 0;
      this.domandeTOP.forEach(element => {
          if(i === 0){
            this.num_domandeTOP = element.num_domande;
          }
        
          if(i === 1){
            this.num_domandeTOP2 = element.num_domande;
          }
          
          if(i === 2){         
          this.num_domandeTOP3 = element.num_domande;
        }  
        i++;
      });

      let k = 0;
      this.domandeTOP.forEach(element => {
          if(k === 0){
            this.categoriaTOP = element.cod_categoria;
          }
        
          if(k === 1){
            this.categoriaTOP2 = element.cod_categoria;
            
          }
          
          if(k === 2){         
          this.categoriaTOP3 = element.cod_categoria;
        }  
        k++;
      });

        this.visualizzaCategoria();
        this.visualizzaCategoria1();
        this.visualizzaCategoria2();

    },
    (rej) => {
      console.log("C'è stato un errore durante la visualizzazione");
    }
  )
}







      
  



    async visualizzaCategoria() {
  
      this.apiService.getCategoria(this.categoriaTOP).then(
        (categoria) => {
          
          console.log("Categoria1", categoria['Categoria']['data']['0'].titolo) ;
          this.categoriaText1 = categoria['Categoria']['data']['0'].titolo;
          this.createBarChart();
         
        },
        (rej) => {
          console.log("C'è stato un errore durante la visualizzazione");
        }
      );
      }
    

      async visualizzaCategoria1(){
      this.apiService.getCategoria(this.categoriaTOP2).then(
        (categoria) => {
          
          console.log("Categoria 2", categoria['Categoria']['data']['0'].titolo) ;
          this.categoriaText2 = categoria['Categoria']['data']['0'].titolo;
          this.createBarChart();
        
          
          
         
        },
        (rej) => {
          console.log("C'è stato un errore durante la visualizzazione");
        }
      );}

      async visualizzaCategoria2(){
      this.apiService.getCategoria(this.categoriaTOP3).then(
        (categoria) => {
          
          console.log("Categoria 3", categoria['Categoria']['data']['0'].titolo) ;
          this.categoriaText3 = categoria['Categoria']['data']['0'].titolo;
          this.createBarChart();
         
        },
        (rej) => {
          console.log("C'è stato un errore durante la visualizzazione");
        }
          
      );
      }

      async visualizzaCategoriaR(){
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
      async visualizzaCategoriaR1(){
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
      async visualizzaCategoriaR2(){
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
 async visualizzaTOTStatisticheDomanda(){

  this.apiService.get_tot_Domande(this.cod_utente).then(
    (domande) => {
     
     for (let j = 0; j < domande['Domande']['data'].length; j++){
           
            this.Dlabels[j] = domande['Domande']['data'][j].cod_categoria;
            this.num_domandeTot[j] = domande['Domande']['data'][j].num_domande;
           // console.log('Il codice è', this.Dlabels[j]);
          
            
            this.apiService.getCategoria(this.Dlabels[j]).then(
              (categoria) => {
                
                //console.log("ciaoOoooOOooO", categoria['Categoria']['data']['0'].titolo) ;
                this.DlabelsTitle[j]= categoria['Categoria']['data']['0'].titolo;
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
    
      // getCategoriaArray(){
      //   for (let j = 0; j <= domande; j++){
      //     this.Dlabels[j] = this.CategorieA[j].cod_categoria;
      //   }
      //   console.log("speriamo", this.Dlabels);
      // }

      
    //----------------------Risposte top 3-------------------------------------
   async visualizzaStatitischeRisposta(){
    this.apiService.get_top_Risposte(this.cod_utente).then(
      (risposte) => {
        
       console.log("Clog RIsposte top",risposte['Risposte']);
       this.risposteTOP = risposte['Risposte']['data'];
     
       

      //  this.num_risposteTOP=this.risposteTOP['data']['0'].num_risposte;
      //  this.num_risposteTOP1=this.risposteTOP['data']['1'].num_risposte;
      //  this.num_risposteTOP2=this.risposteTOP['data']['2'].num_risposte;
      let i=0;
      this.risposteTOP.forEach(element => {
        if(i === 0){
          this.num_risposteTOP = element.num_risposte;
        }
      
        if(i === 1){
          this.num_risposteTOP1 = element.num_risposte;
        }
        
        if(i === 2){         
        this.num_risposteTOP2 = element.num_risposte;
      }  
      i++;
    });
    let k = 0;
      this.risposteTOP.forEach(element => {
          if(k === 0){
            this.categoriaTOP = element.cod_categoria;
          }
        
          if(k === 1){
            this.categoriaTOP2 = element.cod_categoria;
            
          }
          
          if(k === 2){         
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

   async visualizzaTOTStatitischeRisposta(){
    this.apiService.get_tot_Risposte(this.cod_utente).then(
      (risposteT) => {
       console.log(risposteT['Risposte']['Data']);
        
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione");
      }
    )
   }


  
  createBarChart() {
    
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: [this.categoriaText1 , this.categoriaText2 , this.categoriaText3],
          datasets: [{
            label: 'Numero di domande',
            data: [ this.num_domandeTOP , this.num_domandeTOP2,  this.num_domandeTOP3],
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
        labels: this.DlabelsTitle ,
        datasets: [{
          label: 'ciaooo',
          data:  this.num_domandeTot  ,
          backgroundColor: this.colorArray,
          hoverBackgroundColor: this.colorArray
        }]
      }
    });
  }

    secondbars() {
    this.sbars = new Chart(this.barChart2.nativeElement, {
      type: 'bar',
      data: {
        labels: [this.categoriaText1, this.categoriaText2, this.categoriaText3],
          datasets: [{
            label: 'Numero di risposte',
            data: [this.num_risposteTOP , this.num_risposteTOP1, this.num_risposteTOP2],
            backgroundColor:this.colorArray , 
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
        labels:['Filosofia', 'Informatica', 'Geografia', 'Scienze', 'Filosofia'] ,
        datasets: [{
          
          data: [8],
          backgroundColor: this.colorArray,
          hoverBackgroundColor: this.colorArray
        }]
      }
    });
  }




  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio'],
        datasets: [
          {
            label: 'Attività Totale Utente',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
            spanGaps: false,
          }
        ]
      }
    });
  }



  
}
