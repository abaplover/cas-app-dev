import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepClientesZonaComponent } from './rep-clientes-zona.component';

describe('RepClientesZonaComponent', () => {
  let component: RepClientesZonaComponent;
  let fixture: ComponentFixture<RepClientesZonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepClientesZonaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepClientesZonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
