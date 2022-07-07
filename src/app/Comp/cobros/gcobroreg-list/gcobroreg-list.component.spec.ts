import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcobroregListComponent } from './gcobroreg-list.component';

describe('GcobroregListComponent', () => {
  let component: GcobroregListComponent;
  let fixture: ComponentFixture<GcobroregListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcobroregListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcobroregListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
