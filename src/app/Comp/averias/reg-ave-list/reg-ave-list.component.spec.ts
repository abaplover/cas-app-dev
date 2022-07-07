import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegAveListComponent } from './reg-ave-list.component';

describe('RegAveListComponent', () => {
  let component: RegAveListComponent;
  let fixture: ComponentFixture<RegAveListComponent>;

  beforeEach(async(() => {
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
