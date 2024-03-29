import { Component, OnInit } from '@angular/core';
import { Transporte } from 'src/app/models/transporte';
import { TransportePedidosService } from 'src/app/services/transporte-pedidos.service';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Pedido } from 'src/app/models/pedido';
// Class
@Component({
  selector: 'app-transporte-pedidos-show',
  templateUrl: './transporte-pedidos-show.component.html',
  styleUrls: ['./transporte-pedidos-show.component.css'],
  providers: [DatePipe]
})
export class TransportePedidosShowComponent implements OnInit {
  accion: string;
  create: boolean;
  edit: boolean;
  delete: boolean;
  readonly: boolean = false;
  close: boolean = false;
  showButton = false;
  btnText: string;
  transportePedido_: any;
  public keywordPed = "nrofactura";
  public listaDetallePedido: Pedido[] = [];
  listaPedidosTransportes: any[] = [];
  pedidosPreparados: Pedido[];
  vendedorList: any[];
  zventaList: any[];
  clienteList: any[];
  cabeceraDetalle = ['N. Factura', 'Fe. Pedido', 'Fe. Entrega', 'Lista P.', 'N. Cliente', 'Nombre', 'Vendedor', 'Monto USD', 'Com. USD', '%', 'Monto Bsf', 'Com. Bsf', 'Bultos']
  public detallePedido: Pedido = { fpreparacion: null, nrobultos: 0, idcliente: '', nomcliente: '', nomvendedor: '', totalmontobruto: 0, totalmontoneto: 0 };
  public transporteList: Transporte[] = []; //arreglo vacio

  btnEnviar = false;
  addOperation = 'AGREGAR';
  delOperation = 'ELIMINAR';
  constructor(
    private dialogRef: MatDialogRef<TransportePedidosShowComponent>,
    private datePipe: DatePipe,
    private transporteService: TransportePedidosService,
    @Inject(MAT_DIALOG_DATA) data) {

    // console.log(data);
    this.transportePedido_ = data.transportePedido;
    this.listaPedidosTransportes = data.transportePedido.pedido;
    this.pedidosPreparados = data.pedidosPreparados;
    this.listaDetallePedido = data.detallePedidos;
    this.transporteList = data.transporteList;
    this.vendedorList = data.vendedorList;
    this.clienteList = data.clienteList;
    this.zventaList = data.zventaList;
    this.accion = data.accion;

    if (!this.listaDetallePedido)
      this.listaDetallePedido = [];

    if (!this.listaPedidosTransportes)
      this.listaPedidosTransportes = [];

    if (this.accion === 'CREATE') {
      this.listaDetallePedido = [];
      this.create = true;
      this.btnText = 'Crear transporte';
      this.showButton = true;

    }

    if (this.accion === 'EDIT') {
      this.edit = true;
      this.create = false;
      this.readonly = false;
      this.btnText = 'Actualizar transporte';
      this.showButton = true;
      this.btnEnviar = true;
    }

    if (this.accion === 'READ') {
      this.edit = false;
      this.create = false;
      this.readonly = true;
    }

    if (this.accion === 'DELETE') {
      this.btnText = 'Eliminar transporte';
      this.showButton = true;
      this.readonly = true;
      this.delete = true;
      this.btnEnviar = true;
    }

    if (this.accion === 'CLOSE') {
      this.btnText = 'Cerrar transporte';
      this.showButton = true;
      this.readonly = true;
      this.close = true;

    }
  }

  ngOnInit(): void {

    if (!this.transportePedido_.totalBultos)
      this.transportePedido_.totalBultos = this.listaDetallePedido.reduce((prev, curr) => curr.nrobultos ? prev + curr.nrobultos : prev, 0);
    this.contarPedidos();

    if (this.close)
      this.habilitarCerrado();

      this.obtenerTotales();
  }

  contarPedidos() {
    this.transportePedido_.totalPedidos =
      this.listaPedidosTransportes.filter(ped => !ped.modStatus || !ped.modStatus.deleted).length;
  }

  obtenerTotales(){
    // console.log(this.detallePedido);
    // this.detallePedido.totalmontobrutoBsf
    // = this.listaDetallePedido.filter(ped => !ped.modStatus.deleted).reduce((prev, curr) => prev + curr.totalmontobrutoBsf, 0);
    
    // console.log(this.listaDetallePedido);
  }

