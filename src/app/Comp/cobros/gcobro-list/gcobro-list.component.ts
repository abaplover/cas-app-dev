import { Component, OnInit, ViewChild } from '@angular/core';
import { CobrosService } from 'src/app/services/cobros.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Pedido } from 'src/app/models/pedido';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';
import * as pdfMake from "pdfmake/build/pdfmake";
//  Service 
import { Cobro } from 'src/app/models/cobro';
import { CobroDet } from 'src/app/models/cobro-det';
import { VpagoService } from '../../../services/vpago.service';
import { BancoService } from '../../../services/banco.service';
//models
import { Vpago } from '../../../models/vpago';
import { Banco } from '../../../models/banco';
import { PedidoService } from 'src/app/services/pedido.service';
import { TipodocCobros } from 'src/app/models/tipodoc-cobros';
import { TipodcobrosService } from 'src/app/services/tipodcobros.service';
import * as moment from 'moment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatPaginator } from '@angular/material/paginator';
import { CustomExporter } from './custom-exporter';
import { TableUtil } from '../../../tableUtils';
import { DatePipe } from '@angular/common';
import { Util } from 'src/app/Util';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';


@Component({
  selector: 'app-gcobro-list',
  templateUrl: './gcobro-list.component.html',
  styleUrls: ['./gcobro-list.component.css']
})
export class GcobroListComponent implements OnInit {
  txtComentario = "";
  mostrardiv: boolean = false;
  pedIndex: number = -990;
  idpedidoEli: string = "";
  fechapedidoEli: Date;
  clientepedidoEli: string = "";
  montodepago = null;
  disableBSF = false;
  maxDate = moment(new Date()).format('YYYY-MM-DD');
  customExporter: CustomExporter;


  //datos de la tabla externa
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  displayedColumns: string[] = ['idpedido', 'nrofactura', 'condiciondepago', 'fpago', 'nomcliente', 'nomvendedor', 'Subtotal', 'montopendiente', 'abono', 'Opc'];

  pedidoPend_ = {} as Pedido;
  cobro0_ = {} as Cobro;
  cobro_ = {} as Cobro;
  cobroDet_ = {} as CobroDet;
  MostrarCob: string;
  vp_efectivo = true;
  pagototal = true;
  pagoparcialpagado: number = 0;
  ver: boolean;
  sendemail = false;
  importeremanente = 0;
  visual = false;

  showSpinner = false;
  totalRegistros = 0;
  totalDeuda = 0;

  public vpagoList: Vpago[]; //arreglo vacio
  public tipodocList: TipodocCobros[]; //arreglo vacio
  public bancoList: Banco[]; //arreglo vacio
  cobroslist = [];
  matrisDetCobro: Cobro[] = [];
  pedidoCobro: Pedido[];
  pedido: Pedido[];


  constructor(
    public cobroService: CobrosService,
    public loginS: FirebaseloginService,
    private toastr: ToastrService,
    public vpagoS: VpagoService,
    public tipodcobroS: TipodcobrosService,
    public bancoS: BancoService,
    public pedidoS: PedidoService,
    private afStorage: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    this.showSpinner = true;
    this.pedidoPend_ = {} as Pedido;
    // this.customExporter = new CustomExporter(); // YOU CAN BENEFIT FROM DI TOO.
    this.cargarDatos();

  }//ngOnInit

  cargarDatos() {

    // this.cobro_.fechadepago = new Date();

    this.pedidoS.getPedidosPendientes().subscribe(pedidosP => {
      this.cobroslist = pedidosP;

      this.pedidoS.getPedidosContado().subscribe(pedidos => {
        this.cobroslist.push(...pedidos);

        this.pedidoS.getPedidosPrepago().subscribe(pedidosPrepago => {

          this.cobroslist.push(...pedidosPrepago);

          let tempList = this.cobroslist.map(e => e['idpedido'])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter((e) => this.cobroslist[e]).map(e => this.cobroslist[e]);

          this.cobroslist = [...tempList];

          this.cobroslist = this.cobroslist.filter(
            cobros => (!cobros.montopendiente && cobros.montopendiente != 0)
              || (cobros.montopendiente));

          this.cobroslist.sort((x, y) => { if (x.fpago) return x.fpago.seconds - y.fpago.seconds });
          this.totalRegistros = this.cobroslist.length;
          this.totalDeuda = this.roundTo(this.cobroslist.reduce((prev, curr) => curr.montopendiente ? curr.montopendiente + prev : curr.totalmontobruto + prev, 0), 2);
          this.dataSource = new MatTableDataSource(this.cobroslist);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.showSpinner = false;
        })
      });

    })

    this.vpagoS.getVpagos().valueChanges().subscribe(vps => {
      this.vpagoList = vps;
    })

    this.tipodcobroS.getTipods().valueChanges().subscribe(tipdoc => {
      this.tipodocList = tipdoc;
    });

    this.bancoS.getBancos().valueChanges().subscribe(bc => {
      this.bancoList = bc;
    })
  }

