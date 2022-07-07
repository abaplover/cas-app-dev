import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosCobrosComponent } from './pedidos-cobros.component';

describe('PedidosCobrosComponent', () => {
  let component: PedidosCobrosComponent;
  let fixture: ComponentFixture<PedidosCobrosComponent>;

  beforeEach(async(() => {
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
