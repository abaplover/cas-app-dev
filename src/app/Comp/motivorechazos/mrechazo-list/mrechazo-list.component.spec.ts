import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrechazoListComponent } from './mrechazo-list.component';

describe('MrechazoListComponent', () => {
  let component: MrechazoListComponent;
  let fixture: ComponentFixture<MrechazoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrechazoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrechazoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
