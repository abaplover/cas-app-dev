import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PedidosListComponent } from './pedidos-list.component';

describe('PedidosListComponent', () => {
  let component: PedidosListComponent;
  let fixture: ComponentFixture<PedidosListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
