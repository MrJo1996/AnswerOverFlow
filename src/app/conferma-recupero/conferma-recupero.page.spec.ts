import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfermaRecuperoPage } from './conferma-recupero.page';

describe('ConfermaRecuperoPage', () => {
  let component: ConfermaRecuperoPage;
  let fixture: ComponentFixture<ConfermaRecuperoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfermaRecuperoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfermaRecuperoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
