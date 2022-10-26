import { Component, OnInit } from '@angular/core';
import { TransportePedidos } from 'src/app/models/transporte-pedidos';
import { Transporte } from 'src/app/models/transporte';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Inject } from '@angular/core';

import { Pedido } from 'src/app/models/pedido';
// Class
@Component({
  selector: 'app-transporte-pedidos-show',
  templateUrl: './transporte-pedidos-show.component.html',
  styleUrls: ['./transporte-pedidos-show.component.css']
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
  pedidosPreparados: Pedido[];
  vendedorList: any[];
  zventaList: any[];

  cabeceraDetalle = ['N. Factura', 'Fecha Despacho', 'N. Cliente', 'Nombre', 'Vendedor', 'Monto bruto', '%', 'Monto Neto', 'Bultos']
  public detallePedido: Pedido = { fpreparacion: null, nrobultos: 0, idcliente: '', nomcliente: '', nomvendedor: '', totalmontobruto: 0, totalmontoneto: 0 };
  public transporteList: Transporte[] = []; //arreglo vacio

  btnEnviar = false;

  constructor(
    private dialogRef: MatDialogRef<TransportePedidosShowComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.transportePedido_ = data.transportePedido;
    this.listaDetallePedido = data.transportePedido.pedido;
    this.pedidosPreparados = data.pedidosPreparados;
    this.transporteList = data.transporteList;
    this.vendedorList = data.vendedorList;
    this.zventaList = data.zventaList;
    this.accion = data.accion;

    if (!this.listaDetallePedido)
      this.listaDetallePedido = [];

    if (this.accion === 'CREATE') {
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

    if(this.accion === 'CLOSE'){
      this.btnText = 'Cerrar transporte';
      this.showButton = true;
      this.btnEnviar = true;
      this.readonly = true;
      this.close = true;
      
    }
    console.log(this.close);
  }

  ngOnInit(): void {
  }

  onClose() {
    this.dialogRef.close();
  }
  doAction() {
    this.dialogRef.close({
      event: this.accion,
      data: {
        transportePedido: this.transportePedido_,
        transportePedidoDetalle: this.listaDetallePedido
      }
    });
  }

  resetForm(pedidoForm) {
  }

  async selectEvent(elemento) {

    this.detallePedido = {};
    this.detallePedido = elemento;

    const zventas = this.vendedorList.find(vendedor => vendedor.idvendedor == elemento.idvendedor);
    const porcentaje = this.zventaList.find(zona => zona.descripcion == zventas.vzona);
    this.detallePedido.porcentaje = porcentaje.porcentaje;

    this.timestampConvert(this.detallePedido.fpreparacion);

    let montoneto = await this.roundTo(((elemento.totalmontobruto * this.detallePedido.porcentaje) / 100) + elemento.totalmontobruto, 2);
    if (this.detallePedido.porcentaje)
      this.detallePedido.totalmontoneto = montoneto;

  }//selectEvent
  timestampConvert(fec, col?: number) {
    let dateObject = new Date(fec.seconds * 1000);
    this.detallePedido.fpreparacion = dateObject;
    console.log(fec);
  }
  async roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  agregardetalles() {

    if (this.detallePedido && !this.listaDetallePedido.includes(this.detallePedido))
      this.listaDetallePedido = [...this.listaDetallePedido, this.detallePedido];

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
    this.listaDetallePedido.splice(i, 1);
    console.log(i);
  }

}