  onClose() {

    if (confirm("Esta seguro que desea salir de este transporte?"))
      this.dialogRef.close();
  }
  doAction() {

    this.dialogRef.close({
      event: this.accion,
      data: {
        transportePedido: this.transportePedido_,
        transportePedidoDetalle: this.listaDetallePedido,
        listaPedidos: this.listaPedidosTransportes
      }
    });
    this.limpiarTodo();
  }

  resetForm(pedidoForm) {
  }

  async selectEvent(elemento) {

    this.detallePedido = {};
    this.detallePedido = elemento;

    const zventas = this.clienteList.find(cliente => cliente.idcliente == elemento.idcliente);
    const porcentaje = this.zventaList.find(zona => zona.descripcion == zventas.zona);
    this.detallePedido.porcentaje = porcentaje.porcentaje;

    this.timestampConvert(this.detallePedido.fechapedido, 1);

    if (this.detallePedido.fentrega)
      this.timestampConvert(this.detallePedido.fentrega, 2);

    let montoneto = await this.roundTo(((elemento.totalmontobruto * this.detallePedido.porcentaje) / 100), 2);

    if (this.detallePedido.tasaDolar)
      this.detallePedido.totalmontobrutoBsf = this.roundTo(elemento.totalmontobruto * elemento.tasaDolar, 2);

    if (!this.detallePedido.tasaDolar)
      this.detallePedido.totalmontobrutoBsf = this.roundTo(elemento.totalmontobruto * this.transportePedido_.tasa, 2);

    if (this.detallePedido.porcentaje) {
      this.detallePedido.totalPorcentaje = montoneto;

      if (this.detallePedido.totalmontobrutoBsf && this.detallePedido.tasaDolar)
        this.detallePedido.totalPorcentajeBsf = this.roundTo(this.detallePedido.totalPorcentaje * this.detallePedido.tasaDolar, 2);

      if (this.detallePedido.totalmontobrutoBsf && !this.detallePedido.tasaDolar)
        this.detallePedido.totalPorcentajeBsf = this.roundTo(this.detallePedido.totalPorcentaje * this.transportePedido_.tasa, 2);
    }


  }//selectEvent
  timestampConvert(fec, col?: number) {
    let dateObject = new Date(fec.seconds * 1000);

    switch (col) {
      case 1:
        this.detallePedido.fechapedido = new Date(dateObject);
        break;
      case 2:
        this.detallePedido.fentrega = new Date(dateObject);
        break;
    }

  };
  roundTo(num: number, places: number): number {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  agregardetalles() {

    if (this.edit)
      this.detallePedido.modStatus = { style: "background-color: #00ff00", modified: true };

    if (this.create)
      this.detallePedido.modStatus = { style: "background-color:transparent" };

    if (this.detallePedido) {
      this.actualizarTotales(this.addOperation, this.detallePedido);

      if (this.listaPedidosTransportes.filter(ped => ped.uid == this.detallePedido.uid).length == 0) {
        this.listaDetallePedido = [...this.listaDetallePedido, this.detallePedido];
        this.listaPedidosTransportes = [...this.listaPedidosTransportes, {
          uid: this.detallePedido.uid,
          totalPorcentaje: this.detallePedido.totalPorcentaje,
          totalmontobrutoBsf: this.detallePedido.totalmontobrutoBsf,
          totalPorcentajeBsf: this.detallePedido.totalPorcentajeBsf,
          modStatus: this.detallePedido.modStatus
        }];
      }
      else {
        let pedIndex = this.listaDetallePedido.findIndex(ped => ped.uid == this.detallePedido.uid);
        this.listaDetallePedido[pedIndex] = this.detallePedido;
        if (this.listaPedidosTransportes[pedIndex]['modStatus'])
          this.listaPedidosTransportes[pedIndex]['modStatus'] = this.detallePedido.modStatus;
      }
      this.contarPedidos();

    }

    if (!this.btnEnviar)
      this.btnEnviar = true;

    this.detallePedido = {};

  }//agregardetalles
  closeautoComplete() {
    this.detallePedido = {};
  }//closeautoComplete

  onChangeSearch(val: string) {

  }//onChangeSearch
  removeDetRow(i) {
    // this.transportePedido_.totalPedidos = this.transportePedido_.totalPedidos - 1;
    if (this.create) {
      this.actualizarTotales(this.delOperation, this.listaDetallePedido[i])
      this.listaDetallePedido.splice(i, 1);
      this.listaPedidosTransportes.splice(i, 1);
    }

    if (this.edit && !this.listaDetallePedido[i].modStatus.deleted) {
      this.actualizarTotales(this.delOperation, this.listaDetallePedido[i])
      this.listaDetallePedido[i].modStatus = { style: "background-color:#ff3300", deleted: true };
      this.listaPedidosTransportes[i].modStatus = { style: "background-color:#ff3300", deleted: true };
    }
    this.contarPedidos();

  }

  actualizarTotales(operacion, transportePed) {

    if (operacion === this.addOperation) {

      if (this.transportePedido_.totalBultos)
        this.transportePedido_.totalBultos = this.transportePedido_.totalBultos + transportePed.nrobultos;

      if (!this.transportePedido_.totalBultos)
        this.transportePedido_.totalBultos = transportePed.nrobultos;

      if (this.transportePedido_.comisionUSD)
        this.transportePedido_.comisionUSD = this.roundTo(this.transportePedido_.comisionUSD + transportePed.totalPorcentaje, 2);

      if (!this.transportePedido_.comisionUSD)
        this.transportePedido_.comisionUSD = transportePed.totalPorcentaje;

      if (this.transportePedido_.totalUSD)
        this.transportePedido_.totalUSD = this.transportePedido_.totalUSD + transportePed.totalmontobruto;

      if (!this.transportePedido_.totalUSD)
        this.transportePedido_.totalUSD = transportePed.totalmontobruto;

      if (this.transportePedido_.comisionBsF)
        this.transportePedido_.comisionBsF =
          this.roundTo((this.transportePedido_.comisionBsF + transportePed.totalPorcentajeBsf), 2);

      if (!this.transportePedido_.comisionBsF)
        this.transportePedido_.comisionBsF = this.roundTo(transportePed.totalPorcentajeBsf, 2);


      if (this.transportePedido_.totalBsF)
        this.transportePedido_.totalBsF = this.roundTo(
          (this.transportePedido_.totalBsF + transportePed.totalmontobrutoBsf), 2);

      if (!this.transportePedido_.totalBsF)
        this.transportePedido_.totalBsF = this.roundTo((transportePed.totalmontobrutoBsf), 2);
    }

    if (operacion === this.delOperation) {

      this.transportePedido_.totalUSD = this.roundTo(this.transportePedido_.totalUSD - transportePed.totalmontobruto, 2);
      this.transportePedido_.comisionUSD = this.transportePedido_.comisionUSD - transportePed.totalPorcentaje;

      if (transportePed.totalmontobrutoBsf)
        this.transportePedido_.totalBsF = this.roundTo(
          this.transportePedido_.totalBsF - (transportePed.totalmontobrutoBsf), 2);

      if (!transportePed.totalmontobrutoBsf)
        this.transportePedido_.totalBsF = this.roundTo(
          this.transportePedido_.totalBsF - (transportePed.totalmontobruto * this.transportePedido_.tasa), 2);

      if (transportePed.totalPorcentajeBsf)
        this.transportePedido_.comisionBsF = this.roundTo(
          this.transportePedido_.comisionBsF - (transportePed.totalPorcentajeBsf), 2);

      if (!transportePed.totalPorcentajeBsf)
        this.transportePedido_.comisionBsF = this.roundTo(
          this.transportePedido_.comisionBsF - (transportePed.totalPorcentaje * this.transportePedido_.tasa), 2);

      this.transportePedido_.totalBultos = this.transportePedido_.totalBultos - transportePed.nrobultos;

    }

  }

  limpiarTodo() {
    this.transportePedido_ = [];
    this.listaDetallePedido = [];
    this.listaPedidosTransportes = [];
    this.detallePedido = {};

  }
  habilitarCerrado() {
    
    if ((!this.listaDetallePedido.filter(ped => !ped.modStatus.deleted).some(peds => !peds.fentrega))) {
      this.btnEnviar = true;
    }
  }

  pdfDownload() {
    this.transporteService.generarImpresionPdf(this.transportePedido_, this.listaDetallePedido.filter(ped => !ped.modStatus.deleted));
  }

}
