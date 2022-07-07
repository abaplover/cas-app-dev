import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AveriaShowComponent } from './averia-show.component';

describe('AveriaShowComponent', () => {
  let component: AveriaShowComponent;
  let fixture: ComponentFixture<AveriaShowComponent>;

  beforeEach(async(() => {
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
