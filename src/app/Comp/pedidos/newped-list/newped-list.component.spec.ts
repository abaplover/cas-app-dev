import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpedListComponent } from './newped-list.component';

describe('NewpedListComponent', () => {
  let component: NewpedListComponent;
  let fixture: ComponentFixture<NewpedListComponent>;

  beforeEach(async(() => {
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
