import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalesDeCobrosComponent } from './totales-de-cobros.component';

describe('TotalesDeCobrosComponent', () => {
  let component: TotalesDeCobrosComponent;
  let fixture: ComponentFixture<TotalesDeCobrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalesDeCobrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalesDeCobrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
