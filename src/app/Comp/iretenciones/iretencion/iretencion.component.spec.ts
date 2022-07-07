import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IretencionComponent } from './iretencion.component';

describe('IretencionComponent', () => {
  let component: IretencionComponent;
  let fixture: ComponentFixture<IretencionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IretencionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IretencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
