import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PedidosLayoutComponent } from './pedidos-layout.component';

describe('PedidosLayoutComponent', () => {
  let component: PedidosLayoutComponent;
  let fixture: ComponentFixture<PedidosLayoutComponent>;

  beforeEach(waitForAsync(() => {
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
