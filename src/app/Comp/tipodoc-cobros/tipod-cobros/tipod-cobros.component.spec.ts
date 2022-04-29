import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipodCobrosComponent } from './tipod-cobros.component';

describe('TipodCobrosComponent', () => {
  let component: TipodCobrosComponent;
  let fixture: ComponentFixture<TipodCobrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipodCobrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipodCobrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
