import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatoempComponent } from './datoemp.component';

describe('DatoempComponent', () => {
  let component: DatoempComponent;
  let fixture: ComponentFixture<DatoempComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatoempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatoempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
