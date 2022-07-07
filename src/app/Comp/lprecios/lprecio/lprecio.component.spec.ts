import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LprecioComponent } from './lprecio.component';

describe('LprecioComponent', () => {
  let component: LprecioComponent;
  let fixture: ComponentFixture<LprecioComponent>;

  beforeEach(async(() => {
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
