import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabpedidosComponent } from './tabpedidos.component';

describe('TabpedidosComponent', () => {
  let component: TabpedidosComponent;
  let fixture: ComponentFixture<TabpedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabpedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabpedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
