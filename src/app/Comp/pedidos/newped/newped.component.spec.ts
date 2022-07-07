import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewpedComponent } from './newped.component';

describe('NewpedComponent', () => {
  let component: NewpedComponent;
  let fixture: ComponentFixture<NewpedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewpedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewpedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
