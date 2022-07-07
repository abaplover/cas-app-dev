import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Rep04Component } from './rep04.component';

describe('Rep04Component', () => {
  let component: Rep04Component;
  let fixture: ComponentFixture<Rep04Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rep04Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rep04Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
