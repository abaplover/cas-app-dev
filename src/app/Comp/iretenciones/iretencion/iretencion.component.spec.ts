import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IretencionComponent } from './iretencion.component';

describe('IretencionComponent', () => {
  let component: IretencionComponent;
  let fixture: ComponentFixture<IretencionComponent>;

  beforeEach(async(() => {
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
