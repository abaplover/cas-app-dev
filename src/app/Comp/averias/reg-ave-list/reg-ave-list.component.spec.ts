import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegAveListComponent } from './reg-ave-list.component';

describe('RegAveListComponent', () => {
  let component: RegAveListComponent;
  let fixture: ComponentFixture<RegAveListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegAveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegAveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
