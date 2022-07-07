import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AveriasComponent } from './averias.component';

describe('AveriasComponent', () => {
  let component: AveriasComponent;
  let fixture: ComponentFixture<AveriasComponent>;

  beforeEach(waitForAsync(() => {
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
