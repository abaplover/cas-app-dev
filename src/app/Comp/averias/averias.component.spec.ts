import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AveriasComponent } from './averias.component';

describe('AveriasComponent', () => {
  let component: AveriasComponent;
  let fixture: ComponentFixture<AveriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AveriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AveriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
