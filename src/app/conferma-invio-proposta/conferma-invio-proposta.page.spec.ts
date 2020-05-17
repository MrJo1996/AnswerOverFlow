import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfermaInvioPropostaPage } from './conferma-invio-proposta.page';

describe('ConfermaInvioPropostaPage', () => {
  let component: ConfermaInvioPropostaPage;
  let fixture: ComponentFixture<ConfermaInvioPropostaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfermaInvioPropostaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfermaInvioPropostaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
