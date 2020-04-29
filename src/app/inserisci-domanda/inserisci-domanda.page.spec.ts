import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InserisciDomandaPage } from './inserisci-domanda.page';

describe('InserisciDomandaPage', () => {
  let component: InserisciDomandaPage;
  let fixture: ComponentFixture<InserisciDomandaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserisciDomandaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InserisciDomandaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
