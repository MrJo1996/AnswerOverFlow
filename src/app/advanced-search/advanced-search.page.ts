import { Component, OnInit } from '@angular/core';
import { DataService } from "../services/data.service";
import { Router } from '@angular/router';
import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";
import { ApiService } from 'src/app/providers/api.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.page.html',
  styleUrls: ['./advanced-search.page.scss'],
})
export class AdvancedSearchPage implements OnInit {
  keywordToSearch;
  categoriaView;
  categoriaSettings: any = [];
  utentiBtn;

  //Filtri ricerca vars
  catFilter;
  tipoFilter;
  codCategoriaFilter;
  statusOpen: boolean = false;
  statusClosed: boolean = false;


  constructor(
    private router: Router,
    private dataService: DataService,
    private pickerController: PickerController,
    public apiService: ApiService
  ) { }

  ngOnInit() {
    this.initFilters();

    this.apiService.prendiCategorie("http://answeroverflow.altervista.org/AnswerOverFlow-BackEnd/public/index.php/ricercaCategorie").then(
      (categories) => {
        this.categoriaSettings = categories;
        console.log('Categorie visualizzate con successo.', this.categoriaSettings);
      },
      (rej) => {
        console.log("C'è stato un errore durante la visualizzazione delle categorie.");
      }
    );
  }

  //CATEGORIA PICKER
  async showCategoriaPicker() {

    let options: PickerOptions = {
      buttons: [
        {
          text: "Annulla",
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: (value: any) => {
            console.log(value);
            this.categoriaView = value['ValoreCategoriaSettata'].text;
            this.codCategoriaFilter = value['ValoreCategoriaSettata'].value;

            console.log("Cat - Cod : ", this.categoriaView, " ", this.codCategoriaFilter);

          }
        }
      ],
      columns: [{
        name: 'ValoreCategoriaSettata', //nome intestazione json dato 
        options: this.getCategorieOptions()
      }]
    };

    let picker = await this.pickerController.create(options);
    picker.present()
  }
  getCategorieOptions() {
    let options = [];
    this.categoriaSettings.forEach(x => {
      options.push({ text: x.titolo, value: x.codice_categoria });
    });
    return options;
  }

  //TIPO
  clickUtente() {
    this.utentiBtn = true;
    console.log("CLICK Utente RADIO BTN")
    this.catFilter = "utente";

    this.tipoFilter = "";
    this.codCategoriaFilter = "";
    this.statusOpen = false;
    this.statusClosed = false;
  }

  clickDomanda() {
    this.utentiBtn = false;
    console.log("CLICK Domanda RADIO BTN")
    this.catFilter = "domanda";
  }

  clickSondaggio() {
    this.utentiBtn = false;
    console.log("CLICK Sondaggio RADIO BTN")
    this.catFilter = "sondaggio";
  }

  //STATUS
  toggleOpen() {
    this.statusOpen = !this.statusOpen;
    console.log("checked Open: " + this.statusOpen);//it is working !!!
  }


  toggleClose() {
    this.statusClosed = !this.statusClosed;
    console.log("checked Close: " + this.statusClosed);//it is working !!!
  }

  //RICERCA
  ricerca() {
    /*   //Test params
      console.log("Input: ", this.keywordToSearch);
      console.log("cat filter ", this.catFilter);
      console.log("tipo filter ", this.tipoFilter);
      console.log("cod categoria filter ", this.codCategoriaFilter);
      console.log("statusOpen filter ", this.statusOpen);
      console.log("statusClosed filter ", this.statusClosed); */
    var url;
    switch (this.catFilter) {
      case "domanda":
        url = "ricercaDomandaKeyword";
        console.log(url);
        break;
      case "utente":
        url = "ricercaUserKeyword";
        console.log(url);
        break;
      case "sondaggio":
        url = "ricercaSondaggioKeyword";
        console.log(url);
        break;
    }

    this.dataService.setKeywordToSearch(this.keywordToSearch);
    this.router.navigate(['/search-results']);

  }

  initFilters() {
    this.utentiBtn = false;

    this.catFilter = "";
    this.tipoFilter = "";
    this.codCategoriaFilter = "";
    this.statusOpen = false;
    this.statusClosed = false;
  }
}
