import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PROVAPage } from './prova.page';

describe('PROVAPage', () => {
  let component: PROVAPage;
  let fixture: ComponentFixture<PROVAPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PROVAPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PROVAPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
