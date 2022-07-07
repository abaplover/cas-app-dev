import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IretencionListComponent } from './iretencion-list.component';

describe('IretencionListComponent', () => {
  let component: IretencionListComponent;
  let fixture: ComponentFixture<IretencionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IretencionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IretencionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
