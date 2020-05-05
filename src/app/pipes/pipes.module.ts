import { FiltroPipe } from './filtro.pipe';
import { NgModule } from '@angular/core';



@NgModule({
  declarations: [FiltroPipe],
  exports: [ FiltroPipe ]
})
export class PipesModule { }
