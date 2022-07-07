import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewpedListComponent } from './newped-list.component';

describe('NewpedListComponent', () => {
  let component: NewpedListComponent;
  let fixture: ComponentFixture<NewpedListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewpedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewpedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
