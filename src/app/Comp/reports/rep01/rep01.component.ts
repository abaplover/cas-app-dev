import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef, NgModule, InjectionToken, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { VendedorService } from '../../../services/vendedor.service';
import { CpagoService } from '../../../services/cpago.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Cpago } from '../../../models/cpago';
import { Client } from '../../../models/client';
import { Vendedor } from '../../../models/vendedor';
import { NgForm } from '@angular/forms';
import { Pedido } from 'src/app/models/pedido';
import { Subject } from 'rxjs';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { CollectionReference } from '@angular/fire/firestore';
import { stringify } from '@angular/compiler/src/util';
import * as firebase from 'firebase';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PedidoShowComponent } from '../../pedidos/pedido-show/pedido-show.component';
import { DataTableDirective } from 'angular-datatables';
import { AppModule } from 'src/app/app.module';
//declare const $;

// platformBrowserDynamic().bootstrapModule(AppModule, {
//   providers: [{provide: DEFAULT_CURRENCY_CODE, useValue: 'DOP'}]
// })

@Component({
  selector: 'app-rep01',
  templateUrl: './rep01.component.html',
  styleUrls: ['./rep01.component.css']
})

export class Rep01Component implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  DEFAULT_CURRENCY_CODE: InjectionToken<string>;
  maxDated: Date;
  maxDateh: Date;
  minDateh: Date;
  desD: Date;
  hasT: Date;
  staTus: any;
  codCli: string;
  codVen: string;
  conPag: any;
  opcrep01 = false;
  pedidoVer_ = {} as Pedido;
  totalRegistro: number = 0;
  totalBruto: number = 0;
  totalDescuento: number = 0;
  totalNeto: number = 0;
  firstTime: boolean = false;


  showSpinner = false;

  public clienteList: Client[]; //arreglo vacio
  public vendedorList: Vendedor[]; //arreglo vacio
  public cpagoList: Cpago[]; //arreglo vacio
  public Ped_: Pedido[]; //arreglo vacio


  //data table
  dtOptions: any = {
    pagingType: 'full_numbers',
    pageLength: 30,
    ordering : true,
    language: {
      url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json'
    },
    processing: true,
    dom: 'Bfrtip',
    buttons: [
      'copy',{extend: 'excelHtml5',
      text: 'Excel',
      customizeData: function(data) {
        //Recorremos todas las filas de la tabla
        for(var i = 0; i < data.body.length; i++) {
          //Quitamos los puntos como separador de miles 
          //y las comas de los decimaleslas cambiamos por puntos
          data.body[i][9] = data.body[i][9].replace( ".", "" );
          data.body[i][9] = data.body[i][9].replace( ",", "." );
          data.body[i][11] = data.body[i][11].replace( ".", "" );
          data.body[i][11] = data.body[i][11].replace( ",", "." );
        }
      }},'pdf', 'print'
    ]
  };
  //dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  data: any;
  //-----------------------------------------------------------
  //data table

  constructor
    (
      public clienteS: ClientService,
      public vendedorS: VendedorService,
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
    this.maxDated = new Date(currentYear, currentm, currentd);
    this.maxDateh = new Date(currentYear, currentm, currentd);
    this.minDateh = new Date(currentYear, currentm, currentd);

    this.clienteS.getClients().valueChanges().subscribe(cs => {
      this.clienteList = cs;
    })

    this.vendedorS.getVendedors().valueChanges().subscribe(vs => {
      this.vendedorList = vs;
    })

    this.cpagoS.getCpagos().valueChanges().subscribe(cp => {
      this.cpagoList = cp;
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
    this.opcrep01 = false;
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

    query = (ref: CollectionReference) => {
      let q = ref.where("fechapedido", ">=", this.desD)
        .where("fechapedido", "<=", this.hasT)
        .orderBy("fechapedido", "desc")
        .orderBy("creado", "desc")
        .limit(5000)

      if (typeof this.codCli == "undefined" || this.codCli == null) { } else {
        q = q.where("idcliente", "==", this.codCli)
      }
      // if (typeof this.staTus == "undefined" || this.staTus == null || this.staTus == '') { } else {
      //   if(this.staTus == ""){ } else {
      //     q = q.where("status", "in", this.staTus);
      //   }
      //   // q = q.where("status", "==", this.staTus)
      // }
      if (typeof this.codVen == "undefined" || this.codVen == null) { } else {
        q = q.where("nomvendedor", "==", this.codVen)
      }
      if (typeof this.conPag == "undefined" || this.conPag == "null" || this.conPag == null) { } else {
        if (this.conPag == "") { } else {
          q = q.where("condiciondepago", "in", this.conPag)
        }
      }
      return q;
    }

    this.pedidoS.getPedidosRep01(query).subscribe(ped => {
      
      this.Ped_ = ped;
      
      if(this.staTus == "" || typeof this.staTus == "undefined"){ } else {
          this.Ped_ = this.Ped_.filter(value => this.staTus.includes(value.status));
      }

      this.totalRegistro = this.Ped_.length;

      this.totalBruto = this.roundTo(this.Ped_.reduce((total, row) => total + row.totalmontobruto, 0),2);

      this.totalDescuento = this.roundTo(this.Ped_.reduce((total, row) => total + row.totalmontodescuento, 0),2);

      this.totalNeto = this.roundTo(this.Ped_.reduce((total, row) => total + row.totalmontoneto, 0),2);
      //
      if(!this.firstTime){
        this.rerender();
      }
      setTimeout(() => {
        this.showSpinner = false;
      }, 500);
      
    })

    this.opcrep01 = true;
    

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

    dialogConfig.data = {
      pedidoShow: Object.assign({}, this.pedidoVer_)
    };

    this.dialogo.open(PedidoShowComponent, dialogConfig);
  }//verdetalles
  rerender(): void {

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      dtInstance.clear().destroy();

      this.dtTrigger.next();
    })
  }

  SelectedValue(Value){
    this.codCli = Value;
  }

}
