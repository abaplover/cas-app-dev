import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevotransportepedidoComponent } from './nuevotransportepedido.component';

describe('NuevotransportepedidoComponent', () => {
  let component: NuevotransportepedidoComponent;
  let fixture: ComponentFixture<NuevotransportepedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevotransportepedidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevotransportepedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
