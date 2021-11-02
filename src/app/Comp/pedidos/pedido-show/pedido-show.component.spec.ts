import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoShowComponent } from './pedido-show.component';

describe('PedidoShowComponent', () => {
  let component: PedidoShowComponent;
  let fixture: ComponentFixture<PedidoShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
