import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-termini',
  templateUrl: './termini.page.html',
  styleUrls: ['./termini.page.scss'],
})
export class TerminiPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goBack(){
    this.router.navigate(['registrazione']);
  }

}
