import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  
  profili=[{
    titolo:'MANAGER - Danilo Sprovieri',
      facebook:'',
      instagram:'https://www.instagram.com/danilosprovieri/',

  },{
      titolo:'MANAGER - Jonathan Drini',
      facebook:'',
      instagram:'https://www.instagram.com/jona96it/',
  
  },{
      titolo:'MANAGER - Michela Patullo',
      facebook:'',
      instagram:'https://www.instagram.com/mikela_patullo/',
  
  },{
      titolo:'Andrea Tosto',
      facebook:'',
      instagram:'https://www.instagram.com/andreatosto__/',

  },{
    titolo:'Christian Peluso',
    facebook:'',
    instagram:'https://www.instagram.com/cristian_conlah/',

},{
  titolo:'Davide Russo',
  facebook:'',
  instagram:'https://www.instagram.com/daviderussooo/',

},{
  titolo:'Fracesco Iafigliola',
  facebook:'',
  instagram:'https://www.instagram.com/frankiafi/',

},{
  titolo:'Mariano Buttino',
  facebook:'',
  instagram:'https://www.instagram.com/mariano_buttino/',
},{

  titolo:'Mattia Iannone',
  facebook:'',
  instagram:'https://www.instagram.com/iannonss98/',
},{

  titolo:'Luca Codipietro',
  facebook:'',
  instagram:'https://www.instagram.com/cod_j_/',
},{

  titolo:'Saverio Di Carlo',
  facebook:'',
  instagram:'https://www.instagram.com/saverio_dicarlo/',
},{

  titolo:'Simone Cassetta',
  facebook:'',
  instagram:'https://www.instagram.com/sim_tape/',
},{

  titolo:'Simone Mucci',
  facebook:'',
  instagram:'https://www.instagram.com/mucci_s/',

  }];



  constructor() { }

  ngOnInit() {
  }

}

