import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GcobrocListComponent } from './gcobroc-list.component';

describe('GcobrocListComponent', () => {
  let component: GcobrocListComponent;
  let fixture: ComponentFixture<GcobrocListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GcobrocListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcobrocListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
