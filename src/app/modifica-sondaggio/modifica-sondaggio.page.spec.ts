import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModificaSondaggioPage } from './modifica-sondaggio.page';

describe('ModificaSondaggioPage', () => {
  let component: ModificaSondaggioPage;
  let fixture: ComponentFixture<ModificaSondaggioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificaSondaggioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificaSondaggioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
