import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonedaListComponent } from './moneda-list.component';

describe('MonedaListComponent', () => {
  let component: MonedaListComponent;
  let fixture: ComponentFixture<MonedaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonedaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonedaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
