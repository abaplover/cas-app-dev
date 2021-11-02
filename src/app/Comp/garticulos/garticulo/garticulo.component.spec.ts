import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GarticuloComponent } from './garticulo.component';

describe('GarticuloComponent', () => {
  let component: GarticuloComponent;
  let fixture: ComponentFixture<GarticuloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GarticuloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GarticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
