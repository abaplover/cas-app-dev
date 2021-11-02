import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipodListComponent } from './tipod-list.component';

describe('TipodListComponent', () => {
  let component: TipodListComponent;
  let fixture: ComponentFixture<TipodListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipodListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
