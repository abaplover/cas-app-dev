import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, InjectionToken, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { CollectionReference } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Client } from 'src/app/models/client';
import { Cobro } from 'src/app/models/cobro';
import { Cpago } from 'src/app/models/cpago';
import { Pedido } from 'src/app/models/pedido';
import { Vendedor } from 'src/app/models/vendedor';
import { ClientService } from 'src/app/services/client.service';
import { CobrosService } from 'src/app/services/cobros.service';
import { CpagoService } from 'src/app/services/cpago.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { VendedorService } from 'src/app/services/vendedor.service';
import { PedidoscobrosShowComponent } from '../../cobros/pedidoscobros-show/pedidoscobros-show.component';

@Component({
  selector: 'app-pedidos-cobros',
  templateUrl: './pedidos-cobros.component.html',
  styleUrls: ['./pedidos-cobros.component.css']
})
export class PedidosCobrosComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;


  DEFAULT_CURRENCY_CODE: InjectionToken<string>;

  maxDated: Date;
  maxDateh: Date;
  minDateh: Date;
  desD: Date;
  hasT: Date;
  today = moment().toDate();

  staTus: any;
  codCli: string;
  codVen: string;
  conPag: any;
  opcpedidosCobrosRep = false;
  
  pedidoVer_ = {} as Pedido;
  visual = false;

  totalRegistro: number = 0;
  totalBruto: number = 0;
  totalDescuento: number = 0;
  totalNeto: number = 0;
  firstTime: boolean = false;

  montototalUSD = 0;
  montototalPendiente = 0;

  pagoparcialpagado:number = 0;

  public clienteList: Client[]; //arreglo vacio
  public vendedorList: Vendedor[]; //arreglo vacio
  public cpagoList: Cpago[]; //arreglo vacio
  public Ped_: Pedido[]; //arreglo vacio

  dtInstance: any;

  matrisDetCobro: Cobro[]=[];
  pedidoPend_ = {} as Pedido;
  MostrarCob: string;
  importeremanente = 0;

  showSpinner = false;
  
  //data table
  dtOptionsAv: any = {
    pagingType: 'full_numbers',
    pageLength: 30,
    ordering : true,
    language: {
      url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json'
    },
    bInfo : false,
    processing: true,
    dom: 'Bfrtip',
    buttons: [
      'copy', {extend: 'excelHtml5',
      text: 'Excel',
      customizeData: function(data) {
        //Recorremos todas las filas de la tabla
        for(var i = 0; i < data.body.length; i++) {
          //Quitamos los puntos como separador de miles 
          //y las comas de los decimaleslas cambiamos por puntos
          data.body[i][8] = data.body[i][8].replace( ".", "" );
          data.body[i][8] = data.body[i][8].replace( ",", "." );
          data.body[i][9] = data.body[i][9].replace( ".", "" );
          data.body[i][9] = data.body[i][9].replace( ",", "." );
        }
      }}, 'pdf', 'print'
    ]
  };

  dtTrigger = new Subject<any>();
  data: any;
  //-----------------------------------------------------------
  //data table

  constructor
    (
      public clienteS: ClientService,
      public vendedorS: VendedorService,
      public cobroService: CobrosService,
      public cpagoS: CpagoService,
      public pedidoS: PedidoService,
      private http: HttpClient,
      private dialogo: MatDialog,
      public chRes: ChangeDetectorRef
  ) {

  }//constructor

  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  ngOnInit(): void {

    const currentYear = new Date().getFullYear();
    const currentm = new Date().getMonth();
    const currentd = new Date().getDate();

    
    this.pedidoPend_ = {} as Pedido;

    this.maxDated = new Date(currentYear, currentm, currentd);
    this.maxDateh = new Date(currentYear, currentm, currentd);
    this.minDateh = new Date(currentYear, currentm, currentd);

    this.clienteS.getClients().valueChanges().subscribe(cs => {
      this.clienteList = cs;
    })

    this.vendedorS.getVendedors().valueChanges().subscribe(vs => {
      this.vendedorList = vs;
    })

    this.firstTime = true;

  }//ngOnInit

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.firstTime = false;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }//ngOnDestroy

  public orgValueChange(event): void {
    if (event != "") {
      this.minDateh = new Date(event.value);
    }
  }//orgValueChange

  regresar() {
    this.opcpedidosCobrosRep = false;
    this.codCli = null;
  }

  onBookChange(event) {
    if (event.value == "") {
      //console.log('vacio',event.value);
    } else {
      //console.log(event.value);
    }
  }
  onSubmitSearch(pf?: NgForm) {
    this.showSpinner = true;
    let query: any;
    let hora = new Date().getHours();
    hora = 24 - hora;
    this.hasT.setHours(new Date().getHours() + hora - 1);

    this.Ped_ = [];

    query = (ref: CollectionReference) => {
      let q = ref.where("fechapedido", ">=", this.desD)
        .where("fechapedido", "<=", this.hasT)
        .where("status","in",['ENTREGADO','COBRADO'])
        .orderBy("fechapedido", "desc")
        .orderBy("creado", "desc")
        .limit(5000)

      if (typeof this.codCli == "undefined" || this.codCli == null) { } else {
        q = q.where("idcliente", "==", this.codCli)
      }
      if (typeof this.codVen == "undefined" || this.codVen == null) { } else {
        q = q.where("nomvendedor", "==", this.codVen)
      }
      return q;
    }

    this.pedidoS.getPedidosReporteCobros(query).subscribe(ped => {
      
      this.Ped_ = ped;

      this.montototalUSD = 0;
      this.montototalPendiente = 0;

      this.Ped_.forEach(ped => {
        if(this.timestampConvert(ped.fpago) < this.today) ped.fvencida = true;
        //Se hace el cambio a null porque en html no me permitia comparar con undefined
        if(ped.pagopuntual == undefined ) ped.pagopuntual = null;

        this.montototalUSD += Number(ped.totalmontoneto);

        if(ped.montopendiente) {
          this.montototalPendiente += Number(ped.montopendiente)
        } else {
          this.montototalPendiente += 0;
        }
      });

      if(!this.firstTime){
        this.rerender();
      }

      
      setTimeout(() => {
        this.showSpinner = false;
      }, 500);
    })
    this.opcpedidosCobrosRep = true;


  }//onSubmitSearch

  timestampConvert(fec) {
    let dateObject = new Date(fec.seconds * 1000);
    let mes_ = dateObject.getMonth() + 1;
    let ano_ = dateObject.getFullYear();
    let dia_ = dateObject.getDate();
    return dateObject;
  }//timestampConvert

  verdetalles(ped) {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "100%";

    this.pedidoVer_ = Object.assign({}, ped);
    this.pedidoVer_.fechapedido = this.timestampConvert(ped.fechapedido);

    if (ped.ffactura !== null && typeof ped.ffactura != "undefined") {
      this.pedidoVer_.ffactura = this.timestampConvert(ped.ffactura);
    }
    if (ped.fdespacho !== null && typeof ped.fdespacho != "undefined") {
      this.pedidoVer_.fdespacho = this.timestampConvert(ped.fdespacho);
    }
    if (ped.fpago !== null && typeof ped.fpago != "undefined") {
      this.pedidoVer_.fpago = this.timestampConvert(ped.fpago);
    }
    if (ped.ftentrega !== null && typeof ped.ftentrega != "undefined") {
      this.pedidoVer_.ftentrega = this.timestampConvert(ped.ftentrega);
    }
    if (ped.fentrega !== null && typeof ped.fentrega != "undefined") {
      this.pedidoVer_.fentrega = this.timestampConvert(ped.fentrega);
    }
    if (ped.fpreparacion !== null && typeof ped.fpreparacion != "undefined") {
      this.pedidoVer_.fpreparacion = this.timestampConvert(ped.fpreparacion);
    }

    dialogConfig.data = {
      pedidoShow: Object.assign({}, this.pedidoVer_)
    };

    this.dialogo.open(PedidoscobrosShowComponent, dialogConfig);
  }//verdetalles

  rerender(): void {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  
        dtInstance.clear().destroy();
  
        this.dtTrigger.next();
      })
  }

  onCancelar(pf?: NgForm ){
    if(pf != null) pf.reset();
    this.pedidoPend_ = {} as Pedido;
    this.MostrarCob = 'display:none;';
    this.pagoparcialpagado = 0;
    this.opcpedidosCobrosRep = false;
  }//onCancelar

  SelectedValue(Value){
    this.codCli = Value;
  }

}
