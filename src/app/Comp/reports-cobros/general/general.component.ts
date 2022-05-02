import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, InjectionToken, OnInit, ViewChild } from '@angular/core';
import { CollectionReference } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Client } from 'src/app/models/client';
import { Cobro } from 'src/app/models/cobro';
import { CobroDet } from 'src/app/models/cobro-det';
import { TipodocCobros } from 'src/app/models/tipodoc-cobros';
import { BancoService } from 'src/app/services/banco.service';
import { ClientService } from 'src/app/services/client.service';
import { CobrosService } from 'src/app/services/cobros.service';
import { TipodcobrosService } from 'src/app/services/tipodcobros.service';
import { VendedorService } from 'src/app/services/vendedor.service';
import { VpagoService } from 'src/app/services/vpago.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  DEFAULT_CURRENCY_CODE: InjectionToken<string>;
  maxDated: Date;
  maxDateh: Date;
  minDateh: Date;
  desD: Date;
  hasT: Date;
  tipopago: any;
  banco: any;
  viapago: any;
  vendedor = "";
  tipodoc: string;
  codVen: string;
  motivoAv="";
  opcgenReport = false;
  cobroVer_ = {} as Cobro;
  totalRegistroAv: number = 0;
  totalAveria: number = 0;
  porcentajeReclamo: number = 0;
  firstTime: boolean = false;
  averiaCerrada = false;
  arrayCobro: any[] = [];
  copyArray = [];

  showSpinner = false;


  public clienteList: Client[]; //arreglo vacio
