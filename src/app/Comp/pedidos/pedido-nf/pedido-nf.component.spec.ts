import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PedidoNfComponent } from './pedido-nf.component';

describe('PedidoNfComponent', () => {
  let component: PedidoNfComponent;
  let fixture: ComponentFixture<PedidoNfComponent>;

  beforeEach(waitForAsync(() => {
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
