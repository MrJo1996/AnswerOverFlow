import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModificaRispostaPage } from './modifica-risposta.page';

describe('ModificaRispostaPage', () => {
  let component: ModificaRispostaPage;
  let fixture: ComponentFixture<ModificaRispostaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificaRispostaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificaRispostaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