  exportExcel() {
    console.log(this.dataSource);
    let pipe = new DatePipe('en-US');
    const cobrosPendientesArr: Partial<any>[] = this.dataSource.filteredData.map(x => ({
      Pedido: x.idpedido,
      NroFactura: x.nrofactura,
      CondicionDePago: x.condiciondepago,
      FechaDeVencimiento: pipe.transform(Util.getFecha(x.fpago), 'dd/MM/yyyy'),
      NombreCliente: x.nomcliente,
      NombreVendedor: x.nomvendedor,
      Subtotal: x.totalmontobruto,
      MontoPendiente: x.montopendiente
    }));
    TableUtil.exportArrayToExcel(cobrosPendientesArr, "CobrosPendientes");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }//applyFilter

  async verdetalles($event, elemento) {
    this.showSpinner = true;
    this.ver = true;
    this.visual = true;

    this.pedidoPend_ = Object.assign({}, elemento);

    let idpedido = this.pedidoPend_.idpedido.toString();

    if (elemento.fpago != null && typeof elemento.fpago != "undefined") {
      this.pedidoPend_.fpago = await this.timestampConvert(elemento.fpago);
    }

    this.cobroService.getCobrosDet(idpedido).subscribe(async cobrosDet => {

      this.matrisDetCobro = cobrosDet;

      this.pagoparcialpagado = 0; //reiniciamos el pago parcial para que no se embasure

      for (let i in this.matrisDetCobro) {
        if (this.matrisDetCobro[i].fechadepago) this.matrisDetCobro[i].fechadepago = await this.timestampConvert(this.matrisDetCobro[i].fechadepago);


        if (this.matrisDetCobro[i].status == "ACTIVO") {
          if (this.matrisDetCobro[i].montodepago > 0) {
            this.pagoparcialpagado += Number(this.matrisDetCobro[i].montodepago);
          } else {
            this.pagoparcialpagado += 0;
          }
        }
      }

      if (this.pagoparcialpagado > 0) {
        this.importeremanente = this.roundTo(this.pedidoPend_.totalmontoneto - this.pagoparcialpagado, 2)
        this.showSpinner = false;
      } else {
        this.importeremanente = this.pedidoPend_.totalmontoneto;
        this.showSpinner = false;
      }

    })

    if (this.pedidoPend_.idpedido) {
      this.MostrarCob = 'display:block;';
    }
  }//verdetalles

  async selectEventCob(elemento) {

    this.montodepago = null;
    this.pagoparcialpagado = 0; //reiniciamos el pago parcial para que no se embasure
    this.visual = false; //No es la parte de visualizacion

    this.pedidoPend_ = Object.assign({}, elemento);
    let idpedido = this.pedidoPend_.idpedido.toString();

    if (elemento.fpago != null && typeof elemento.fpago != "undefined") {
      this.pedidoPend_.fpago = await this.timestampConvert(elemento.fpago);
    }

    //Get Order detaills
    this.cobroService.getCobrosDet(idpedido).subscribe(async cobrosDet => {

      this.matrisDetCobro = cobrosDet;

      this.pagoparcialpagado = 0; //reiniciamos el pago parcial para que no se embasure

      //Calculamos el monto total pagado
      for (let i in this.matrisDetCobro) {
        if (this.matrisDetCobro[i].fechadepago) {
          this.matrisDetCobro[i].fechadepago = await this.timestampConvert(this.matrisDetCobro[i].fechadepago);
        }

        if (this.matrisDetCobro[i].modificado) {
          this.matrisDetCobro[i].modificado = await this.timestampConvert(this.matrisDetCobro[i].modificado);
        }


        if (this.matrisDetCobro[i].status == "ACTIVO") {
          if (this.matrisDetCobro[i].montodepago >= 0) {
            this.pagoparcialpagado += Number(this.matrisDetCobro[i].montodepago);
          } else {
            this.pagoparcialpagado += 0;
          }
        }
      }

      if (this.pagoparcialpagado > 0) {
        this.importeremanente = await this.roundTo(this.pedidoPend_.totalmontoneto - this.pagoparcialpagado, 2)
      } else {
        this.importeremanente = this.pedidoPend_.totalmontoneto;
      }

    })

    if (this.pedidoPend_.idpedido) {
      this.MostrarCob = 'display:block;';
    }

  }//selectEventCob

