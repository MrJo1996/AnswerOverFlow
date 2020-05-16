import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VisualizzaStatistichePage } from './visualizza-statistiche.page';

describe('VisualizzaStatistichePage', () => {
  let component: VisualizzaStatistichePage;
  let fixture: ComponentFixture<VisualizzaStatistichePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizzaStatistichePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizzaStatistichePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
