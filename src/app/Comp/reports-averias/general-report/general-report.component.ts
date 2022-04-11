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
//declare const $;

// platformBrowserDynamic().bootstrapModule(AppModule, {
//   providers: [{provide: DEFAULT_CURRENCY_CODE, useValue: 'DOP'}]
// })

@Component({
  selector: 'app-general-report',
  templateUrl: './general-report.component.html',
  styleUrls: ['./general-report.component.css']
})
export class GeneralReportComponent implements OnDestroy, OnInit, AfterViewInit {
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
  motivoAv: any;
  opcgenReport = false;
  averiaVer_ = {} as Averia;
  totalRegistro: number = 0;
  totalBruto: number = 0;
  totalDescuento: number = 0;
  totalNeto: number = 0;
  firstTime: boolean = false;
  arrayAveria: any[] = [];

  public clienteList: Client[]; //arreglo vacio
  public materialList: Product[]; //arreglo vacio
  public motivoList: MaveriaService[]; //arreglo vacio
  public Ave_: Averia[]; //arreglo vacio
  public averiasDet_: AveriaDet[]; 


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
      'copy', 'csv', 'excel', 'pdf', 'print'
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
      public productS: ProductService,
      public motivoAvS: MaveriaService,
      public averiasS: GestionaveriasService,
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

    this.productS.getProducts().valueChanges().subscribe(mater => {
      this.materialList = mater;
    })

    this.motivoAvS.getMaverias().valueChanges().subscribe(motiv => {
      this.motivoList = motiv;
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

    this.opcgenReport = false;
  }

  onBookChange(event) {
    if (event.value == "") {
      //console.log('vacio',event.value);
    } else {
      //console.log(event.value);
    }
  }
  onSubmitSearch(pf?: NgForm) {
    let query: any;
    let hora = new Date().getHours();
    hora = 24 - hora;
    this.hasT.setHours(new Date().getHours() + hora - 1);

    this.averiasDet_ = [];

    if (this.motivoAv.length > 0){
      this.averiasS.getDetallesAverias(this.motivoAv[0]);
    }

    query = (ref: CollectionReference) => {
      let q = ref.where("fechaaveria", ">=", this.desD)
        .where("fechaaveria", "<=", this.hasT)
        .orderBy("fechaaveria", "desc")
        .orderBy("creado", "desc")
        .limit(5000)

      if (typeof this.codCli == "undefined" || this.codCli == null) { } else {
        q = q.where("idcliente", "==", this.codCli)
      }
       if (typeof this.staTus == "undefined" || this.staTus == null || this.staTus == '') { } else {
         if(this.staTus == ""){ } else {
           q = q.where("status", "in", this.staTus);
         }
        //q = q.where("status", "==", this.staTus)
      }
      if (typeof this.codVen == "undefined" || this.codVen == null) { } else {
        q = q.where("nomvendedor", "==", this.codVen)
      }
      return q;
    }

    /* Metodo para conseguir los motivos de averias de cada material en la averia
      para mostrarlo en la columna motivo */
    this.averiasS.getAveriasRep01(query).subscribe(averia => {

      this.Ave_ = averia;
      this.arrayAveria = this.Ave_;

      if (this.motivoAv == "Roto en despacho") {
        this.averiasS.averiasDetRotoMotivo.subscribe(detalles => {
          //metemos los valores en un array de detalles de averias
          this.averiasDet_ = detalles;
          //aqui va el for doble
          this.metodoFor(this.arrayAveria,this.averiasDet_);

          //se define un array vacio para ingresar los materiales filtrados
          let copyArrayAveria:any[] = [];

          for (let i = 0; i < this.arrayAveria.length; i++) {
            if(this.arrayAveria[i].motivo !== undefined) {
              copyArrayAveria.push(this.arrayAveria[i]);
            }
          }          
          
          this.arrayAveria = copyArrayAveria;
        });
      } else if (this.motivoAv == "Defecto de fabrica") {
        this.averiasS.averiasDetRotoMotivo.subscribe(detalles => {
          //metemos los valores en un array de detalles de averias
          this.averiasDet_ = detalles;
          //aqui va el for doble
          this.metodoFor(this.arrayAveria,this.averiasDet_);

          //se define un array vacio para ingresar los materiales filtrados
          let copyArrayAveria:any[] = [];

          for (let i = 0; i < this.arrayAveria.length; i++) {
            if(this.arrayAveria[i].motivo !== undefined) {
              copyArrayAveria.push(this.arrayAveria[i]);
            }
          }          
          
          this.arrayAveria = copyArrayAveria;
        });
      } else {
        //Buscamos todos los materiales de la averia 
        this.averiasS.averiasDet.subscribe(detalles => {
          //metemos los valores en un array de detalles de averias
          this.averiasDet_ = detalles;
          //aqui va el for doble
          this.metodoFor(this.arrayAveria,this.averiasDet_);
        });
      }

      if(!this.firstTime){
        this.rerender();
      }
    })
      
    this.opcgenReport = true;

  }//onSubmitSearch


  metodoFor(arrayAverias:any[],arrayMateriales:any[]) {
    for(let i = 0; i<arrayMateriales.length;i++) {

      for(let j = 0; j<arrayAverias.length;j++) {
        /* Si el material pertenece a la averia entonces guardamos el motivo de averia
          en su averia correspondiente dentro de un array secundario
        */
        if (arrayMateriales[i].idaveria == arrayAverias[j].uid) {
          if ( arrayAverias[j].motivo) {
            //concatenamos por si la averia tiene mas de un material
            arrayAverias[j].motivo = arrayAverias[j].motivo + " / " +arrayMateriales[i].motivoaveria
          } else {
            arrayAverias[j].motivo = arrayMateriales[i].motivoaveria;
          }
          //Sale del for porque ya encontro la coincidencia
          j = 0;
          break;
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

  verdetalles(averia){
    const dialogConfig = new MatDialogConfig;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "100%"
    dialogConfig.width = "95%";
    dialogConfig.height = "95%"
    
    //this.averiasS.pestana = "CA";
    
    this.averiaVer_ =  Object.assign({}, averia);
  
    dialogConfig.data = {
      averiaShow: Object.assign({}, this.averiaVer_)
    };
  
    this.dialogo.open(AveriaShowComponent,dialogConfig);
  }

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

