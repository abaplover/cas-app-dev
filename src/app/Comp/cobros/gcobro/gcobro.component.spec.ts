import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcobroComponent } from './gcobro.component';

describe('GcobroComponent', () => {
  let component: GcobroComponent;
  let fixture: ComponentFixture<GcobroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcobroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
