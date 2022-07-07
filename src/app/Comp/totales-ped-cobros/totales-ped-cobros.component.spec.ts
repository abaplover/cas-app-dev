import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalesPedCobrosComponent } from './totales-ped-cobros.component';

describe('TotalesPedCobrosComponent', () => {
  let component: TotalesPedCobrosComponent;
  let fixture: ComponentFixture<TotalesPedCobrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalesPedCobrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalesPedCobrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
