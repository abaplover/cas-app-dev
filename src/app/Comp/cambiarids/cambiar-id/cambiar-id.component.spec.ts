import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CambiarIdComponent } from './cambiar-id.component';

describe('CambiarIdComponent', () => {
  let component: CambiarIdComponent;
  let fixture: ComponentFixture<CambiarIdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CambiarIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
