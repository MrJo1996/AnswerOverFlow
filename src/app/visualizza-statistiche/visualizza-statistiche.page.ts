import { Component, ViewChild } from '@angular/core';
import Chart from 'chart.js';
import {NavController} from "@ionic/angular";
import { ApiService } from '../providers/api.service';


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

  Domande = {};

  

  constructor(private navCtrl: NavController,public apiService: ApiService) {
    
   }
   

  ionViewDidEnter() {
    
    
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


  
  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Storia', 'Informatica', 'Scienze'],
          datasets: [{
            label: 'Numero di domande',
            data: [2 , 10 , 5],
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
          data: ['5', '12', '14', '1', '2'],
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
            data: [2 , 10 , 5],
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
          
          data: ['8', '12', '14', '2', '5' ],
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
            data: ['5', '10', '25','26','9'],
            spanGaps: false,
          }
        ]
      }
    });
  }



  
}
