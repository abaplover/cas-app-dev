import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransporteComponent } from './transporte.component';

describe('TransporteComponent', () => {
  let component: TransporteComponent;
  let fixture: ComponentFixture<TransporteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
