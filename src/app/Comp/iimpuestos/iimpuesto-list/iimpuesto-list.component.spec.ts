import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IimpuestoListComponent } from './iimpuesto-list.component';

describe('IimpuestoListComponent', () => {
  let component: IimpuestoListComponent;
  let fixture: ComponentFixture<IimpuestoListComponent>;

  beforeEach(waitForAsync(() => {
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
