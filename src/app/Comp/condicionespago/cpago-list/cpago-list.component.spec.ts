import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CpagoListComponent } from './cpago-list.component';

describe('CpagoListComponent', () => {
  let component: CpagoListComponent;
  let fixture: ComponentFixture<CpagoListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CpagoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpagoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
