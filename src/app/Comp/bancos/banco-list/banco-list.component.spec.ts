import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BancoListComponent } from './banco-list.component';

describe('BancoListComponent', () => {
  let component: BancoListComponent;
  let fixture: ComponentFixture<BancoListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BancoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BancoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
