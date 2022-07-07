import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CerrarAveriasComponent } from './cerrar-averias.component';

describe('CerrarAveriasComponent', () => {
  let component: CerrarAveriasComponent;
  let fixture: ComponentFixture<CerrarAveriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CerrarAveriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CerrarAveriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
