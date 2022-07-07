import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaveriaListComponent } from './maveria-list.component';

describe('MaveriaListComponent', () => {
  let component: MaveriaListComponent;
  let fixture: ComponentFixture<MaveriaListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaveriaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaveriaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
