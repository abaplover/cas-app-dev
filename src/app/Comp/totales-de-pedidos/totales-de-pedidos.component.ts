import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Pedido } from 'src/app/models/pedido';

@Component({
  selector: 'app-totales-de-pedidos',
  templateUrl: './totales-de-pedidos.component.html',
  styleUrls: ['./totales-de-pedidos.component.css'],
})
export class TotalesDePedidosComponent implements OnInit, OnChanges {
  @Input() ped_: Pedido[] = [];

  totalRegistro: number = 0;
  totalBruto: number = 0;
  totalDescuento: number = 0;
  totalNeto: number = 0;
  constructor() {}

  ngOnInit(): void {
    console.log('Total log', this.ped_);
  }

  ngOnChanges() {
    this.totalRegistro = this.ped_.length;

    this.totalBruto = this.roundTo(
      this.ped_.reduce((total, row) => total + row.totalmontobruto, 0),
      2
    );

    this.totalDescuento = this.roundTo(
      this.ped_.reduce((total, row) => total + row.totalmontodescuento, 0),
      2
    );

    this.totalNeto = this.roundTo(
      this.ped_.reduce((total, row) => total + row.totalmontoneto, 0),
      2
    );
  }

  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  }
}
