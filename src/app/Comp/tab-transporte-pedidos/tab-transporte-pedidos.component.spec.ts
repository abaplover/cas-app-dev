import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabTransportePedidosComponent } from './tab-transporte-pedidos.component';

describe('TabTransportePedidosComponent', () => {
  let component: TabTransportePedidosComponent;
  let fixture: ComponentFixture<TabTransportePedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabTransportePedidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabTransportePedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
