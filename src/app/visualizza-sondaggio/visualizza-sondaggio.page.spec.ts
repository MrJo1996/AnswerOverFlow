import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VisualizzaSondaggioPage } from './visualizza-sondaggio.page';

describe('VisualizzaSondaggioPage', () => {
  let component: VisualizzaSondaggioPage;
  let fixture: ComponentFixture<VisualizzaSondaggioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizzaSondaggioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizzaSondaggioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
