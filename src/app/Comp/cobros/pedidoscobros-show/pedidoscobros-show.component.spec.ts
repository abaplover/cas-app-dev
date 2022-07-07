import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoscobrosShowComponent } from './pedidoscobros-show.component';

describe('PedidoscobrosShowComponent', () => {
  let component: PedidoscobrosShowComponent;
  let fixture: ComponentFixture<PedidoscobrosShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoscobrosShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoscobrosShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
