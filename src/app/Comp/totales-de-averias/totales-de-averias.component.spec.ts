import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TotalesDeAveriasComponent } from './totales-de-averias.component';

describe('TotalesDeAveriasComponent', () => {
  let component: TotalesDeAveriasComponent;
  let fixture: ComponentFixture<TotalesDeAveriasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalesDeAveriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalesDeAveriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