/*public materialList: Product[]; //arreglo vacio*/  
  public bancoList: BancoService[]; //arreglo vacio
  public tipodocList: TipodocCobros[]; //arreglo vacio
  public viapagoList: VpagoService[]; //arreglo vacio
  public vendedorList: VendedorService[]; //arreglo vacio
  public Cobro_: Cobro[]; //arreglo vacio
  public cobrosDet_: CobroDet[];
  


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
      'copy', 'csv', 'excel', 'pdf', 'print'
    ]
  };
  //dtOptionsAv: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  data: any;
  //-----------------------------------------------------------
  //data table

  constructor
    (
      public clienteS: ClientService,
      public bancoS: BancoService,
      public tipodocCobS: TipodcobrosService,
      public vendedorS: VendedorService,
      public cobrosS: CobrosService,
      public viapagoS: VpagoService,
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

    this.vendedorS.getVendedors().valueChanges().subscribe(vendedores => {
      this.vendedorList = vendedores;
    });

    this.bancoS.getBancos().valueChanges().subscribe( bancos => {
      this.bancoList = bancos;
    })

    this.viapagoS.getVpagos().valueChanges().subscribe( vpagos => {
      this.viapagoList = vpagos;
    })

    /* this.productS.getProducts().valueChanges().subscribe(mater => {
      this.materialList = mater;
    }) */

    

    this.tipodocCobS.getTipods().valueChanges().subscribe(tipodocobros => {
      this.tipodocList = tipodocobros;
    });
    
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
    } else {
      //console.log(event.value);
    }
  }
  onSubmitSearch(pf?: NgForm) {
    let query: any;
    let queryDet: any;
    let hora = new Date().getHours();
    hora = 24 - hora;
    this.hasT.setHours(new Date().getHours() + hora - 1);

    this.cobrosDet_ = [];

    queryDet = (ref: CollectionReference) => {
      //Busqueda entre fechas
      let qdet = ref.where("fechadepago", ">=", this.desD)
        .where("fechadepago", "<=", this.hasT)
        .orderBy("fechadepago", "desc")
        .orderBy("creado", "desc")
        .limit(5000)

        //tipo de documento de cobro
      if (typeof this.tipodoc == "undefined" || this.tipodoc == null) { } else {
        qdet = qdet.where("tipodoc", "==", this.tipodoc)
      }
      
      if (typeof this.tipopago == "undefined" || this.tipopago == null || this.tipopago == '') 
      { } else {
        if(this.tipopago == ""){ } else {
          qdet = qdet.where("tipopago", "in", this.tipopago);
        }
      }
      
      if (typeof this.viapago == "undefined" || this.viapago == null || this.viapago == '') 
      { } else {
        if(this.viapago == ""){ } else {
          qdet = qdet.where("viadepago", "in", this.viapago);
        }
      }

      if (typeof this.banco == "undefined" || this.banco == null) { } else {
        qdet = qdet.where("banco", "==", this.banco)
      }
    }

    query = (ref: CollectionReference) => {
      let q = ref.where("indice",">=",0)
      .orderBy("indice", "asc")
      .limit(5000)
      
      if (typeof this.tipopago == "undefined" || this.tipopago == null || this.tipopago == '') 
      { } else {
        if(this.tipopago == ""){ } else {
          q = q.where("tipopago", "in", this.tipopago);
        }
      }
      
      if (typeof this.viapago == "undefined" || this.viapago == null || this.viapago == '') 
      { } else {
        if(this.viapago == ""){ } else {
          q = q.where("viadepago", "in", this.viapago);
        }
      }

      if (typeof this.banco == "undefined" || this.banco == null) { } else {
        q = q.where("banco", "==", this.banco)
      }

      if (typeof this.vendedor == "undefined" || this.vendedor == null || this.vendedor == '') 
      { } else {
        if(this.vendedor == ""){ } else {
          q = q.where("nomvendedor", "==", this.vendedor[0]);
        }
      }

      return q;
    }

    this.cobrosS.getCobrosRep01(query).subscribe(cobro => {

      this.Cobro_ = cobro;
      this.arrayCobro = this.Cobro_;

      this.cobrosS.getCobrosRep02(queryDet).subscribe(cobroDet => {

        this.cobrosDet_ = cobroDet;
        //this.arrayDetallesCobrosAve = this.cobrosDet_;

        this.metodoFor(this.arrayCobro,this.cobrosDet_);

        //this.firstTime = true;

        this.cobrosDet_ = this.copyArray;

        /* this.copyArray.reduce((acc, cobdet) => {

          acc[cobdet.idcobro] = ++acc[cobdet.idcobro] || 0;
          //acc[avdet.idcobro] = avdet.porcentajereclamo;
          if(acc[cobdet.idcobro] == 0){
            this.porcentajeReclamo += this.roundTo(cobdet.porcentajereclamo,2);
          }
          return acc;
        }, {});  */       

        /* this.totalRegistroAv = this.cobrosDet_.length;
        this.totalAveria = this.roundTo(this.cobrosDet_.reduce((total, row) => total + row.totalpormaterial, 0),2);
       */

        if(!this.firstTime){
          this.rerender();
        }

        this.showSpinner = false;
        this.opcgenReport = true;
      
      
      })


    })
      
    this.opcgenReport = true;

  }//onSubmitSearch


  metodoFor(arrayCobros:any[],arrayDetallesCobros:any[]) {
    this.cobrosDet_ = [];
    this.copyArray = [];
    for(let i = 0; i<arrayCobros.length;i++) {  
      for(let j = 0; j<arrayDetallesCobros.length;j++) {
        if (arrayDetallesCobros[j].idcobro == arrayCobros[i].uid) {
          this.copyArray.push(
            {
              idcobro: arrayCobros[i].uid,
              idpedido: arrayCobros[i].idpedido,
              fechapago: arrayCobros[i].fechadepago,
              nrofactura: arrayCobros[j].nrofactura,
              tipopago: arrayDetallesCobros[j].tipopago,
              cliente: arrayCobros[i].nomcliente,
              vendedor: arrayCobros[i].nomvendedor,
              viapago: arrayDetallesCobros[j].viadepago,
              banco: arrayDetallesCobros[j].banco,
              montodepago: arrayDetallesCobros[j].montodepago,
              montobsf: arrayDetallesCobros[j].montobsf
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

  verdetalles(cobro){
    const dialogConfig = new MatDialogConfig;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "100%"
    dialogConfig.width = "95%";
    dialogConfig.height = "95%"
    
    //this.cobrosS.pestana = "CA";
    
    this.cobroVer_ =  Object.assign({}, cobro);
  
    dialogConfig.data = {
      averiaShow: Object.assign({}, this.cobroVer_)
    };
  
    //this.dialogo.open(AveriaShowComponent,dialogConfig);
  }

  rerender(): void {

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      dtInstance.clear().destroy();

      this.dtTrigger.next();
    })
  }

  SelectedValue(Value){
    this.tipodoc = Value;
  }

}
