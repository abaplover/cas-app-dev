import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepHisVentasComponent } from './repHisVentas.component';

describe('Rep01Component', () => {
  let component: RepHisVentasComponent;
  let fixture: ComponentFixture<RepHisVentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepHisVentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepHisVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
