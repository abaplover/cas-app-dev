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
import { FormControl, NgForm } from '@angular/forms';
import { Pedido } from 'src/app/models/pedido';
import { Subject } from 'rxjs';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { CollectionReference } from '@angular/fire/firestore';
import { stringify } from '@angular/compiler/src/util';
import * as firebase from 'firebase';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PedidoShowComponent } from '../../pedidos/pedido-show/pedido-show.component';
import { DataTableDirective } from 'angular-datatables';
import * as _moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

const moment = _moment;

interface MatRep {
  matId: string,
  text: string,
  grpArt?: string,
  QM1?: number,
  QM2?: number,
  QM3?: number,
  QM4?: number,
  QM5?: number,
  QM6?: number,
}
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-repHisVentas.',
  templateUrl: './repHisVentas.component.html',
  styleUrls: ['./repHisVentas.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
    }
  ]
})

export class RepHisVentasComponent implements OnDestroy, OnInit, AfterViewInit {
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
  grpArt: any;
  codVen: string;
  conPag: any;
  opcrep01 = false;
  pedidoVer_ = {} as Pedido;
  totalRegistro: number = 0;
  totalBruto: number = 0;
  totalCantidades: number = 0;
  totalNeto: number = 0;
  dtInitialized: boolean = false;
  materialesSelected: any;

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
  date = new FormControl(moment());
  date2 = new FormControl(moment());

  //data table
  dtOptions: any = {
    pagingType: 'full_numbers',
    pageLength: 30,
    ordering: true,
    language: {
      url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json',
      decimal: ",",
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

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    const ctrlValue2 = this.date2.value;

    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);

    ctrlValue2.month(normalizedMonth.month() + 5);
    this.date2.setValue(ctrlValue2)

    datepicker.close();
  }
  chosenYearHandler2(normalizedYear: Moment) {
    const ctrlValue = this.date2.value;
    ctrlValue.year(normalizedYear.year());
    this.date2.setValue(ctrlValue);
  }

  chosenMonthHandler2(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date2.value;
    const ctrlValue2 = this.date.value;

    ctrlValue.month(normalizedMonth.month());
    this.date2.setValue(ctrlValue);

    ctrlValue2.month(normalizedMonth.month() - 5);
    this.date.setValue(ctrlValue2)

    datepicker.close();
  }
  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  ngOnInit(): void {

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

    this.desD = new Date(this.date.value);
    this.hasT = new Date(this.date2.value);
    this.desD.setDate(1);
    this.hasT.setDate(0);

    this.hasT.setMonth(this.hasT.getMonth() + 1);

    console.log(this.desD);
    console.log(this.hasT);
    // this.hasT.setHours(new Date().getHours() + hora - 1);


    query = (ref: CollectionReference) => {
      let q = ref.where("fechapedido", ">=", this.desD)
        .where("fechapedido", "<=", this.hasT)
        .orderBy("fechapedido", "desc")
        .orderBy("creado", "desc")
        .limit(5000)
      return q;
    }

    if (this.grpArt)
      productosFiltrados = this.productosList.filter(product => this.grpArt.includes(product.grupodearticulos))

    if (this.materialesSelected)
      productosFiltrados = this.productosList.filter(product => this.materialesSelected.includes(product.idmaterial))

    this.pedidoS.getPedidosRepMat(query).subscribe(repMat => {

      this.matList = [];
      console.log(repMat);
      repMat.forEach(ped => {
        ped.detalle.forEach(pedDet_ => {
          const { codigodematerial, descripcionmaterial, totalpormaterial, unidaddemedida, cantidadmaterial, } = pedDet_;

          const { fechapedido } = ped.cabecera;
          let fechadePedido = this.timestampConvert(fechapedido);

          if (productosFiltrados && !productosFiltrados.find(prod => prod.idmaterial == codigodematerial)) {
            return;
          }
          let key = '';
          console.log(this.differenceInMonths(this.desD, fechadePedido));
          switch (Math.abs(this.differenceInMonths(this.desD, fechadePedido))) {
            case 0:
              key = 'QM1';
              break;
            case 1:
              key = 'QM2';
              break;
            case 2:
              key = 'QM3';
              break;
            case 3:
              key = 'QM4';
              break;
            case 4:
              key = 'QM5';
              break;
            case 5:
              key = 'QM6';
              break;
            default:
              // console.log(this.desD.getMonth())
              // console.log(fechadePedido.getMonth())
              // if(fechadePedido.getMonth() == 0)
              //   console.log(fechadePedido);
          }
            // console.log(key);

            if (this.matList && this.matList.find(mat => mat.matId == codigodematerial)) {

            let index = this.matList.findIndex(mat => mat.matId == codigodematerial);
            this.matList[index][key] = this.matList[index][key] ? this.matList[index][key] + cantidadmaterial : cantidadmaterial;
          }
          else {
            let matObj = {
              matId: codigodematerial,
              text: descripcionmaterial,
              grpArt: this.productosList.find(mat => mat.idmaterial == codigodematerial).grupodearticulos,
            };
            matObj[key] = cantidadmaterial;
            this.matList.push(matObj);

          }
        })
      });
      this.totalRegistro = this.matList.length;

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

  exportPdf() {
    // import("jspdf").then(jsPDF => {
    //   import("jspdf-autotable").then(x => {
    //     const doc = new jsPDF.default(0, 0);
    //     doc.autoTable(this.exportColumns, this.products);
    //     doc.save('products.pdf');
    //   })
    // })
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
  differenceInMonths(date1, date2) {
    const monthDiff = date1.getMonth() - date2.getMonth();
    const yearDiff = date1.getYear() - date2.getYear();
  
    return monthDiff + yearDiff * 12;
  }

}
