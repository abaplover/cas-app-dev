import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransporteListComponent } from './transporte-list.component';

describe('TransporteListComponent', () => {
  let component: TransporteListComponent;
  let fixture: ComponentFixture<TransporteListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransporteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransporteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
