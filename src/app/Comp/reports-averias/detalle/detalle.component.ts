import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef, NgModule, InjectionToken, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { VendedorService } from '../../../services/vendedor.service';
import { CpagoService } from '../../../services/cpago.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Client } from '../../../models/client';
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
import { Maveria } from 'src/app/models/maveria';
import { Product } from 'src/app/models/product';
import { MaveriaService } from 'src/app/services/maveria.service';
import { ProductService } from 'src/app/services/product.service';
import { GestionaveriasService } from 'src/app/services/gestionaverias.service';
import { Averia } from 'src/app/models/gaveria';
import { AveriaShowComponent } from '../../averias/averia-show/averia-show.component';
import { AveriaDet } from 'src/app/models/gaveriaDet';
import * as moment from 'moment';
import { solucionAveriaService } from 'src/app/services/solucionAveria.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnDestroy, OnInit, AfterViewInit {

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  DEFAULT_CURRENCY_CODE: InjectionToken<string>;
  maxDated: Date;
  maxDateh: Date;
  minDateh: Date;
  desD: Date;
  hasT: Date;
  vendedor = "";
  codCli: string;
  materialAv: string = "";
  status: string;
  motivoAv = "";
  solucionAv: string = "";
  resolucionAv: string = "";
  opcgenReport = false;
  averiaVer_ = {} as Averia;
  totalRegistroAv: number = 0;
  totalAveria: number = 0;
  porcentajeReclamo: number = 0;
  firstTime: boolean = false;
  averiaCerrada = false;
  arrayAveria: any[] = [];
  arrayMaterialesAve: any[] = [];
  copyArray = [];
  showSpinner = false;

  public clienteList: Client[]; //arreglo vacio
  public materialList: Product[]; //arreglo vacio 
  public motivoList: MaveriaService[]; //arreglo vacio
  public solucionList: solucionAveriaService[]; //arreglo vacio
  public vendedorList: VendedorService[]; //arreglo vacio
  public Ave_: Averia[]; //arreglo vacio
  public averiasDet_: AveriaDet[];



  //data table
  dtOptionsAv: any = {
    pagingType: 'full_numbers',
    pageLength: 30,
    ordering: true,
    language: {
      url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json'
    },
    bInfo: false,
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
            data.body[i][9] = data.body[i][9].replace(".", "-");
            data.body[i][9] = data.body[i][9].replace(",", ".");
            data.body[i][9] = data.body[i][9].replace("-", ",");
          }
        }
      }, 'pdf', 'print'
    ]
  };
  //dtOptionsAv: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  data: any;
  //-----------------------------------------------------------
  //data table
  tiposFecha: {}[] = [{ name: 'Fecha de Creación', value: 'fechaaveria' },
  { name: 'Fecha de Resolución', value: 'feresolucion' },
  { name: 'Fecha de Cierre', value: 'fecierre' }];

  fechaSeleccionada: string = '';

  constructor
    (
      public clienteS: ClientService,
      public productS: ProductService,
      public motivoAvS: MaveriaService,
      public solucionAvS: solucionAveriaService,
      public vendedorS: VendedorService,
      public averiasS: GestionaveriasService,
      private http: HttpClient,
      private dialogo: MatDialog,
      public chRes: ChangeDetectorRef
    ) { }//constructor

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

    this.motivoAv = "";

    this.clienteS.getClients().valueChanges().subscribe(cs => {
      this.clienteList = cs;
    })

    this.vendedorS.getVendedors().valueChanges().subscribe(vendedores => {
      this.vendedorList = vendedores;
    })

    this.productS.getProducts().valueChanges().subscribe(mater => {
      this.materialList = mater;
    })

    this.motivoAvS.getMaverias().valueChanges().subscribe(motiv => {
      this.motivoList = motiv;
    });

    this.solucionAvS.getSoluaverias().valueChanges().subscribe(solucion => {
      this.solucionList = solucion;
    });

    this.firstTime = true;
    this.fechaSeleccionada = 'fechaaveria';

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

    this.opcgenReport = false;
    this.showSpinner = false;
  }

  onBookChange(event) {
    if (event.value == "") {
    } else {
      //console.log(event.value);
    }
  }
  onSubmitSearch(pf?: NgForm) {

    this.showSpinner = true;
    let query: any;
    let queryDet: any;
    let hora = new Date().getHours();
    hora = 24 - hora;
    this.hasT.setHours(new Date().getHours() + hora - 1);

    this.averiasDet_ = [];


    if (this.motivoAv.length > 0) {
      this.averiasS.getDetallesAverias(this.motivoAv[0]);
    }

    if (this.solucionAv.length > 0) {
      this.averiasS.getDetallesSolucion(this.solucionAv[0]);
    }

    if (this.resolucionAv.length > 0) {
      this.averiasS.getDetallesResolucion(this.resolucionAv[0]);
    }

    console.log(this.materialAv);
    if (this.materialAv.length > 0) {
      this.averiasS.getDetallesMaterial(this.materialAv);
    }

    query = (ref: CollectionReference) => {
      let q = ref.where(`${this.fechaSeleccionada}`, ">=", this.desD)
        .where(`${this.fechaSeleccionada}`, "<=", this.hasT)
        .orderBy(`${this.fechaSeleccionada}`, "desc")
        // .orderBy("creado", "desc")
        .limit(5000)

      if (typeof this.codCli == "undefined" || this.codCli == null) { } else {
        q = q.where("idcliente", "==", this.codCli)
      }
      if (typeof this.vendedor == "undefined" || this.vendedor == null || this.vendedor == '') { } else {
        if (this.vendedor == "") { } else {
          q = q.where("nomvendedor", "in", this.vendedor);
        }
      }

      if (typeof this.status == "undefined" || this.status == null || this.status == '') { } else {
        if (this.status == "") { } else {
          q = q.where("status", "==", this.status[0]);
        }
      }
      return q;
    }

    queryDet = (ref: CollectionReference) => {
      let qdet = ref.where("indice", ">=", 0)
        .orderBy("indice", "asc")
        .limit(5000)

      if (typeof this.motivoAv == "undefined" || this.motivoAv == null) { } else {
        if (this.motivoAv == "") { } else {
          qdet = qdet.where("motivoaveria", "in", this.motivoAv)
        }
      }

      if (typeof this.materialAv == "undefined" || this.materialAv == null || this.materialAv == '') { } else {
        if (this.materialAv == "") { } else {
          qdet = qdet.where("descripcionmaterial", "==", this.materialAv)
        }
      }

      if (typeof this.resolucionAv == "undefined" || this.resolucionAv == null || this.resolucionAv == '') { } else {
        let booleanResolucion;
        if (this.resolucionAv == "") { } else {
          if (this.resolucionAv == "true") {
            booleanResolucion = true;
          } else {
            booleanResolucion = false;
          }

          qdet = qdet.where("aprobado", "==", booleanResolucion)

          if (this.resolucionAv.length > 1) {
            booleanResolucion = [true, false];
            qdet = qdet.where("aprobado", "in", booleanResolucion)
          }

        }
      }

      if (typeof this.solucionAv == "undefined" || this.solucionAv == null || this.solucionAv == '') { } else {
        if (this.solucionAv == "") { } else {
          qdet = qdet.where("solucion", "==", this.solucionAv[0])
        }
      }
      return qdet;
    }

    this.averiasS.getAveriasRep01(query).subscribe(averia => {

      this.Ave_ = averia;
      this.arrayAveria = this.Ave_;
      console.log(queryDet);
      this.averiasS.getAveriasRep02(queryDet).subscribe(averiaDet => {

        this.averiasDet_ = averiaDet;
        this.arrayMaterialesAve = this.averiasDet_;

        this.metodoFor(this.arrayAveria, this.averiasDet_);

        //this.firstTime = true;

        this.averiasDet_ = this.copyArray;

        this.copyArray.reduce((acc, avdet) => {

          acc[avdet.idaveria] = ++acc[avdet.idaveria] || 0;
          //acc[avdet.idaveria] = avdet.porcentajereclamo;
          if (acc[avdet.idaveria] == 0) {
            this.porcentajeReclamo += this.roundTo(avdet.porcentajereclamo, 2);
          }
          return acc;
        }, {});

        this.totalRegistroAv = this.averiasDet_.length;
        this.totalAveria = this.roundTo(this.averiasDet_.reduce((total, row) => total + row.totalpormaterial, 0), 2);
        // console.log(this.averiasDet_);

        if (!this.firstTime) {
          this.rerender();
        }

        this.showSpinner = false;
        this.opcgenReport = true;


      })


    })

    

  }//onSubmitSearch


  /* if (this.materialAv.length > 0) {
    this.averiasS.averiasDetSpecificMaterial.subscribe(detalles => {
      //metemos los valores en un array de detalles de averias
      this.averiasDet_ = detalles;

      this.arrayMaterialesAve = this.averiasDet_;

      this.metodoFor(this.arrayAveria,this.averiasDet_);

      this.firstTime = true;
      this.averiasDet_ = this.copyArray;

      //se define un array vacio para ingresar los materiales filtrados
      let copyArrayAveria:any[] = [];
 
      for (let i = 0; i < this.arrayAveria.length; i++) {
        if(this.arrayAveria[i].motivo !== undefined) {
          copyArrayAveria.push(this.arrayAveria[i]);
        }
      }          
      
      this.arrayAveria = copyArrayAveria;
      this.totalRegistroAv = this.arrayAveria.length;
      this.totalAveria = this.roundTo(this.arrayAveria.reduce((total, row) => total + row.totalaveria, 0),2);
 
    })
  }
  else if (this.solucionAv.length > 0) {
    this.averiasS.averiasDetSpecificSolucion.subscribe(detalles => {
      //metemos los valores en un array de detalles de averias
      this.averiasDet_ = detalles;

      this.arrayMaterialesAve = this.averiasDet_;

      this.metodoFor(this.arrayAveria,this.averiasDet_);

      this.firstTime = true;

      this.averiasDet_ = this.copyArray;

      //se define un array vacio para ingresar los materiales filtrados
      let copyArrayAveria:any[] = [];
 
      for (let i = 0; i < this.arrayAveria.length; i++) {
        if(this.arrayAveria[i].motivo !== undefined) {
          copyArrayAveria.push(this.arrayAveria[i]);
        }
      }          
      
      this.arrayAveria = copyArrayAveria;
      this.totalRegistroAv = this.arrayAveria.length;
      this.totalAveria = this.roundTo(this.arrayAveria.reduce((total, row) => total + row.totalaveria, 0),2);
 
    })
  } else if (this.resolucionAv.length > 0) {
    this.averiasS.averiasDetSpecificResolucion.subscribe(detalles => {
      //metemos los valores en un array de detalles de averias
      this.averiasDet_ = detalles;

      this.arrayMaterialesAve = this.averiasDet_;

      this.metodoFor(this.arrayAveria,this.averiasDet_);

      this.firstTime = true;

      this.averiasDet_ = this.copyArray;

      //se define un array vacio para ingresar los materiales filtrados
      let copyArrayAveria:any[] = [];
 
      for (let i = 0; i < this.arrayAveria.length; i++) {
        if(this.arrayAveria[i].motivo !== undefined) {
          copyArrayAveria.push(this.arrayAveria[i]);
        }
      }          
      
      this.arrayAveria = copyArrayAveria;
      this.totalRegistroAv = this.arrayAveria.length;
      this.totalAveria = this.roundTo(this.arrayAveria.reduce((total, row) => total + row.totalaveria, 0),2);
 
    })
  }
 
  /* Metodo para conseguir los motivos de averias de cada material en la averia
  para mostrarlo en la columna motivo */
  /* //Busqueda de todos los detalles de todas las averias por motivo
  else if (this.motivoAv == "Roto en despacho") {
    this.averiasS.averiasDetSpecificMotivo.subscribe(detalles => {
      //metemos los valores en un array de detalles de averias
      this.averiasDet_ = detalles;
      this.arrayMaterialesAve = this.averiasDet_;
      this.metodoFor(this.arrayAveria,this.averiasDet_);

      this.firstTime = true;

      this.averiasDet_ = this.copyArray;
 
      //se define un array vacio para ingresar los materiales filtrados
      let copyArrayAveria:any[] = [];
 
      for (let i = 0; i < this.arrayAveria.length; i++) {
        if(this.arrayAveria[i].motivo !== undefined) {
          copyArrayAveria.push(this.arrayAveria[i]);
        }
      }          
      
      this.arrayAveria = copyArrayAveria;
      this.totalRegistroAv = this.arrayAveria.length;
      this.totalAveria = this.roundTo(this.arrayAveria.reduce((total, row) => total + row.totalaveria, 0),2);
 
    });
  //Busqueda de todos los detalles de todas las averias por motivo
  } else if (this.motivoAv == "Defecto de fabrica") {
    this.averiasS.averiasDetSpecificMotivo.subscribe(detalles => {
      //metemos los valores en un array de detalles de averias
      this.averiasDet_ = detalles;
      this.arrayMaterialesAve = this.averiasDet_;
      //aqui va el for doble
      this.metodoFor(this.arrayAveria,this.averiasDet_);
      this.firstTime = true;

      this.averiasDet_ = this.copyArray;
 
      //se define un array vacio para ingresar los materiales filtrados
      let copyArrayAveria:any[] = [];
 
      for (let i = 0; i < this.arrayAveria.length; i++) {
        if(this.arrayAveria[i].motivo !== undefined) {
          copyArrayAveria.push(this.arrayAveria[i]);
        }
      }          
      
      this.arrayAveria = copyArrayAveria;
      this.totalRegistroAv = this.arrayAveria.length;
      this.totalAveria = this.roundTo(this.arrayAveria.reduce((total, row) => total + row.totalaveria, 0),2);
 
    });
    //busqueda general por todos los detalles de todas las averias
  } else {
    this.averiasDet_ = [];
    //Buscamos todos los materiales de la averia 
    this.averiasS.averiasDet.subscribe(detalles => {
      //metemos los valores en un array de detalles de averias
      this.averiasDet_ = detalles;
      this.arrayMaterialesAve = this.averiasDet_;
      //aqui va el for doble
      this.metodoFor(this.arrayAveria,this.averiasDet_);

      this.firstTime = true;

      this.averiasDet_ = this.copyArray;
    });
 
 
    this.totalRegistroAv = this.arrayMaterialesAve.length;
    //this.totalAveria = this.roundTo(this.arrayAveria.reduce((total, row) => total + row.totalaveria, 0),2);
    //this.porcentajeReclamo = this.roundTo(this.arrayAveria.reduce((total,row) => total + row.porcentajeReclamo, 0),2);
  
  } */


  metodoFor(arrayAverias: any[], arrayMateriales: any[]) {
    this.averiasDet_ = [];
    this.copyArray = [];
    
    for (let i = 0; i < arrayAverias.length; i++) {
      for (let j = 0; j < arrayMateriales.length; j++) {
        if (arrayMateriales[j].idaveria == arrayAverias[i].uid) {
          // console.log(arrayAverias[i]);
          this.copyArray.push(
            {
              idaveria: arrayAverias[i].uid,
              nroaveria: arrayAverias[i].idaveria,
              fechaaveria: arrayAverias[i].fechaaveria,
              codigodematerial: arrayMateriales[j].codigodematerial,
              descripcionmaterial: arrayMateriales[j].descripcionmaterial,
              cliente: arrayAverias[i].nomcliente,
              vendedor: arrayAverias[i].nomvendedor,
              motivoaveria: arrayMateriales[j].motivoaveria,
              solucion: arrayMateriales[j].solucion,
              cantidadmaterial: arrayMateriales[j].cantidadmaterial,
              totalpormaterial: arrayMateriales[j].totalpormaterial,
              porcentajereclamo: arrayAverias[i].porcentajeReclamo,
              statusaveria: arrayAverias[i].status,
              resolucion: arrayAverias[i].status != 'ABIERTA' ? arrayMateriales[j].aprobado
                : 'Pendiente',
            }
          );
          //Sale del for porque ya encontro la coincidencia */
        }
      }
    }



  }

  timestampConvert(fec) {
    let dateObject = new Date(fec.seconds * 1000);
    let mes_ = dateObject.getMonth() + 1;
    let ano_ = dateObject.getFullYear();
    let dia_ = dateObject.getDate();
    return dateObject;
  }//timestampConvert

  verdetalles(idaveria) {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "100%"
    dialogConfig.width = "95%";
    dialogConfig.height = "95%"


    for (let i = 0; i < this.arrayAveria.length; i++) {
      if (this.arrayAveria[i].uid == idaveria) {
        this.averiaVer_ = Object.assign({}, this.arrayAveria[i]);
      }
    }
    console.log(this.averiaVer_);
    dialogConfig.data = {
      averiaShow: Object.assign({}, this.averiaVer_)
    };

    this.dialogo.open(AveriaShowComponent, dialogConfig);
  }

  limpiar(pf?: NgForm) {
    pf.reset();
    this.motivoAv = "";
    this.solucionAv = "";
    this.resolucionAv = "";
    this.materialAv = "";
  }

  rerender(): void {

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      dtInstance.clear().destroy();

      this.dtTrigger.next();
    })
  }

  SelectedValue(Value) {
    this.codCli = Value;
  }
  selecteMatValue(Value) {
    console.log(Value);
    this.materialAv = Value;
  }


}


