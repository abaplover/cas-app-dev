import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Rep02Component } from './rep02.component';

describe('Rep02Component', () => {
  let component: Rep02Component;
  let fixture: ComponentFixture<Rep02Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rep02Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rep02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
