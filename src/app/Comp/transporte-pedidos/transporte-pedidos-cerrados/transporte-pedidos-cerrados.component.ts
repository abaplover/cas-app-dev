import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from 'src/app/models/client';
import { TransportePedidos } from 'src/app/models/transporte-pedidos';
import { Vendedor } from 'src/app/models/vendedor';
import { Zventa } from 'src/app/models/zventa';
import { ClientService } from 'src/app/services/client.service';
import { PedidoService } from 'src/app/services/pedido.service';


import { TransportePedidosService } from 'src/app/services/transporte-pedidos.service';
import { VendedorService } from 'src/app/services/vendedor.service';
import { ZventaService } from 'src/app/services/zventa.service';
import { TransportePedidosShowComponent } from '../transporte-pedidos-show/transporte-pedidos-show.component';
@Component({
  selector: 'app-transporte-pedidos-cerrados',
  templateUrl: './transporte-pedidos-cerrados.component.html',
  styleUrls: ['./transporte-pedidos-cerrados.component.css']
})
export class TransportePedidosCerradosComponent implements OnInit {
  public zventaList: Zventa[];
  // public transporteList: Transporte[] = []; //arreglo vacio
  public vendedorList: Vendedor[]; //arreglo vacio
  public clienteList: Client[]; //arreglo vacio
  transporteVer = {} as TransportePedidos;
  transportePedidosList = [];
  dataSource: any;
  pedidoslistDet = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  displayedColumns: string[] = ['id', 'fecha', 'chofer', 'compania', 'placa', 'estatus', 'Opc'];

  constructor(
    private transportesPedS: TransportePedidosService,
    public pedidoService: PedidoService,
    public zventas: ZventaService,
    private clienteS: ClientService,
    public vendedorS: VendedorService,
    private dialogo: MatDialog,) { }

  ngOnInit(): void {
    this.zventas.getZventas().valueChanges().subscribe(zonas => {
      this.zventaList = zonas;
    })
    this.vendedorS.getVendedors().valueChanges().subscribe(vendedor => {
      this.vendedorList = vendedor;
    });
    this.clienteS.getClients().valueChanges().subscribe(cliente => {
      this.clienteList = cliente;
    })
    this.getTransportes();
  }

  getTransportes() {
    this.transportesPedS.getClosed().subscribe(transportes => {

      this.transportePedidosList = transportes;
      this.dataSource = new MatTableDataSource(this.transportePedidosList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

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

    if (this.transporteVer.pedido) {
      this.pedidoslistDet = await this.getPedidosDetalles(this.transporteVer.pedido);
      await this.combinarDetalle();
    }

    dialogConfig.data = {
      transportePedido: Object.assign({}, this.transporteVer),
      detallePedidos: this.pedidoslistDet,
      accion: event
    };

    const diagRef = this.dialogo.open(TransportePedidosShowComponent, dialogConfig);
  }

  async getPedidosDetalles(pedidos) {

    let uidArray = pedidos.map(ped => ped.uid);

    return await this.pedidoService.getPedidosByIDs(uidArray);
  }
  async combinarDetalle() {
    this.pedidoslistDet.map(ped_ => {
      const zventas = this.clienteList.find(cliente => cliente.idcliente == ped_.idcliente);
      const porcentaje = this.zventaList.find(zona => zona.descripcion == zventas.zona);
      const pedido = this.transporteVer.pedido.find(ped => ped.uid == ped_.uid);
      ped_.porcentaje = porcentaje.porcentaje;
      ped_.modStatus = pedido.modStatus;
      if (ped_.fechapedido.seconds)
        ped_.fechapedido = new Date(ped_.fechapedido.seconds * 1000);
      if (ped_.fentrega)
        ped_.fentrega = new Date(ped_.fentrega.seconds * 1000);
      ped_.totalPorcentaje = pedido.totalPorcentaje;
    });
  }

}
