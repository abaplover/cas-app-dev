import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, InjectionToken, OnInit, ViewChild } from '@angular/core';
import { CollectionReference } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { each } from 'jquery';
import { Subject } from 'rxjs';
import { Client } from 'src/app/models/client';
import { Cobro } from 'src/app/models/cobro';
import { CobroDet } from 'src/app/models/cobro-det';
import { Pedido } from 'src/app/models/pedido';
import { TipodocCobros } from 'src/app/models/tipodoc-cobros';
import { BancoService } from 'src/app/services/banco.service';
import { ClientService } from 'src/app/services/client.service';
import { CobrosService } from 'src/app/services/cobros.service';
import { PedidoService } from 'src/app/services/pedido.service';
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
  codCli: string;
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
  arrayPedido: any[] = [];
  copyArray = [];

  montototalUSD = 0;
  montototalBSF = 0;

  showSpinner = false;


  public clienteList: Client[]; //arreglo vacio
  public bancoList: BancoService[]; //arreglo vacio
  public tipodocList: TipodocCobros[]; //arreglo vacio
  public viapagoList: VpagoService[]; //arreglo vacio
  public vendedorList: VendedorService[]; //arreglo vacio
  public Pedido_: Pedido[]; //arreglo vacio
  public cobrosDet_: Cobro[];
  


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
    this.showSpinner = true;
    let query: any;
    let queryDet: any;
    let hora = new Date().getHours();
    hora = 24 - hora;
    this.hasT.setHours(new Date().getHours() + hora - 1);

    this.cobrosDet_ = [];

    queryDet = (ref: CollectionReference) => {
      //Busqueda entre fechas
      let queryCobros = ref.where("fechadepago", ">=", this.desD)
        .where("fechadepago", "<=", this.hasT)
        .orderBy("fechadepago", "desc")
        .limit(5000)

      //tipo de documento de cobro
      if (typeof this.tipodoc == "undefined" || this.tipodoc == null) { } else {
        if(this.tipodoc == ""){ } else {
          queryCobros = queryCobros.where("tipodoc", 'in', this.tipodoc);
        }
      }

      return queryCobros;
    }

    query = (ref: CollectionReference) => {
      let q = ref.where("status","==","ENTREGADO")
      .orderBy("creado", "asc")
      .limit(5000)

      if (typeof this.vendedor == "undefined" || this.vendedor == null || this.vendedor == '') 
      { } else {
        if(this.vendedor == ""){ } else {
          q = q.where("nomvendedor", "in", this.vendedor);
        }
      }

      if (typeof this.codCli == "undefined" || this.codCli == null) { } else {
        q = q.where("idcliente", "==", this.codCli)
      }

      return q;
    }

    this.pedidoS.getPedidosRep01(query).subscribe(pedido => {

      this.Pedido_ = pedido;
      this.arrayPedido = this.Pedido_;

      this.cobrosS.getCobrosRep01(queryDet).subscribe(cobro => {

        this.cobrosDet_ = cobro;

        //Filtramos de acuerdo a cada condicion porque en la parte del query no se pueden
        // utilizar dos 'in' de where
        if (typeof this.tipopago == "undefined" || this.tipopago == null || this.tipopago == '') 
        { } else {
          if(this.tipopago == ""){ } else {
              this.cobrosDet_ = this.cobrosDet_.filter(cobr => this.tipopago.includes(cobr.tipopago));
          }
        }

        if (typeof this.viapago == "undefined" || this.viapago == null || this.viapago == '') 
        { } else {
          if(this.viapago == ""){ } else {
              this.cobrosDet_ = this.cobrosDet_.filter(cobr => this.viapago.includes(cobr.viadepago));
          }
        }

        if (typeof this.banco == "undefined" || this.banco == null || this.banco == '') 
        { } else {
          if(this.banco == ""){ } else {
              this.cobrosDet_ = this.cobrosDet_.filter(cobr => this.banco.includes(cobr.banco));
          }
        }

        this.metodoFor(this.arrayPedido,this.cobrosDet_);

        this.cobrosDet_ = this.copyArray;
        this.montototalUSD = 0;
        this.montototalBSF = 0;

        this.cobrosDet_.forEach(cobro => {
          this.montototalUSD += Number(cobro.montodepago);
          if(cobro.montobsf) {
            this.montototalBSF += Number(cobro.montobsf)
          } else {
            this.montototalBSF += 0;
          }
        });

        if(!this.firstTime){
          this.rerender();
        }
  
        this.opcgenReport = true;
        
      
      })

    })
    this.showSpinner = false;

  }//onSubmitSearch

//Unimos en un solo array los datos de los cobros con su correspondiente pedido
  metodoFor(arrayPedidos:any[],arrayCobros:any[]) {
    this.copyArray = [];
    for(let i = 0; i<arrayPedidos.length;i++) {  
      for(let j = 0; j<arrayCobros.length;j++) {
        if (arrayCobros[j].idpedido == arrayPedidos[i].idpedido) {
          this.copyArray.push(
            {
              idpedido: arrayPedidos[i].idpedido,
              fechapago: arrayCobros[j].fechadepago,
              nrofactura: arrayPedidos[i].nrofactura,
              tipopago: arrayCobros[j].tipopago,
              cliente: arrayPedidos[i].nomcliente,
              vendedor: arrayPedidos[i].nomvendedor,
              viapago: arrayCobros[j].viadepago,
              banco: arrayCobros[j].banco,
              montodepago: arrayCobros[j].montodepago,
              montobsf: arrayCobros[j].montobsf,
              status: arrayCobros[j].status
            }
          );
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
    this.codCli = Value;
  }

}
