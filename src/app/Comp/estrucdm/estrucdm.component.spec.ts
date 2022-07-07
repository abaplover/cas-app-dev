import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstrucdmComponent } from './estrucdm.component';

describe('EstrucdmComponent', () => {
  let component: EstrucdmComponent;
  let fixture: ComponentFixture<EstrucdmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstrucdmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstrucdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
