import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TipodComponent } from './tipod.component';

describe('TipodComponent', () => {
  let component: TipodComponent;
  let fixture: ComponentFixture<TipodComponent>;

  beforeEach(waitForAsync(() => {
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
