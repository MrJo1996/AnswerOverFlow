import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InserimentoSondaggioPage } from './inserimento-sondaggio.page';

describe('InserimentoSondaggioPage', () => {
  let component: InserimentoSondaggioPage;
  let fixture: ComponentFixture<InserimentoSondaggioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserimentoSondaggioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InserimentoSondaggioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
