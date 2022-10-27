import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TransportePedidos } from 'src/app/models/transporte-pedidos';


import { TransportePedidosService } from 'src/app/services/transporte-pedidos.service';
import { TransportePedidosShowComponent } from '../transporte-pedidos-show/transporte-pedidos-show.component';
@Component({
  selector: 'app-transporte-pedidos-cerrados',
  templateUrl: './transporte-pedidos-cerrados.component.html',
  styleUrls: ['./transporte-pedidos-cerrados.component.css']
})
export class TransportePedidosCerradosComponent implements OnInit {
  
  transporteVer = {} as TransportePedidos;
  transportePedidosList = [];
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  displayedColumns: string[] = ['id', 'fecha', 'chofer', 'compania', 'placa', 'estatus', 'Opc'];
  
  constructor(private transportesPedS: TransportePedidosService,
              private dialogo: MatDialog,) { }

  ngOnInit(): void {
    this.getTransportes();
  }

  async getTransportes() {
    this.transportePedidosList = await this.transportesPedS.getClosed();
    console.log(this.transportePedidosList);
    this.dataSource = new MatTableDataSource(this.transportePedidosList);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async openDialog(event, transporte) {
    console.log(transporte);
    const dialogConfig = new MatDialogConfig;
    // dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "100%"
    dialogConfig.maxHeight = "100%";
    dialogConfig.minHeight = "100%";
    dialogConfig.width = "100%";
    dialogConfig.height = "100%";
    // dialogConfig.panelClass = 'full-screen-modal'

    this.transporteVer = Object.assign({}, transporte);

    dialogConfig.data = {
      transportePedido: Object.assign({}, this.transporteVer),
      accion: event
    };

    const diagRef = this.dialogo.open(TransportePedidosShowComponent, dialogConfig);
  }

}
