import { Component, OnInit, OnDestroy, AfterViewInit,ViewChild } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { VendedorService } from '../../../services/vendedor.service';
import { TransporteService } from '../../../services/transporte.service';
import { PedidoService } from 'src/app/services/pedido.service';

import { Transporte } from '../../../models/transporte';
import { Client } from '../../../models/client';
import { Vendedor } from '../../../models/vendedor';
import { NgForm } from '@angular/forms';
import { Pedido } from 'src/app/models/pedido';
import { Subject } from 'rxjs';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { CollectionReference } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PedidoShowComponent } from '../../pedidos/pedido-show/pedido-show.component';
import { DataTableDirective } from 'angular-datatables';
//declare const $;

@Component({
  selector: 'app-rep04',
  templateUrl: './rep04.component.html',
  styleUrls: ['./rep04.component.css']
})
export class Rep04Component implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;



  maxDated: Date;
  maxDateh: Date;
  minDateh: Date;
  desD: Date;
  hasT: Date;
  staTus: any;
  codCli: string;
  codVen: string;
  transporte: any;
  opcrep01 = false;
  pedidoVer_ = {} as Pedido;
  firstTime: boolean = false;
  public clienteList: Client[]; //arreglo vacio
  public vendedorList: Vendedor[]; //arreglo vacio
  public transporteList: Transporte[]; //arreglo vacio
  public Ped_: Pedido[]; //arreglo vacio


  //data table
  dtOptions: any = {};
  //dtOptions: DataTables.Settings = {};
  dtTrigger= new Subject<any>();
  data: any;
  dtInitialized: any;
  //-----------------------------------------------------------

  constructor
  (
    public clienteS: ClientService,
    public vendedorS: VendedorService,
    public transporteS: TransporteService,
    public pedidoS: PedidoService,
    private http: HttpClient,
    private dialogo: MatDialog
  )
  {
        //data table
        this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 30,
          language: {
            url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json'
          },
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
                    data.body[i][8] = data.body[i][8].replace( ".", "-" );
                    data.body[i][8] = data.body[i][8].replace( ",", "." );
                    data.body[i][8] = data.body[i][8].replace( "-", "," );
                    data.body[i][9] = data.body[i][9].replace( ".", "-" );
                    data.body[i][9] = data.body[i][9].replace( ",", "." );
                    data.body[i][9] = data.body[i][9].replace( "-", "," );
                    data.body[i][10] = data.body[i][10].replace( ".", "-" );
                    data.body[i][10] = data.body[i][10].replace( ",", "." );
                    data.body[i][10] = data.body[i][10].replace( "-", "," );
                  }
                }},'pdf', 'print'
            ]
        };
  }//constructor

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const currentm = new Date().getMonth();
    const currentd = new Date().getDate();
    this.maxDated = new Date(currentYear, currentm, currentd);
    this.maxDateh = new Date(currentYear, currentm, currentd);
    this.minDateh = new Date(currentYear, currentm, currentd);

    this.clienteS.getClients().valueChanges().subscribe(cs =>{
      this.clienteList = cs;
    })

    this.vendedorS.getVendedors().valueChanges().subscribe(vs =>{
      this.vendedorList = vs;
    })

    this.transporteS.getTransportes().valueChanges().subscribe(tra =>{
      this.transporteList = tra;
    })
   this.firstTime = true;

  }//ngOnInit

  ngAfterViewInit(): void {
    // this.dtTrigger.next();
    // this.firstTime = false;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }//ngOnDestroy



  public orgValueChange(event): void {
    if (event!=""){
      this.minDateh = new Date(event.value);
    }
  }//orgValueChange
  regresar(){
    this.opcrep01=false;
    this.rerender();
  }
  onSubmitSearch(pf?: NgForm){
    let query: any;

    let hora = new Date().getHours();
    hora = 24-hora;
    this.hasT.setHours(new Date().getHours()+hora-1);

    query = (ref: CollectionReference)=>{
       let q = ref.where("fechapedido", ">=", this.desD)
      .where("fechapedido", "<=", this.hasT)
      .orderBy("fechapedido", "desc")
      .orderBy("creado", "desc")
      .limit(5000)
      if (typeof this.staTus =="undefined" || this.staTus =="null" || this.staTus == null){
        q = q.where("status", "in", ['ENTREGADO', 'DESPACHADO'])
      }else{
        if (this.staTus == ""){}else{
          console.log(this.staTus);
          q = q.where("status", "in", this.staTus)
        }
      }
      if (typeof this.transporte =="undefined" || this.transporte =="null" || this.transporte ==null || this.transporte ==""){}else{
        console.log(this.transporte);
        q = q.where("transporte", "==", this.transporte)
      }
      if (typeof this.codCli =="undefined" || this.codCli == null){}else{
        q = q.where("idcliente", "==", this.codCli)
      }
      if (typeof this.codVen =="undefined" || this.codVen == null){}else{
        q = q.where("nomvendedor", "==", this.codVen)
      }
      console.log(this.transporte);
      return q;
    }

    this.Ped_ = [];
    this.pedidoS.getPedidosRep04(query).subscribe(ped =>{
      this.Ped_ = ped;
      this.data = this.Ped_;

      if (this.dtInitialized) {
        this.rerender();
      }
      else {
        this.dtInitialized = true;
        this.dtTrigger.next();
      }

    })

    this.opcrep01=true;

    //this.dtOptions.destroy();
    //if(pf != null) pf.reset();

  }//onSubmitSearch

  timestampConvert(fec){
    let dateObject = new Date(fec.seconds*1000);
    let mes_ = dateObject.getMonth()+1;
    let ano_ = dateObject.getFullYear();
    let dia_ = dateObject.getDate();
    return dateObject;
  }//timestampConvert

  verdetalles(ped){
    const dialogConfig = new MatDialogConfig;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "100%";

    this.pedidoVer_ =  Object.assign({}, ped);
    this.pedidoVer_.fechapedido = this.timestampConvert(ped.fechapedido);

    if (ped.ffactura !== null && typeof ped.ffactura != "undefined"){
      this.pedidoVer_.ffactura = this.timestampConvert(ped.ffactura);
    }
    if (ped.fdespacho !== null && typeof ped.fdespacho != "undefined"){
      this.pedidoVer_.fdespacho = this.timestampConvert(ped.fdespacho);
    }
    if (ped.fpago !== null && typeof ped.fpago != "undefined"){
      this.pedidoVer_.fpago = this.timestampConvert(ped.fpago);
    }
    if (ped.ftentrega !== null && typeof ped.ftentrega != "undefined"){
      this.pedidoVer_.ftentrega = this.timestampConvert(ped.ftentrega);
    }
    if (ped.fentrega !== null && typeof ped.fentrega != "undefined"){
      this.pedidoVer_.fentrega = this.timestampConvert(ped.fentrega);
    }

    dialogConfig.data = {
      pedidoShow: Object.assign({}, this.pedidoVer_)
    };

     this.dialogo.open(PedidoShowComponent,dialogConfig);
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
