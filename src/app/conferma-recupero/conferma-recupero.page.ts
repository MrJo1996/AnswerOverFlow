import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conferma-recupero',
  templateUrl: './conferma-recupero.page.html',
  styleUrls: ['./conferma-recupero.page.scss'],
})
export class ConfermaRecuperoPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goback(){
    this.router.navigate(['recupera-password'])
  }

}
