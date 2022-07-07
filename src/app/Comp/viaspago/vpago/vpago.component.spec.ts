import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VpagoComponent } from './vpago.component';

describe('VpagoComponent', () => {
  let component: VpagoComponent;
  let fixture: ComponentFixture<VpagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VpagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VpagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
