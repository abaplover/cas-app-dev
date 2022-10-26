import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportePedidosComponent } from './transporte-pedidos.component';

describe('TransportePedidosComponent', () => {
  let component: TransportePedidosComponent;
  let fixture: ComponentFixture<TransportePedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportePedidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportePedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
