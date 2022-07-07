import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LprecioListComponent } from './lprecio-list.component';

describe('LprecioListComponent', () => {
  let component: LprecioListComponent;
  let fixture: ComponentFixture<LprecioListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LprecioListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LprecioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
