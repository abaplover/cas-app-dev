import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrechazoComponent } from './mrechazo.component';

describe('MrechazoComponent', () => {
  let component: MrechazoComponent;
  let fixture: ComponentFixture<MrechazoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrechazoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrechazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
