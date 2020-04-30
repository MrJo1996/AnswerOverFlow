import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VisualizzaProfiloPage } from './visualizza-profilo.page';

describe('VisualizzaProfiloPage', () => {
  let component: VisualizzaProfiloPage;
  let fixture: ComponentFixture<VisualizzaProfiloPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizzaProfiloPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizzaProfiloPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
