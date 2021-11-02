import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcobrocListComponent } from './gcobroc-list.component';

describe('GcobrocListComponent', () => {
  let component: GcobrocListComponent;
  let fixture: ComponentFixture<GcobrocListComponent>;

  beforeEach(async(() => {
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
