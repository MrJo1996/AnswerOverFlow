import { Component, ViewChild } from '@angular/core';
import {Chart} from 'chart.js';
import {NavController} from "@ionic/angular";
import { ApiService } from '../providers/api.service';
import { DataService } from "../services/data.service";
import { element } from 'protractor';

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

  colorArray: any;

  bars: any;
  doughnutChart: any;
  sbars: any;
  sdoughnutChart: any;
  lineChart: any;
  num_domande: any;

  Domande = {};
  codice_categoria = 1;
  cod_utente = "gmailverificata";
  domandeTOP = new Array();
  risposteTOP = {};
  num_domandeTOP: any;
  num_domandeTOP2: any;
  num_domandeTOP3 : any;
  num_risposteTOP: any;
  num_risposteTOP1: any;
  num_risposteTOP2 : any;
  provaDomandeTOP = new Array();
  

  constructor(private dataService: DataService, private navCtrl: NavController,public apiService: ApiService) {
    
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

    generateColorArray(num) {
      this.colorArray = [];
      for (let i = 0; i < num; i++) {
        this.colorArray.push('#' + Math.floor(Math.random() * 16777215).toString(16));
      }
    }

async visualizzaStatisticheDomanda(){

  this.apiService.get_top_Domande(this.cod_utente).then(
    (domande) => {
     console.log("consoleLOg1", domande);

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


        this.createBarChart();

      
    },
    (rej) => {
      console.log("C'è stato un errore durante la visualizzazione");
    }
  )
}




async visualizzaTOTStatisticheDomanda(){

  this.apiService.get_tot_Domande(this.cod_utente).then(
    (domandeT) => {
     console.log(domandeT['Domande']['Data']);
      
    },
    (rej) => {
      console.log("C'è stato un errore durante la visualizzazione");
    }
  )
}





    async visualizzaCategoria() {
  
      this.apiService.getCategoria(this.codice_categoria).then(
        (categoria) => {
          
          console.log(categoria['Categoria']['data']['0'].titolo) ;
         
        },
        (rej) => {
          console.log("C'è stato un errore durante la visualizzazione");
        }
      );
    }
    
   async visualizzaStatitischeRisposta(){
    this.apiService.get_top_Risposte(this.cod_utente).then(
      (risposte) => {
        
       console.log(risposte['Risposte']['data']['0']['num_risposte']);
       this.risposteTOP = risposte['Risposte'];
     
       

       this.num_risposteTOP=this.risposteTOP['data']['0'].num_risposte;
       this.num_risposteTOP1=this.risposteTOP['data']['1'].num_risposte;
       this.num_risposteTOP2=this.risposteTOP['data']['2'].num_risposte;
       this.secondbars();


        
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
        labels: ['Storia', 'Informatica', 'Scienze'],
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
        labels:['Storia', 'Informatica', 'Scienze', 'Geografia', 'Filosofia'] ,
        datasets: [{
          label: 'ciaooo',
          data: [ , , ],
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
        labels: ['Filosofia', 'Informatica', 'Geografia'],
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
