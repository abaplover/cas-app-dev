import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClientAutoCompleteComponent } from './client-auto-complete.component';

describe('ClientAutoCompleteComponent', () => {
  let component: ClientAutoCompleteComponent;
  let fixture: ComponentFixture<ClientAutoCompleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAutoCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
