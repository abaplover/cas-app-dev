import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZventaListComponent } from './zventa-list.component';

describe('ZventaListComponent', () => {
  let component: ZventaListComponent;
  let fixture: ComponentFixture<ZventaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZventaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZventaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
