import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {


  constructor( private http: HttpClient ) {}
 
  getImages (keyWord: string) {
    var pexelsApiWrapper = require("pexels-api-wrapper");
    var pexelsImages = new pexelsApiWrapper ("563492ad6f917000010000014522249f8c8d49959740203b01f1ae6c");
    pexelsImages.search(keyWord, 20, 1).then(function(result){
      console.log(result);
    }).
    catch(function(e){
      console.error(e);
    });
  }

  getUsers() {
    return this.http.get<any[]>('https://jsonplaceholder.typicode.com/users');
  }

}
