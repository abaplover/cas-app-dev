import { Component, Input, OnInit } from '@angular/core';
import { Pedido } from 'src/app/models/pedido';

@Component({
  selector: 'app-totales-ped-cobros',
  templateUrl: './totales-ped-cobros.component.html',
  styleUrls: ['./totales-ped-cobros.component.css']
})
export class TotalesPedCobrosComponent implements OnInit {
  @Input() pedido_: Pedido[] = [];
  @Input() montousd: any;
  @Input() montopendiente: any;

  totalRegistrosPedidos: number = 0;
  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.totalRegistrosPedidos = this.pedido_.length;
  }

  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  }
}
