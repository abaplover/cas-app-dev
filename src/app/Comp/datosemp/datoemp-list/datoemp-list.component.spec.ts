import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatoempListComponent } from './datoemp-list.component';

describe('DatoempListComponent', () => {
  let component: DatoempListComponent;
  let fixture: ComponentFixture<DatoempListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatoempListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatoempListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
