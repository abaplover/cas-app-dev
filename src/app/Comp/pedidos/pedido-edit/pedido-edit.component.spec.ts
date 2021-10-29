import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoEditComponent } from './pedido-edit.component';

describe('PedidoEditComponent', () => {
  let component: PedidoEditComponent;
  let fixture: ComponentFixture<PedidoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
