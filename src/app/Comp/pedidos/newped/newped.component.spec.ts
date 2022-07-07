import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpedComponent } from './newped.component';

describe('NewpedComponent', () => {
  let component: NewpedComponent;
  let fixture: ComponentFixture<NewpedComponent>;

  beforeEach(async(() => {
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
