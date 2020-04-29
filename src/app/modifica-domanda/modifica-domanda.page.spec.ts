import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModificaDomandaPage } from './modifica-domanda.page';

describe('ModificaDomandaPage', () => {
  let component: ModificaDomandaPage;
  let fixture: ComponentFixture<ModificaDomandaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificaDomandaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificaDomandaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
