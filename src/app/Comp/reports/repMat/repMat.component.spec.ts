import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepMatComponent } from './repMat.component';

describe('Rep01Component', () => {
  let component: RepMatComponent;
  let fixture: ComponentFixture<RepMatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepMatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
