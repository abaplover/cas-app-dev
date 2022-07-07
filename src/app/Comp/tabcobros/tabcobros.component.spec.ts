import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabcobrosComponent } from './tabcobros.component';

describe('TabcobrosComponent', () => {
  let component: TabcobrosComponent;
  let fixture: ComponentFixture<TabcobrosComponent>;

  beforeEach(async(() => {
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
