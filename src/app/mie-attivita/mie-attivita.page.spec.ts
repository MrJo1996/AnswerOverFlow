import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MieAttivitaPage } from './mie-attivita.page';

describe('MieAttivitaPage', () => {
  let component: MieAttivitaPage;
  let fixture: ComponentFixture<MieAttivitaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MieAttivitaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MieAttivitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
