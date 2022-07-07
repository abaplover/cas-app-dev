import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GeneralReportComponent } from './general-report.component';

describe('GeneralReportComponent', () => {
  let component: GeneralReportComponent;
  let fixture: ComponentFixture<GeneralReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
