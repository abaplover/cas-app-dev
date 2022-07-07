import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoAlmacenComponent } from './pedido-almacen.component';

describe('PedidoAlmacenComponent', () => {
  let component: PedidoAlmacenComponent;
  let fixture: ComponentFixture<PedidoAlmacenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoAlmacenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
