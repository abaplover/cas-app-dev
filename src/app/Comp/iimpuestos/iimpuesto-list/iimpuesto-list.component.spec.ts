import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IimpuestoListComponent } from './iimpuesto-list.component';

describe('IimpuestoListComponent', () => {
  let component: IimpuestoListComponent;
  let fixture: ComponentFixture<IimpuestoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IimpuestoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IimpuestoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
