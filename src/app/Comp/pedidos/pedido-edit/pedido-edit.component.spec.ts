import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PedidoEditComponent } from './pedido-edit.component';

describe('PedidoEditComponent', () => {
  let component: PedidoEditComponent;
  let fixture: ComponentFixture<PedidoEditComponent>;

  beforeEach(waitForAsync(() => {
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
