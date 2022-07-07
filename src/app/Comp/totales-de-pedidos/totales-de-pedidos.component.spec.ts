import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TotalesDePedidosComponent } from './totales-de-pedidos.component';

describe('TotalesDePedidosComponent', () => {
  let component: TotalesDePedidosComponent;
  let fixture: ComponentFixture<TotalesDePedidosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalesDePedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalesDePedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
