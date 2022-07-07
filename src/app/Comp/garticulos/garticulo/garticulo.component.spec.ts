import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GarticuloComponent } from './garticulo.component';

describe('GarticuloComponent', () => {
  let component: GarticuloComponent;
  let fixture: ComponentFixture<GarticuloComponent>;

  beforeEach(waitForAsync(() => {
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
