import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportsAveriasComponent } from './reports-averias.component';

describe('ReportsAveriasComponent', () => {
  let component: ReportsAveriasComponent;
  let fixture: ComponentFixture<ReportsAveriasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsAveriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsAveriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
