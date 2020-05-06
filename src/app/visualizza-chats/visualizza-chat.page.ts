import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-visualizza-chat',
  templateUrl: './visualizza-chat.page.html',
  styleUrls: ['./visualizza-chat.page.scss'],
})
export class VisualizzaChatPage implements OnInit {

  utenti: any [] = [];
  testoRicercato = '' ;
  i = 0;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getUsers()
    .subscribe(utenti => {
      console.log( utenti );
      this.utenti = utenti;
    });
  }

  ricerca( event ) {
    // console.log(event);
    this.testoRicercato = event.detail.value;
  }

  scorriAvatar() {
      this.i++;
      if(this.i = 4) this.i = 1;
      return "../../assets/img/avatar"+ this.i + ".png";
  }

}
