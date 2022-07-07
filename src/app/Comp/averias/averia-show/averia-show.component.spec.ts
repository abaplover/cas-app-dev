import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AveriaShowComponent } from './averia-show.component';

describe('AveriaShowComponent', () => {
  let component: AveriaShowComponent;
  let fixture: ComponentFixture<AveriaShowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AveriaShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AveriaShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
