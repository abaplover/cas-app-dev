import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpagoComponent } from './cpago.component';

describe('CpagoComponent', () => {
  let component: CpagoComponent;
  let fixture: ComponentFixture<CpagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
