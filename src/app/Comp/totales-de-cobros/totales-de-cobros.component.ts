import { Component, Input, OnInit } from '@angular/core';
import { Cobro } from 'src/app/models/cobro';

@Component({
  selector: 'app-totales-de-cobros',
  templateUrl: './totales-de-cobros.component.html',
  styleUrls: ['./totales-de-cobros.component.css']
})
export class TotalesDeCobrosComponent implements OnInit {

  @Input() cobro_: Cobro[] = [];
  //@Input() nroregistros: any;
  @Input() montousd: any;
  @Input() montobsf: any;

  totalRegistrosCobros: number = 0;
  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.totalRegistrosCobros = this.cobro_.length;
  }

  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  }

}
