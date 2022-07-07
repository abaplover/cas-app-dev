import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LprecioComponent } from './lprecio.component';

describe('LprecioComponent', () => {
  let component: LprecioComponent;
  let fixture: ComponentFixture<LprecioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LprecioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LprecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
