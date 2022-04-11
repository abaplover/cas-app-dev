import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Averia } from 'src/app/models/gaveria';

@Component({
  selector: 'app-totales-de-averias',
  templateUrl: './totales-de-averias.component.html',
  styleUrls: ['./totales-de-averias.component.css']
})
export class TotalesDeAveriasComponent implements OnInit, OnChanges {

  @Input() aver_: Averia[] = [];

  totalRegistroAv: number = 0;
  /* totalBruto: number = 0;
  totalDescuento: number = 0;
  totalNeto: number = 0; */
  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.totalRegistroAv = this.aver_.length;

    /* this.totalBruto = this.roundTo(
      this.aver_.reduce((total, row) => total + row.totalmontobruto, 0),
      2
    );

    this.totalDescuento = this.roundTo(
      this.aver_.reduce((total, row) => total + row.totalmontodescuento, 0),
      2
    );

    this.totalNeto = this.roundTo(
      this.aver_.reduce((total, row) => total + row.totalmontoneto, 0),
      2
    ); */
  }

  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  }
}

