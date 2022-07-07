import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GarticuloListComponent } from './garticulo-list.component';

describe('GarticuloListComponent', () => {
  let component: GarticuloListComponent;
  let fixture: ComponentFixture<GarticuloListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GarticuloListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GarticuloListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
