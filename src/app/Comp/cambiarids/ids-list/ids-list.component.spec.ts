import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdsListComponent } from './ids-list.component';

describe('IdsListComponent', () => {
  let component: IdsListComponent;
  let fixture: ComponentFixture<IdsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
