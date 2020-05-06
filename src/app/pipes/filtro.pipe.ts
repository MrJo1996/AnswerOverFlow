import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(array: any[],
           text: string,
           colonna: string): any[] {

    if (text === '') {
      return array;
    }

    text.toLowerCase();

    return array.filter( item => {
      return item[colonna].toLowerCase()
              .includes( text );
    });
  }

}
