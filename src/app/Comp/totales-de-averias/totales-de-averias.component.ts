import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Averia } from 'src/app/models/gaveria';
import { AveriaDet } from 'src/app/models/gaveriaDet';

@Component({
  selector: 'app-totales-de-averias',
  templateUrl: './totales-de-averias.component.html',
  styleUrls: ['./totales-de-averias.component.css']
})
export class TotalesDeAveriasComponent implements OnInit, OnChanges {

  @Input() aver_: AveriaDet[] = [];
  @Input() porcentajeReclamo: any;

  totalRegistroAv: number = 0;
  totalAveria: number = 0; 
  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.totalRegistroAv = this.aver_.length;

    this.totalAveria = this.roundTo(
      this.aver_.reduce((total, row) => total + row.totalpormaterial, 0),2
    ); 
  }

  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  }
}

