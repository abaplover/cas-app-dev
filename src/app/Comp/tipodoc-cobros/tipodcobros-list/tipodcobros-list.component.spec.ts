import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipodcobrosListComponent } from './tipodcobros-list.component';

describe('TipodcobrosListComponent', () => {
  let component: TipodcobrosListComponent;
  let fixture: ComponentFixture<TipodcobrosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipodcobrosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipodcobrosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
