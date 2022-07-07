import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendedorListComponent } from './vendedor-list.component';

describe('VendedorListComponent', () => {
  let component: VendedorListComponent;
  let fixture: ComponentFixture<VendedorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendedorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendedorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
