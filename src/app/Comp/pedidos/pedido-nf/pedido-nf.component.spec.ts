import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoNfComponent } from './pedido-nf.component';

describe('PedidoNfComponent', () => {
  let component: PedidoNfComponent;
  let fixture: ComponentFixture<PedidoNfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoNfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoNfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
