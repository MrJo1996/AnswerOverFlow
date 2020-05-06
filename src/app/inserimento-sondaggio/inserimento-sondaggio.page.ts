import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-inserimento-sondaggio',
  templateUrl: './inserimento-sondaggio.page.html',
  styleUrls: ['./inserimento-sondaggio.page.scss'],
})
export class InserimentoSondaggioPage implements OnInit {

  public scelte:any=[];
  public data: boolean;
  
  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }
  goTo(){
    console.log('this.anArray',this.scelte);
    this.data=true;
    }
  Add(){
    this.scelte.push({'value':''});
    }
  
  Remove(index: any){
    this.scelte.splice(index, 1);
    }
}
