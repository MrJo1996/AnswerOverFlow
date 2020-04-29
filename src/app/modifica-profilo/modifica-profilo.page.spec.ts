import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModificaProfiloPage } from './modifica-profilo.page';

describe('ModificaProfiloPage', () => {
  let component: ModificaProfiloPage;
  let fixture: ComponentFixture<ModificaProfiloPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificaProfiloPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificaProfiloPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
