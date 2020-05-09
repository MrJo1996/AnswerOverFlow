import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TerminiPage } from './termini.page';

describe('TerminiPage', () => {
  let component: TerminiPage;
  let fixture: ComponentFixture<TerminiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TerminiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
