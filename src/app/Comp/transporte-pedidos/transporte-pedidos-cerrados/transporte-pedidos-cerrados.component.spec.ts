import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportePedidosCerradosComponent } from './transporte-pedidos-cerrados.component';

describe('TransportePedidosCerradosComponent', () => {
  let component: TransportePedidosCerradosComponent;
  let fixture: ComponentFixture<TransportePedidosCerradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportePedidosCerradosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportePedidosCerradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
