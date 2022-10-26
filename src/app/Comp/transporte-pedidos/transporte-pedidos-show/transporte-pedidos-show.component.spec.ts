import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportePedidosShowComponent } from './transporte-pedidos-show.component';

describe('TransportePedidosShowComponent', () => {
  let component: TransportePedidosShowComponent;
  let fixture: ComponentFixture<TransportePedidosShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportePedidosShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportePedidosShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
