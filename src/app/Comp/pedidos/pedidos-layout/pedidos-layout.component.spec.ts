import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosLayoutComponent } from './pedidos-layout.component';

describe('PedidosLayoutComponent', () => {
  let component: PedidosLayoutComponent;
  let fixture: ComponentFixture<PedidosLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