  moForm() {
    if (this.cobroService.mostrarForm) {
      this.cobroService.mostrarForm = false;
    } else {
      this.cobroService.mostrarForm = true;
    }
  }//moForm

  async onSubmit(pf?: NgForm, reciboUrl?: any) {
    if (this.pedidoPend_.idpedido != null) {

      let thisHour = moment().hour();
      let thisMinute = moment().minutes();

      if (this.montodepago) {
        this.cobro_.montodepago = await this.roundTo(Number(this.montodepago), 2);
      } else {
        this.cobro_.montodepago = 0;
      }

      this.pedidoPend_.totalmontoneto = await this.roundTo(Number(this.pedidoPend_.totalmontoneto), 2);
      this.pagoparcialpagado = await this.roundTo(Number(this.pagoparcialpagado), 2);

      console.log("Cobrado (true)/Negado (false): ",
        this.pedidoPend_.totalmontoneto === (Number(this.pagoparcialpagado) + Number(this.cobro_.montodepago)),
        this.pedidoPend_.totalmontoneto,
        Number(this.pagoparcialpagado),
        Number(this.cobro_.montodepago));

      if (this.pedidoPend_.totalmontoneto === (Number(this.pagoparcialpagado) + Number(this.cobro_.montodepago))) {
        // this.pedidoPend_.status = "COBRADO";
        this.pedidoPend_.statuscobro = "COMPLETADO";

      } else {
        // this.pedidoPend_.status = "ENTREGADO";
        this.pedidoPend_.statuscobro = "ABONADO";

      }

      this.pedidoPend_.lastaction = "COBRO";

      this.cobro_.fechadepago = moment(this.cobro_.fechadepago).utcOffset("-04:00").add(moment.duration(`${thisHour}:${thisMinute}:00`)).toDate();

      this.cobro_.modificado = new Date;
      this.cobro_.modificadopor = this.loginS.getCurrentUser().email;
      this.cobro_.idpedido = this.pedidoPend_.idpedido;
      this.cobro_.status = "ACTIVO";
      this.cobro_.nomcliente = this.pedidoPend_.nomcliente;
      this.cobro_.nomvendedor = this.pedidoPend_.nomvendedor;
      this.cobro_.tipodocpedido = this.pedidoPend_.tipodoc;
      this.cobro_.nrofacturapedido = this.pedidoPend_.nrofactura;
      this.cobro_.recibopagourl = reciboUrl;

      //Monto pendiente para registrar en la tabla pedidos
      this.pedidoPend_.montopendiente = this.importeremanente - this.cobro_.montodepago;
      this.pedidoPend_.pagopuntual = true;

      //Actualiza el pedido
      this.pedidoS.updatePedidos(this.pedidoPend_);
      //Registra el cobro/pago
      this.cobroService.addCobros(this.cobro_);

      this.toastr.success('Operación Terminada', 'Registro Actualizado');
      this.onCancelar(pf);
    }

  }

  //select via de pago
  vpagoselected(val) {
    console.log(this.cobro_.viadepago);
    //si no es efectivo
    if (val.substr(0, 3) != "EFE") {
      this.vp_efectivo = false;
    } else {
      this.cobro_.banco = "";
      //this.cobro_.nroreferencia="";
      this.vp_efectivo = true;
    }

    if (val.substr(0, 3) == "OLD") { //quitar
      this.cobro_.banco = "";
      //this.cobro_.nroreferencia="";
      this.vp_efectivo = true;
    }
  }//vpagoselected

  tipodocSelected(val) {
    if (val == "GE01" || val == "SP01" || val == "DC01") {
      this.vp_efectivo = true;
      this.cobro_.moneda = "USD";
      this.disableBSF = true;
    }
  }

  //Select bancos
  bancoselected(val) {
    //Buscamos en la lista de bancos el que coincida con el nombre del banco seleccionado
    // y determinamos su moneda
    let bancoSelected = this.bancoList.find(banco => banco.nombre == val);
    this.cobro_.moneda = bancoSelected.moneda;

    if (this.cobro_.moneda !== "BSF") this.disableBSF = true;
    else this.disableBSF = false;

  }

  monedaSelected(tipomoneda) {
    if (tipomoneda != "BSF") this.disableBSF = true;
    else this.disableBSF = false;
  }

