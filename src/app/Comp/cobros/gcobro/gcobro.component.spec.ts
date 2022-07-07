import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GcobroComponent } from './gcobro.component';

describe('GcobroComponent', () => {
  let component: GcobroComponent;
  let fixture: ComponentFixture<GcobroComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GcobroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
