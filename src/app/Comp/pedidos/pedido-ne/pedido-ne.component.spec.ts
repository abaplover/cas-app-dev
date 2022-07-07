import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoNeComponent } from './pedido-ne.component';

describe('PedidoNeComponent', () => {
  let component: PedidoNeComponent;
  let fixture: ComponentFixture<PedidoNeComponent>;

  beforeEach(async(() => {
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
