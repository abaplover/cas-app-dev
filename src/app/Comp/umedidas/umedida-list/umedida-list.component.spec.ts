import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UmedidaListComponent } from './umedida-list.component';

describe('UmedidaListComponent', () => {
  let component: UmedidaListComponent;
  let fixture: ComponentFixture<UmedidaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UmedidaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UmedidaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
