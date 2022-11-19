import { Component, OnInit, ViewChild } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Pedido } from 'src/app/models/pedido';
import { TransportePedidos } from 'src/app/models/transporte-pedidos';
import { TransportePedidosService } from 'src/app/services/transporte-pedidos.service';
import { TransporteService } from 'src/app/services/transporte.service';
import { ZventaService } from 'src/app/services/zventa.service';
import { VendedorService } from 'src/app/services/vendedor.service';
import { ToastrService } from 'ngx-toastr';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';
import { MrechazoService } from 'src/app/services/mrechazo.service';

import { Mrechazo } from '../../models/mrechazo';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TransportePedidosShowComponent } from './transporte-pedidos-show/transporte-pedidos-show.component';
import { ClientService } from 'src/app/services/client.service';
import { MatPaginator } from '@angular/material/paginator';
import { Zventa } from 'src/app/models/zventa';
import { Transporte } from 'src/app/models/transporte';
import { Vendedor } from 'src/app/models/vendedor';

@Component({
  selector: 'app-transporte-pedidos',
  templateUrl: './transporte-pedidos.component.html',
  styleUrls: ['./transporte-pedidos.component.css']
})
export class TransportePedidosComponent implements OnInit {

  transporteVer: TransportePedidos = { totalUSD: 0.00, totalBsF: 0.00 };
  txtComentario = "";
  mostrardiv: boolean = false;
  pedIndex: number = -990;
  idpedidoEli: string = "";

  fechapedidoEli: Date;
  clientepedidoEli: string = "";
  pedidoslist = [];
  pedidoslistDet = [];

  transportePedidosList = [];
  public zventaList: Zventa[];
  public transporteList: Transporte[] = []; //arreglo vacio
  public vendedorList: Vendedor[]; //arreglo vacio
  public pedidosPreparados: Pedido[];
  public mrechazoList: Mrechazo[]; //arreglo vacio
  public transportePedidos: TransportePedidos;
  public listaDetallePedido: any[] = [];
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  displayedColumns: string[] = ['id', 'fecha', 'chofer', 'compania', 'placa', 'estatus', 'Opc'];

  constructor(
    public pedidoService: PedidoService,
    public loginS: FirebaseloginService,
    // private toastr: ToastrService,
    public mrechazoS: MrechazoService,
    private dialogo: MatDialog,
    // private clienteS: ClientService,
    public transportePedS: TransportePedidosService,
    public transporteS: TransporteService,
    public zventas: ZventaService,
    public vendedorS: VendedorService,

  ) { }

  ngOnInit(): void {

    this.getTransportes();

    this.pedidoService.getPedidosPreparados().subscribe(pedidos => {

      this.pedidosPreparados = pedidos.filter(pedido => !pedido.transporteId);
      //ELEMENT_DATA
    })
    this.transporteS.getTransportes().valueChanges().subscribe(tra => {
      this.transporteList = tra;
      // console.log(tra);
    })
    this.zventas.getZventas().valueChanges().subscribe(zonas => {
      this.zventaList = zonas;
    })
    this.vendedorS.getVendedors().valueChanges().subscribe(vendedor => {
      this.vendedorList = vendedor;
    });

    //ELEMENT_DATA

    this.mrechazoS.getMrechazos().valueChanges().subscribe(mrz => {
      this.mrechazoList = mrz;
    })
  }

