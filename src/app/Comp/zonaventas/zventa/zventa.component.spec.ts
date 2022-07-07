import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ZventaComponent } from './zventa.component';

describe('ZventaComponent', () => {
  let component: ZventaComponent;
  let fixture: ComponentFixture<ZventaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ZventaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZventaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
