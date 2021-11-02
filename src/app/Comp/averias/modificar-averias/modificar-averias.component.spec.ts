import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarAveriasComponent } from './modificar-averias.component';

describe('ModificarAveriasComponent', () => {
  let component: ModificarAveriasComponent;
  let fixture: ComponentFixture<ModificarAveriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarAveriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarAveriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
