import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conferma-invio-proposta',
  templateUrl: './conferma-invio-proposta.page.html',
  styleUrls: ['./conferma-invio-proposta.page.scss'],
})
export class ConfermaInvioPropostaPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goback(){
    this.router.navigate(['proponi-categoria']);
  }

}