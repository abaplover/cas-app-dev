import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalesDeAveriasComponent } from './totales-de-averias.component';

describe('TotalesDeAveriasComponent', () => {
  let component: TotalesDeAveriasComponent;
  let fixture: ComponentFixture<TotalesDeAveriasComponent>;

  beforeEach(async(() => {
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
