import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IimpuestoComponent } from './iimpuesto.component';

describe('IimpuestoComponent', () => {
  let component: IimpuestoComponent;
  let fixture: ComponentFixture<IimpuestoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IimpuestoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IimpuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
