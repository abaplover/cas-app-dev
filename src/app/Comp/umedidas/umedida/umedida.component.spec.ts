import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UmedidaComponent } from './umedida.component';

describe('UmedidaComponent', () => {
  let component: UmedidaComponent;
  let fixture: ComponentFixture<UmedidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UmedidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UmedidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
