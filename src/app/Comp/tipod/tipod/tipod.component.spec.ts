import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipodComponent } from './tipod.component';

describe('TipodComponent', () => {
  let component: TipodComponent;
  let fixture: ComponentFixture<TipodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
