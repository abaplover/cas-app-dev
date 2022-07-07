import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PedidosCobrosComponent } from './pedidos-cobros.component';

describe('PedidosCobrosComponent', () => {
  let component: PedidosCobrosComponent;
  let fixture: ComponentFixture<PedidosCobrosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosCobrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosCobrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