  getTransportes() {
    this.transportePedS.getAll().subscribe(transportes => {
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

  timestampConvert(fec) {
    let dateObject = new Date(fec.seconds * 1000);
    let mes_ = dateObject.getMonth() + 1;
    let ano_ = dateObject.getFullYear();
    let dia_ = dateObject.getDate();
    this.pedidoService.pedido_.fechapedido = dateObject;
  }//timestampConvert

  timestamp2(fec) {
    let dateObject = new Date(fec.seconds * 1000);
    let d1a, m3s: string;

    d1a = dateObject.getDate().toString();
    if (dateObject.getDate() < 10) {
      d1a = "0" + dateObject.getDate().toString();
    }
    m3s = (dateObject.getMonth() + 1).toString();
    if (dateObject.getMonth() + 1 < 10) {
      m3s = "0" + (dateObject.getMonth() + 1).toString();
    }

    return dateObject.getFullYear() + "-" + m3s + "-" + d1a;
  }//timestampConvert

  async openDialog(event, transporte) {

    const dialogConfig = new MatDialogConfig;
    dialogConfig.maxWidth = "100%"
    dialogConfig.maxHeight = "100%";
    dialogConfig.minHeight = "100%";
    dialogConfig.width = "100%";
    dialogConfig.height = "100%";

    this.transporteVer = Object.assign({}, transporte);

    if (this.transporteVer.pedido) {
      this.pedidoslistDet = await this.getPedidosDetalles(this.transporteVer.pedido);
      console.log(this.pedidoslistDet);
      await this.combinarDetalle();
    }

    dialogConfig.data = {
      transportePedido: Object.assign({}, this.transporteVer),
      detallePedidos: this.pedidoslistDet,
      accion: event,
      pedidosPreparados: this.pedidosPreparados,
      zventaList: this.zventaList,
      vendedorList: this.vendedorList,
      transporteList: this.transporteList
    };

    const diagRef = this.dialogo.open(TransportePedidosShowComponent, dialogConfig);

    diagRef.afterClosed().subscribe(result => {
      if (result)
        switch (result.event) {
          case 'CREATE':
            this.createTransporte(result.data);
            this.getTransportes();
            break;
          case 'EDIT':
            this.UpdateTransporte(result.data);
            this.verificarPedEliminados(result.data);
            this.getTransportes();
            break;
          case 'DELETE':
            this.deleteTransporte(result.data);
            this.getTransportes();
          case 'CLOSE':
            this.closeTransporte(result.data);
            this.getTransportes();
            break;
        }

      this.limpiarTodo();
    });

  }

  async getId() {
    let transporteId = await this.transportePedS.getNextId();
    return transporteId["order"];
  }

  async createTransporte(transporteInfo) {

    let transporteId = await this.getId();
    this.listaDetallePedido = transporteInfo.listaPedidos;
    this.transportePedidos = transporteInfo.transportePedido;
    this.transportePedidos.pedido = this.listaDetallePedido;
    this.transportePedidos.id = transporteId + 1;
    this.transportePedidos.estatus = 'ACTIVO';

    this.pedidoslistDet = await this.getPedidosDetalles(this.listaDetallePedido);

    this.transportePedS.create(this.transportePedidos, this.pedidoslistDet);
  }
  async UpdateTransporte(transporteInfo) {
    this.listaDetallePedido = transporteInfo.listaPedidos;
    this.transportePedidos = transporteInfo.transportePedido;
    this.transportePedidos.pedido = this.listaDetallePedido;
    this.pedidoslistDet = await this.getPedidosDetalles(this.listaDetallePedido);

    this.transportePedS.update(this.transportePedidos.id, this.transportePedidos);
    this.actualizarReferenciaPedidos(transporteInfo)
  }

  async deleteTransporte(transporteInfo) {
    this.listaDetallePedido = transporteInfo.listaPedidos;
    this.transportePedidos = transporteInfo.transportePedido;
    this.transportePedidos.pedido = this.listaDetallePedido;
    this.pedidoslistDet = await this.getPedidosDetalles(this.listaDetallePedido);

    this.transportePedS.delete(this.transportePedidos.id, this.pedidoslistDet);
  }

  closeTransporte(transporteInfo) {
    this.listaDetallePedido = transporteInfo.listaPedidos;
    this.transportePedidos = transporteInfo.transportePedido;
    this.transportePedidos.pedido = this.listaDetallePedido;

    this.transportePedidos.estatus = 'CERRADO';
    this.transportePedS.update(this.transportePedidos.id, this.transportePedidos);
  }
  verificarPedEliminados(transporteInfo) {
    this.listaDetallePedido = transporteInfo.listaPedidos;

    this.listaDetallePedido.map(async (pedido) => { //iteracion de pedidos en el transporte

      if (pedido.modStatus.deleted) { // Se buscan los pedidos con estatus eliminado
        const ped_ = this.pedidoslistDet.find(ped => ped.uid == pedido.uid);
        let IsRef = await this.transportePedS.CheckPedidoRef(ped_, transporteInfo.transportePedido); //Se determina si el pedido sigue referencia al transporte

        if (IsRef) {
          this.transportePedS.UpdatePedido(ped_, ''); // Se actualizan los pedidos eliminando la referencia al transporte
        }
      }
    });
  }

  actualizarReferenciaPedidos(transporteInfo) {

    this.listaDetallePedido = transporteInfo.listaPedidos;

    this.listaDetallePedido.map(async (pedido) => { //iteracion de pedidos en el transporte

      if (pedido.modStatus.modified) { // Se buscan los pedidos con estatus eliminado
        const ped_ = this.pedidoslistDet.find(ped => ped.uid == pedido.uid);
        let IsRef = await this.transportePedS.CheckPedidoRef(ped_, transporteInfo.transportePedido); //Se determina si el pedido no tiene referencia

        if (!IsRef) {
          this.transportePedS.UpdatePedido(ped_, transporteInfo.transportePedido.id); // Se actualizan los pedidos agregando la referencia al transporte
        }
      }

    })
  }

  async getPedidosDetalles(pedidos) {

    let uidArray = pedidos.map(ped => ped.uid);

    return await this.pedidoService.getPedidosByIDs(uidArray);

  }
  async combinarDetalle() {
    console.log(this.pedidoslistDet[0]);
    this.pedidoslistDet.map(ped_ => {

      const zventas = this.vendedorList.find(vendedor => vendedor.idvendedor == ped_.idvendedor);
      const porcentaje = this.zventaList.find(zona => zona.descripcion == zventas.vzona);
      const pedido = this.transporteVer.pedido.find(ped => ped.uid == ped_.uid);

      ped_.porcentaje = porcentaje.porcentaje;
      ped_.modStatus = pedido.modStatus;

      if (ped_.fechapedido.seconds)
        ped_.fechapedido = new Date(ped_.fechapedido.seconds * 1000);

      if (ped_.fentrega)
        ped_.fentrega = new Date(ped_.fentrega.seconds * 1000);

      if (ped_.ftentrega)
        ped_.ftentrega = new Date(ped_.ftentrega.seconds * 1000);

      if (ped_.fdespacho)
        ped_.fdespacho = new Date(ped_.fdespacho.seconds * 1000);

      ped_.totalPorcentaje = pedido.totalPorcentaje;
      ped_.totalPorcentajeBsf = pedido.totalPorcentajeBsf;
      ped_.totalmontobrutoBsf = pedido.totalmontobrutoBsf;
    });
  }

  limpiarTodo() {
    this.listaDetallePedido = [];
    // this.transportePedidos = {};
    this.pedidoslistDet = [];
  }


}
