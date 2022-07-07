import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TabcobrosComponent } from './tabcobros.component';

describe('TabcobrosComponent', () => {
  let component: TabcobrosComponent;
  let fixture: ComponentFixture<TabcobrosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TabcobrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabcobrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
