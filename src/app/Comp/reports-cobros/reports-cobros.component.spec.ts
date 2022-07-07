import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsCobrosComponent } from './reports-cobros.component';

describe('ReportsCobrosComponent', () => {
  let component: ReportsCobrosComponent;
  let fixture: ComponentFixture<ReportsCobrosComponent>;

  beforeEach(async(() => {
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
