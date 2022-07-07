import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TipodListComponent } from './tipod-list.component';

describe('TipodListComponent', () => {
  let component: TipodListComponent;
  let fixture: ComponentFixture<TipodListComponent>;

  beforeEach(waitForAsync(() => {
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
