import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsAveriasComponent } from './reports-averias.component';

describe('ReportsAveriasComponent', () => {
  let component: ReportsAveriasComponent;
  let fixture: ComponentFixture<ReportsAveriasComponent>;

  beforeEach(async(() => {
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
