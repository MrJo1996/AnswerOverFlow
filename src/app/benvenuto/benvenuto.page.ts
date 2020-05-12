import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-benvenuto',
  templateUrl: './benvenuto.page.html',
  styleUrls: ['./benvenuto.page.scss'],
})
export class BenvenutoPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  home() {
    this.router.navigate(['home']);
  }
  domanda() {
    this.router.navigate(['inserisci-domanda']);
  }
  modificaProfilo() {
    this.router.navigate(['modifica-profilo']);
  }


}
