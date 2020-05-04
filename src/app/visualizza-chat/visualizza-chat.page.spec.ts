import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VisualizzaChatPage } from './visualizza-chat.page';

describe('VisualizzaChatPage', () => {
  let component: VisualizzaChatPage;
  let fixture: ComponentFixture<VisualizzaChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizzaChatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizzaChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
