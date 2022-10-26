import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { Pedido } from 'src/app/models/pedido';
import { Zventa } from 'src/app/models/zventa';
import { PedidoService } from 'src/app/services/pedido.service';
import { FormControl, NgForm } from '@angular/forms';

//  Service
import { ClientService } from '../../../services/client.service';
import { VendedorService } from '../../../services/vendedor.service';
import { LprecioService } from '../../../services/lprecio.service';
import { CpagoService } from '../../../services/cpago.service';
import { ProductService } from '../../../services/product.service';
import { UmedidaService } from '../../../services/umedida.service';
import { IimpuestoService } from '../../../services/iimpuesto.service';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';
import { DatoempService } from 'src/app/services/datoemp.service';
import { TransportePedidosService } from 'src/app/services/transporte-pedidos.service';
import { TransporteService } from 'src/app/services/transporte.service';
import { ZventaService } from 'src/app/services/zventa.service';
// Class
import { TransportePedidos } from 'src/app/models/transporte-pedidos';
import { Client } from '../../../models/client';
import { Vendedor } from '../../../models/vendedor';
import { Lprecio } from '../../../models/lprecio';
import { Cpago } from '../../../models/cpago';
import { Product } from '../../../models/product';
import { Umedida } from '../../../models/umedida';
import { Iimpuesto } from '../../../models/iimpuesto';
import { Datoemp } from '../../../models/datoemp';

import { MatInput } from '@angular/material/input';

// Import pdfmake and the fonts to use
import * as pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"; // fonts provided for pdfmake
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { TextAst } from '@angular/compiler';
import { snapshotChanges } from '@angular/fire/database';
import { finalize, isEmpty, map } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import * as moment from 'moment';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { Transporte } from 'src/app/models/transporte';
import { PedidoComponent } from '../../pedidos/pedido/pedido.component';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-nuevotransportepedido',
  templateUrl: './nuevotransportepedido.component.html',
  styleUrls: ['./nuevotransportepedido.component.css']
})
export class NuevotransportepedidoComponent implements OnInit {

  @ViewChild('cantidadmaterial') cantidadmaterial_: MatInput;

  public zventaList: Zventa[];
  public transporteList: Transporte[] = []; //arreglo vacio

  btnEnviar = false;
  estadoElement = "estado1";
  currencyPipeVEF = 'VEF';
  currencyPipeUSD = 'USD';
  currencyPipe: String;
  transportePedido_: TransportePedidos = { $key: '', compania: '', fecha: '', chofer: '', vehiculo: '', placa: '' };
  //pdfURL: Observable<string>;
  UploadValue: number;
  public URLPublica: any;
  //elementoBorrados: PedidoDet[]=[];

  public msj_enlace: string = 'Pedidos';
  public clienteList: Client[]; //arreglo vacio
  public vendedorList: Vendedor[]; //arreglo vacio
  public lprecioList: Lprecio[]; //arreglo vacio
  public cpagoList: Cpago[]; //arreglo vacio
  public productList: Product[]; //arreglo vacio
  public umedidaList: Umedida[]; //arreglo vacio
  public iimpuestoList: Iimpuesto[]; //arreglo vacio
  public dempresaList: Datoemp[]; //arreglo vacio

  public transportePedidos: TransportePedidos;
  public pedidosPreparados: Pedido[];
  public detallePedido: Pedido = { fpreparacion: null, nrobultos: 0, idcliente: '', nomcliente: '', nomvendedor: '', totalmontobruto: 0, totalmontoneto: 0 };
  public listaDetallePedido: Pedido[] = [];
  //public keywordCli = "idcliente";
  public keywordPed = "nrofactura";
  public keywordsCli = ['idcliente', 'descripcion'];
  public keywordVen = "idvendedor";
  valorAutCli: string;
  valorAutVen: string;
  //maxDate:Date;
  maxDate = moment(new Date()).format('YYYY-MM-DD');
  codeBlock = '';
  companyblk = '';
  //minDate = moment(new Date()).format('YYYY-MM-DD')
  start_time = moment().format('YYYY-MM-DD hh:mm:ss');
  counter = 0;
  nomCli = '';
  rifCli = '';
  tlfCli = '';
  dirCli = '';
  zonVen = '';

  constructor
    (
      public pedidoService: PedidoService,
      public zventas: ZventaService,
      public clienteS: ClientService,
      public vendedorS: VendedorService,
      public lprecioS: LprecioService,
      public cpagoS: CpagoService,
      public productS: ProductService,
      public umedidaS: UmedidaService,
      public iimpuestoS: IimpuestoService,
      public loginS: FirebaseloginService,
      public datoempresaS: DatoempService,
      public transporteS: TransporteService,
      public transportePedService: TransportePedidosService,

    ) {

  }

  //this.maxDate = new Date(currentYear, currentm, currentd);

  ngOnInit(): void {

    console.log(this.transportePedido_);
    this.pedidoService.getPedidosPreparados().subscribe(pedidos => {
      this.pedidosPreparados = pedidos;
      console.log(pedidos);
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

  }//ngOnInit

  async getId() {
    let transporteId = await this.transportePedService.getNextId();
    return transporteId["order"];
  }

  async generarpdf(pf?: NgForm) {

  }


  async onSubmit(pf?: NgForm, url?: string, pedNro?: any) {

    let ahora = new Date();
    let transporteId = await this.getId();


    this.transportePedidos = this.transportePedido_;
    this.transportePedidos.pedido = this.listaDetallePedido;
    this.transportePedidos.id = transporteId + 1;
    this.transportePedidos.estatus = 'ACTIVO';
    this.transportePedService.create(this.transportePedidos);

    this.transportePedido_ = { $key: '', compania: '', fecha: '', chofer: '', vehiculo: '', placa: '' };
    this.detallePedido = {};
    this.listaDetallePedido = [];
    this.transportePedService.mostrarForm = false;

  }//onSubmit

  @ViewChild('pedidoForm') myForm;
  resetFormFunc(field?: number) {
    this.myForm.resetForm();
    if (field == 2) {
    }
  }//resetFormfunc


  resetForm(pf?: NgForm) {
    if (confirm("¿Quieres abandonar el transporte? ")) {
      if (pf != null) pf.reset();
      this.transportePedService.mostrarForm = false;
    }

  }//resetForm

  async selectEvent(elemento) {
    console.log(elemento);
    const val = elemento.idcliente;

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
  }

  onChangeSearch(val: string) {

  }//onChangeSearch

  closeautoComplete() {
    this.detallePedido = {};
  }//closeautoComplete


  agregardetalles() {

    if (this.detallePedido)
      this.listaDetallePedido = [...this.listaDetallePedido, this.detallePedido];

    if (!this.btnEnviar)
      this.btnEnviar = true;

  }//agregardetalles

  removeDetRow(i) {

    console.log(i);

  }//removeDetRow

  async roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

}
