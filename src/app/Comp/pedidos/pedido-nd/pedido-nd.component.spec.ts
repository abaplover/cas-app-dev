import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PedidoNdComponent } from './pedido-nd.component';

describe('PedidoNdComponent', () => {
  let component: PedidoNdComponent;
  let fixture: ComponentFixture<PedidoNdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoNdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoNdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
