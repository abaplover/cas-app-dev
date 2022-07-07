import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportsCobrosComponent } from './reports-cobros.component';

describe('ReportsCobrosComponent', () => {
  let component: ReportsCobrosComponent;
  let fixture: ComponentFixture<ReportsCobrosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsCobrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsCobrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
