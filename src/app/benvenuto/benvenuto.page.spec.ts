import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BenvenutoPage } from './benvenuto.page';

describe('BenvenutoPage', () => {
  let component: BenvenutoPage;
  let fixture: ComponentFixture<BenvenutoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenvenutoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BenvenutoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
