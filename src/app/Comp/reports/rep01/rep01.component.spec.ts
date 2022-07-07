import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Rep01Component } from './rep01.component';

describe('Rep01Component', () => {
  let component: Rep01Component;
  let fixture: ComponentFixture<Rep01Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Rep01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rep01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
