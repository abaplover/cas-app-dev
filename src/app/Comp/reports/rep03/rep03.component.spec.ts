import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Rep03Component } from './rep03.component';

describe('Rep03Component', () => {
  let component: Rep03Component;
  let fixture: ComponentFixture<Rep03Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rep03Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rep03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
