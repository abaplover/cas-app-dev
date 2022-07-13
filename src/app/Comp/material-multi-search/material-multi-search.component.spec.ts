import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialMultiSearchComponent } from './material-multi-search.component';

describe('MaterialMultiSearchComponent', () => {
  let component: MaterialMultiSearchComponent;
  let fixture: ComponentFixture<MaterialMultiSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialMultiSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialMultiSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
