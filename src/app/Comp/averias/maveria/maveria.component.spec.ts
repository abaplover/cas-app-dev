import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaveriaComponent } from './maveria.component';

describe('MaveriaComponent', () => {
  let component: MaveriaComponent;
  let fixture: ComponentFixture<MaveriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaveriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaveriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
