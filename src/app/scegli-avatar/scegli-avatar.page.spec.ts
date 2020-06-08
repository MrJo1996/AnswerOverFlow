import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScegliAvatarPage } from './scegli-avatar.page';

describe('ScegliAvatarPage', () => {
  let component: ScegliAvatarPage;
  let fixture: ComponentFixture<ScegliAvatarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScegliAvatarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScegliAvatarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
