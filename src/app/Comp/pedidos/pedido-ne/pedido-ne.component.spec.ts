import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PedidoNeComponent } from './pedido-ne.component';

describe('PedidoNeComponent', () => {
  let component: PedidoNeComponent;
  let fixture: ComponentFixture<PedidoNeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoNeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoNeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