  //Select tipo de pago
  tpagoselected(val) {

    if (val == "TOTAL") {
      this.cobro_.montodepago = parseFloat((this.pedidoPend_.totalmontoneto - this.pagoparcialpagado).toFixed(2));
      this.montodepago = this.cobro_.montodepago;
      this.pedidoPend_.statuscobro = "COBRADO"
      this.pagototal = true;
    }
    else if (val == "PARCIAL") {
      this.montodepago = null;
      this.pedidoPend_.statuscobro = "PARCIAL"
      this.pagototal = false;
    }
  }

  //Se ejecuta cuando ingresan un monto
  montoChanged(monto) {
    let montostring = monto;
    if (Number(montostring) > (this.importeremanente)) {
      this.montodepago = null;
    } else {
      this.montodepago == monto;
    }
  }

  async timestampConvert(fec) {
    let dateObject = new Date(fec.seconds * 1000);

    let mes_ = dateObject.getMonth() + 1;
    let ano_ = dateObject.getFullYear();
    let dia_ = dateObject.getDate();
    return dateObject;
  }//timestampConvert

  onCancelar(pf?: NgForm) {
    if (pf != null) pf.reset();
    this.cobroslist = [];
    this.cargarDatos(); //Se vuelven a cargar los datos de la tabla
    this.cobro_ = {} as Cobro;
    this.pedidoPend_ = {} as Pedido;
    this.MostrarCob = 'display:none;';
    this.pagoparcialpagado = 0;
    this.ver = false;
  }//onCancelar

  eliminarCobro(posicionArray) {
    if (confirm('¿Está seguro de que quiere eliminar este elemento?')) {

      let cobroDelete = {} as Cobro;
      cobroDelete = this.matrisDetCobro[posicionArray];
      if (this.matrisDetCobro.length == 1) {
        this.pedidoPend_.statuscobro = "PENDIENTE"
      }
      cobroDelete.status = "ELIMINADO";
      cobroDelete.modificadopor = this.loginS.getCurrentUser().email;
      cobroDelete.modificado = new Date;

      this.pedidoPend_.montopendiente = this.importeremanente + cobroDelete.montodepago;

      this.cobroService.updatecobros(cobroDelete);
      this.pedidoS.updatePedidos(this.pedidoPend_);

      this.toastr.warning('Operación Terminada', 'Registro de cobro eliminado');
    }
  }

  cancelNotifi() {
    this.cobro0_ = {} as Cobro;
    this.sendemail = false;
  }//onCancelar


  sendpopup(e) {
    this.cobro0_ = Object.assign({}, e);
    this.sendemail = true;
  }
  sendUpdate() {
    this.sendemail = true;
    //Update Cobro - 
    this.cobro0_.lastnotifsend = new Date;
    this.cobro0_.sendmail = true;
    this.cobroService.updatecobros(this.cobro0_);
    this.cancelNotifi();
    this.toastr.success('Operación Terminada', 'Se ha enviado una notificación de cobro');
  }

  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  async onImprimir(form) {
    let _cobro = {
      nrofactura: this.cobro_.nrofacturapedido,
      viadepago: this.vpagoList.find(vpago => vpago.nombre == this.cobro_.viadepago).descripcion,
      moneda: this.cobro_.moneda,
      fechadepago: new DatePipe('en-US').transform(this.cobro_.fechadepago, 'dd/MM/yyyy'),
      montodepago: this.cobro_.montodepago,
      montobsf: this.cobro_.montobsf
    };
    let pedidosDet = await new Promise<any>((resolve) => {
      this.pedidoS.getPedidosDet(this.pedidoPend_.uid).subscribe(datos => resolve(datos));
    });


    let documentDefinition = await this.cobroService.generarReciboCobro(this.pedidoPend_, pedidosDet, _cobro);
    const pdfDocGenerator0 = pdfMake.createPdf(documentDefinition);
    pdfDocGenerator0.getBase64(async (data) => {
      var file = data;
      var fileId = this.pedidoPend_.nrofactura;
      const idfile = fileId + '_' + this.cobro_.fechadepago + '_RECIBO.pdf';
      const fileRef: AngularFireStorageReference = this.afStorage.ref("Orders").child(idfile);

      const task: AngularFireUploadTask = fileRef.putString(file, 'base64') //Para guardar desde un string base6
      task.snapshotChanges().pipe(
        finalize(() => {
          // this.URLPublica = this.afStorage.ref("Orders").child(idfile).getDownloadURL();
          fileRef.getDownloadURL().subscribe(downloadURL => {
            console.log(downloadURL);
            this.cobro_.recibopagourl = downloadURL;
            // this.URLPublica = downloadURL;
            // this.onSubmit(form, downloadURL);
            console.log(downloadURL);
          });
        })
      ).subscribe();

    });//pdfDocGenerator
  }

}
