import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef, NgModule, InjectionToken, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { VendedorService } from '../../../services/vendedor.service';
import { CpagoService } from '../../../services/cpago.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { GarticuloService } from '../../../services/garticulo.service'
import { Garticulo } from 'src/app/models/garticulo';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
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

interface MatRep {
  matId: string,
  text: string,
  grpArt?: string,
  quantity: number,
  unitM: string,
  amount: number
}

@Component({
  selector: 'app-repMat',
  templateUrl: './repMat.component.html',
  styleUrls: ['./repMat.component.css']
})

export class RepMatComponent implements OnDestroy, OnInit, AfterViewInit {
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
  grpArt: string;
  codVen: string;
  conPag: any;
  opcrep01 = false;
  pedidoVer_ = {} as Pedido;
  totalRegistro: number = 0;
  totalBruto: number = 0;
  totalCantidades: number = 0;
  totalNeto: number = 0;
  firstTime: boolean = false;


  showSpinner = false;

  public clienteList: Client[]; //arreglo vacio
  public vendedorList: Vendedor[]; //arreglo vacio
  public cpagoList: Cpago[]; //arreglo vacio
  public Ped_: Pedido[]; //arreglo vacio
  public matList: MatRep[] = [];
  public grpArticulo: Garticulo[];
  public productosList: Product[];
  cols: any[];

  exportColumns: any[];

  //data table
  dtOptions: any = {
    pagingType: 'full_numbers',
    pageLength: 30,
    ordering: true,
    language: {
      url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json'
    },
    processing: true,
    dom: 'Bfrtip',
    buttons: [
      'copy', {
        extend: 'excelHtml5',
        text: 'Excel',
        customizeData: function (data) {
          //Recorremos todas las filas de la tabla
          for (var i = 0; i < data.body.length; i++) {
            //Quitamos los puntos como separador de miles 
            //y las comas de los decimaleslas cambiamos por puntos
            data.body[i][5] = data.body[i][5].replace(".", "-");
            data.body[i][5] = data.body[i][5].replace(",", ".");
            data.body[i][5] = data.body[i][5].replace("-", ",");

          }
        }
      }, 'pdf', 'print'
    ]
  };
  //dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  data: any;
  dtInitialized: any;
  //-----------------------------------------------------------
  //data table

  constructor
    (
      public clienteS: ClientService,
      public vendedorS: VendedorService,
      public cpagoS: CpagoService,
      public pedidoS: PedidoService,
      public gArticuloS: GarticuloService,
      public productsS: ProductService,
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

    this.gArticuloS.getGarticulo().valueChanges().subscribe(grupoArt => {
      console.log(grupoArt);
      this.grpArticulo = grupoArt;
    });

    this.productsS.getProducts().valueChanges().subscribe(productos => {
      this.productosList = productos;
    })


  }//ngOnInit

  ngAfterViewInit(): void {
    // this.dtTrigger.next();
    // this.firstTime = false;
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
  async onSubmitSearch(pf?: NgForm) {
    this.showSpinner = true;
    let query: any;
    let hora = new Date().getHours();
    hora = 24 - hora;
    let productosFiltrados;
    this.hasT.setHours(new Date().getHours() + hora - 1);

    query = (ref: CollectionReference) => {
      let q = ref.where("fechapedido", ">=", this.desD)
        .where("fechapedido", "<=", this.hasT)
        .orderBy("fechapedido", "desc")
        .orderBy("creado", "desc")
        .limit(5000)
      return q;
    }

    if (this.grpArt)
      productosFiltrados = this.productosList.filter(product => product.grupodearticulos === this.grpArt)
    // console.log(productosFiltrados);
    this.pedidoS.getPedidosRepMat(query).subscribe(repMat => {
      this.matList = [];
      console.log(repMat);
      repMat.forEach(ped => {
        ped.detalle.forEach(pedDet_ => {
          const { codigodematerial, descripcionmaterial, totalpormaterial, unidaddemedida, cantidadmaterial, } = pedDet_;

          if (productosFiltrados && !productosFiltrados.find(prod => prod.idmaterial == codigodematerial)) {
            return;
          }


          if (this.matList && this.matList.find(mat => mat.matId == codigodematerial)) {

            let index = this.matList.findIndex(mat => mat.matId == codigodematerial);
            this.matList[index].amount = this.matList[index].amount + totalpormaterial;
            this.matList[index].quantity = this.matList[index].amount + cantidadmaterial;
          }
          else {
            this.matList.push({
              matId: codigodematerial,
              text: descripcionmaterial,
              quantity: cantidadmaterial,
              unitM: unidaddemedida,
              grpArt: this.productosList.find(mat => mat.idmaterial == codigodematerial).grupodearticulos,
              amount: totalpormaterial
            });

          }
        })

      });
      console.log(this.matList.length);

      this.totalRegistro = this.matList.length;
      this.totalCantidades = this.roundTo(this.matList.reduce((total, row) => total + row.quantity, 0), 2);
      this.totalNeto = this.roundTo(this.matList.reduce((total, row) => total + row.amount, 0), 2);

      setTimeout(() => {
        this.showSpinner = false;
      }, 500);

      if (this.dtInitialized) {
        this.rerender();
      }
      else {
        this.dtInitialized = true;
        this.dtTrigger.next();
      }
    });

    this.opcrep01 = true;


  }//onSubmitSearch

  timestampConvert(fec) {
    let dateObject = new Date(fec.seconds * 1000);
    let mes_ = dateObject.getMonth() + 1;
    let ano_ = dateObject.getFullYear();
    let dia_ = dateObject.getDate();
    return dateObject;
  }//timestampConvert

  rerender(): void {

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      dtInstance.clear().destroy();

      this.dtTrigger.next();
    })
  }

  SelectedValue(Value) {
    this.codCli = Value;
  }


  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.matList);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "products");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    // let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    // let EXCEL_EXTENSION = '.xlsx';
    // const data: Blob = new Blob([buffer], {
    //   type: EXCEL_TYPE
    // });
    // FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
