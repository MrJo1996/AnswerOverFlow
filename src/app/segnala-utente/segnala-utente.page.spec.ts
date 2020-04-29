import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SegnalaUtentePage } from './segnala-utente.page';

describe('SegnalaUtentePage', () => {
  let component: SegnalaUtentePage;
  let fixture: ComponentFixture<SegnalaUtentePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegnalaUtentePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SegnalaUtentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
