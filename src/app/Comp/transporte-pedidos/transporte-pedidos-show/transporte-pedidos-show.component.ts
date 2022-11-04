import { Component, OnInit } from '@angular/core';
import { TransportePedidos } from 'src/app/models/transporte-pedidos';
import { Transporte } from 'src/app/models/transporte';
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

  cabeceraDetalle = ['N. Factura', 'Fe. Pedido', 'Fe. Entrega', 'Lista P.', 'N. Cliente', 'Nombre', 'Vendedor', 'Monto bruto', '%', 'Monto Neto', 'Bultos']
  public detallePedido: Pedido = { fpreparacion: null, nrobultos: 0, idcliente: '', nomcliente: '', nomvendedor: '', totalmontobruto: 0, totalmontoneto: 0 };
  public transporteList: Transporte[] = []; //arreglo vacio

  btnEnviar = false;
  addOperation = 'AGREGAR';
  delOperation = 'ELIMINAR';
  constructor(
    private dialogRef: MatDialogRef<TransportePedidosShowComponent>,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) data) {
    
    console.log(data);
    this.transportePedido_ = data.transportePedido;
    this.listaPedidosTransportes = data.transportePedido.pedido;
    this.pedidosPreparados = data.pedidosPreparados;
    this.listaDetallePedido = data.detallePedidos;
    this.transporteList = data.transporteList;
    this.vendedorList = data.vendedorList;
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
      this.showButton   = true;
      this.readonly     = true;
      this.delete       = true;
      this.btnEnviar    = true;
    }

    if (this.accion === 'CLOSE') {
      this.btnText        = 'Cerrar transporte';
      this.showButton     = true;
      // this.btnEnviar      = true;
      this.readonly       = true;
      this.close          = true;

    }
  }

  ngOnInit(): void {
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

    const zventas = this.vendedorList.find(vendedor => vendedor.idvendedor == elemento.idvendedor);
    const porcentaje = this.zventaList.find(zona => zona.descripcion == zventas.vzona);
    this.detallePedido.porcentaje = porcentaje.porcentaje;

    this.timestampConvert(this.detallePedido.fechapedido, 1);

    if (this.detallePedido.fentrega)
      this.timestampConvert(this.detallePedido.fentrega, 2);

    let montoneto = await this.roundTo(((elemento.totalmontobruto * this.detallePedido.porcentaje) / 100), 2);

    if (this.detallePedido.porcentaje)
      this.detallePedido.totalPorcentaje = montoneto;

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

    console.log(fec);
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

    if (this.detallePedido && !this.listaDetallePedido.includes(this.detallePedido)) {
      this.actualizarTotales(this.addOperation, this.detallePedido);
      this.listaDetallePedido = [...this.listaDetallePedido, this.detallePedido];
      this.listaPedidosTransportes = [...this.listaPedidosTransportes, {
        uid: this.detallePedido.uid,
        totalPorcentaje: this.detallePedido.totalPorcentaje,
        modStatus: this.detallePedido.modStatus
      }];
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
    this.transportePedido_.totalPedidos = this.transportePedido_.totalPedidos - 1;
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

  }

  actualizarTotales(operacion, transportePed) {

    if (operacion === this.addOperation) {

      if (this.transportePedido_.totalPedidos)
        this.transportePedido_.totalPedidos = this.transportePedido_.totalPedidos + 1;

      if (!this.transportePedido_.totalPedidos)
        this.transportePedido_.totalPedidos = 1;

      if (this.transportePedido_.comisionUSD)
        this.transportePedido_.comisionUSD = this.roundTo(this.transportePedido_.comisionUSD + transportePed.totalPorcentaje, 2);

      if (!this.transportePedido_.comisionUSD)
        this.transportePedido_.comisionUSD = transportePed.totalPorcentaje;

      if (this.transportePedido_.comisionBsF)
        this.transportePedido_.comisionBsF =
          this.roundTo((this.transportePedido_.comisionUSD * this.transportePedido_.tasa), 2);

      if (!this.transportePedido_.comisionBsF)
        this.transportePedido_.comisionBsF = this.roundTo((this.transportePedido_.comisionUSD * this.transportePedido_.tasa), 2);


      if (this.transportePedido_.totalUSD)
        this.transportePedido_.totalUSD = this.transportePedido_.totalUSD + transportePed.totalmontobruto;

      if (!this.transportePedido_.totalUSD)
        this.transportePedido_.totalUSD = transportePed.totalmontobruto;

      if (this.transportePedido_.totalBsF)
        this.transportePedido_.totalBsF = this.roundTo(
          (this.transportePedido_.totalUSD * this.transportePedido_.tasa), 2);

      if (!this.transportePedido_.totalBsF)
        this.transportePedido_.totalBsF = this.roundTo((this.transportePedido_.totalUSD * this.transportePedido_.tasa), 2);
    }

    if (operacion === this.delOperation) {

      this.transportePedido_.totalUSD = this.roundTo(this.transportePedido_.totalUSD - transportePed.totalmontobruto, 2);
      this.transportePedido_.comisionUSD = this.transportePedido_.comisionUSD - transportePed.totalmontoneto;

      this.transportePedido_.totalBsF = this.roundTo(
        this.transportePedido_.totalBsF - (transportePed.totalmontobruto * this.transportePedido_.tasa), 2);

      this.transportePedido_.comisionBsF = this.roundTo(
        this.transportePedido_.comisionBsF - (transportePed.totalmontoneto * this.transportePedido_.tasa), 2);

    }

  }

  onTasaUpdate(tasa) {

    if (tasa) {
      if (this.transportePedido_.comisionBsF)
        this.transportePedido_.comisionBsF = this.transportePedido_.comisionUSD * tasa;

      if (this.transportePedido_.totalBsF)
        this.transportePedido_.totalBsF = this.transportePedido_.totalUSD * tasa;
    }
  }

  limpiarTodo() {
    this.transportePedido_ = [];
    this.listaDetallePedido = [];
    this.listaPedidosTransportes = [];
    this.detallePedido = {};

  }
  habilitarCerrado() {

    if((!this.listaDetallePedido.some(peds => !peds.fentrega))){
      console.log("Klk")
      this.btnEnviar = true;
    }
  }

}
