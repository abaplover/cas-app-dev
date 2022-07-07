import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstrucempresaComponent } from './estrucempresa.component';

describe('EstrucempresaComponent', () => {
  let component: EstrucempresaComponent;
  let fixture: ComponentFixture<EstrucempresaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstrucempresaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstrucempresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
