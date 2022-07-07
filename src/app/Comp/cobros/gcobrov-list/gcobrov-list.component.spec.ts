import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcobrovListComponent } from './gcobrov-list.component';

describe('GcobrovListComponent', () => {
  let component: GcobrovListComponent;
  let fixture: ComponentFixture<GcobrovListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcobrovListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcobrovListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
