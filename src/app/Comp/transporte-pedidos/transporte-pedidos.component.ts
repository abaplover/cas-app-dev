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
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';
import { MrechazoService } from 'src/app/services/mrechazo.service';

import { Mrechazo } from '../../models/mrechazo';
import * as moment from 'moment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TransportePedidosShowComponent } from './transporte-pedidos-show/transporte-pedidos-show.component';
import { ClientService } from 'src/app/services/client.service';
import { MatPaginator } from '@angular/material/paginator';
import { Zventa } from 'src/app/models/zventa';
import { Transporte } from 'src/app/models/transporte';
import { Vendedor } from 'src/app/models/vendedor';
import { P } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-transporte-pedidos',
  templateUrl: './transporte-pedidos.component.html',
  styleUrls: ['./transporte-pedidos.component.css']
})
export class TransportePedidosComponent implements OnInit {

  transporteVer = {} as TransportePedidos;
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
  public listaDetallePedido: Pedido[] = [];
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  displayedColumns: string[] = ['id', 'fecha', 'chofer', 'compania', 'placa', 'estatus', 'Opc'];

  constructor(
    public pedidoService: PedidoService,
    public loginS: FirebaseloginService,
    private toastr: ToastrService,
    public mrechazoS: MrechazoService,
    private dialogo: MatDialog,
    private clienteS: ClientService,
    public transportePedS: TransportePedidosService,
    public transporteS: TransporteService,
    public zventas: ZventaService,
    public vendedorS: VendedorService,

  ) { }

  ngOnInit(): void {

    this.getTransportes();

    this.pedidoService.getPedidosPreparados().subscribe(pedidos => {
      this.pedidosPreparados = pedidos.filter(pedido => !pedido.transporteId )
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

  async getTransportes() {
    this.transportePedidosList = await this.transportePedS.getAll();
    this.dataSource = new MatTableDataSource(this.transportePedidosList);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
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

  mostrarOcultar(event, pedi) {
    this.mostrardiv = true;
    this.pedIndex = pedi;
    this.idpedidoEli = this.pedidoslist[this.pedIndex].uid;
    this.fechapedidoEli = this.pedidoslist[this.pedIndex].fechapedido;
    this.clientepedidoEli = this.pedidoslist[this.pedIndex].nomcliente;
    this.pedidoService.mostrarForm = false;
  }

  onCancelar(pf?: NgForm) {
    if (pf != null) pf.reset();
    this.idpedidoEli = "";
    this.clientepedidoEli = "";
    this.mostrardiv = false;
  }

  onDelete(event) {
    //this.pedidoService.pedido_ =  Object.assign({}, ped);
    if (this.txtComentario != "") {
      if (this.pedIndex != -990) {
        this.pedidoslist[this.pedIndex].status = "ELIMINADO";
        this.pedidoslist[this.pedIndex].modificadopor = this.loginS.getCurrentUser().email;
        this.pedidoslist[this.pedIndex].motivorechazo = this.txtComentario;
        this.pedidoService.deletePedidos(this.pedidoslist[this.pedIndex]);
        this.toastr.show('Pedido Eliminado', 'Operación Terminada');
        this.mostrardiv = false;
      }
    }
  }

  onEdit(event, ped) {

  }//onEdit

  moForm() {
    //this.estadoElement = this.estadoElement === 'estado1' ? 'estado2' : 'estado1';

    if (this.transportePedS.mostrarForm) {
      this.transportePedS.mostrarForm = false;
    } else {
      this.transportePedS.mostrarForm = true;
    }


    this.transportePedS.txtBtnAccion = "Crear Transporte";

  }//moForm

  async openDialog(event, transporte) {
    console.log(transporte);
    const dialogConfig = new MatDialogConfig;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "100%"
    dialogConfig.width = "95%";
    dialogConfig.height = "95%"

    this.transporteVer = Object.assign({}, transporte);

    dialogConfig.data = {
      transportePedido: Object.assign({}, this.transporteVer),
      accion: event,
      pedidosPreparados: this.pedidosPreparados,
      zventaList: this.zventaList,
      vendedorList: this.vendedorList,
      transporteList: this.transporteList
    };

    const diagRef = this.dialogo.open(TransportePedidosShowComponent, dialogConfig);

    diagRef.afterClosed().subscribe(result => {
      if(result)
      switch (result.event) {
        case 'CREATE':
          this.createTransporte(result.data);
          this.getTransportes();
          break;
        case 'EDIT':
          this.UpdateTransporte(result.data);
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
    })

  }

  async getId() {
    let transporteId = await this.transportePedS.getNextId();
    return transporteId["order"];
  }

  async createTransporte(transporteInfo){
    
    let transporteId = await this.getId();
    this.listaDetallePedido = transporteInfo.transportePedidoDetalle;
    this.transportePedidos = transporteInfo.transportePedido;
    this.transportePedidos.pedido = this.listaDetallePedido;
    this.transportePedidos.id = transporteId + 1;
    this.transportePedidos.estatus = 'ACTIVO';
    this.transportePedS.create(this.transportePedidos);
  }
  UpdateTransporte(transporteInfo){

    this.listaDetallePedido = transporteInfo.transportePedidoDetalle;
    this.transportePedidos = transporteInfo.transportePedido;
    this.transportePedidos.pedido = this.listaDetallePedido;
    this.transportePedS.update(this.transportePedidos.id, this.transportePedidos);
  }

  deleteTransporte(transporteInfo){
    this.listaDetallePedido = transporteInfo.transportePedidoDetalle;
    this.transportePedidos = transporteInfo.transportePedido;
    this.transportePedidos.pedido = this.listaDetallePedido;
    
    this.transportePedS.delete(this.transportePedidos.id, this.transportePedidos);
  }
  closeTransporte(transporteInfo){
    this.listaDetallePedido = transporteInfo.transportePedidoDetalle;
    this.transportePedidos = transporteInfo.transportePedido;
    this.transportePedidos.pedido = this.listaDetallePedido;

    this.transportePedidos.estatus = 'CERRADO';
    this.transportePedS.update(this.transportePedidos.id, this.transportePedidos);
  }
  // openDialog(action, obj){

  // }


}
