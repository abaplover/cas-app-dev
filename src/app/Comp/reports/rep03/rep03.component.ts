import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { VendedorService } from '../../../services/vendedor.service';
import { PedidoService } from 'src/app/services/pedido.service';

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
  selector: 'app-rep03',
  templateUrl: './rep03.component.html',
  styleUrls: ['./rep03.component.css']
})
export class Rep03Component implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  maxDated: Date;
  maxDateh: Date;
  minDateh: Date;
  desD: Date;
  hasT: Date;
  staTus: any;
  codCli: string;
  codVen: any;
  opcrep01 = false;
  pedidoVer_ = {} as Pedido;
  firstTime: boolean = false;

  public clienteList: Client[]; //arreglo vacio
  public vendedorList: Vendedor[]; //arreglo vacio
  public Ped_: Pedido[]; //arreglo vacio


  //data table
  dtOptions: any = {};
  //dtOptions: DataTables.Settings = {};
  dtTrigger= new Subject<any>();
  data: any;
  //-----------------------------------------------------------

  constructor
  (
    public clienteS: ClientService,
    public vendedorS: VendedorService,
    public pedidoS: PedidoService,
    private http: HttpClient,
    private dialogo: MatDialog
  )
  {
        //data table
        this.dtOptions = {
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
                    data.body[i][7] = data.body[i][7].replace( ".", "" );
                    data.body[i][7] = data.body[i][7].replace( ",", "." );
                    data.body[i][9] = data.body[i][9].replace( ".", "" );
                    data.body[i][9] = data.body[i][9].replace( ",", "." );
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
   // this.dtTrigger.next();
   this.firstTime = true;

  }//ngOnInit

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.firstTime = false;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }//ngOnDestroy

  public prueba(fi,ff){
    let diafi = fi.getDate();
    let mesfi = fi.getMonth()+1;
    let anofi = fi.getFullYear();

    let diaff = ff.getDate();
    let mesff = ff.getMonth()+1;
    let anoff = ff.getFullYear();

    var startDate = new Date(mesfi +'/'+ diafi +'/'+ anofi);
    var endDate = new Date(mesff +'/'+ diaff +'/'+ anoff);

    var count = 0;
    var curDate = startDate;
    while (curDate <= endDate) {
        var dayOfWeek = curDate.getDay();
        if(!((dayOfWeek == 6) || (dayOfWeek == 0)))
           count++;
        curDate.setDate(curDate.getDate() + 1);
    }

    return count;

  }//orgValueChange

  public orgValueChange(event): void {
    if (event!=""){
      this.minDateh = new Date(event.value);
    }
  }//orgValueChange

  regresar(){
    this.opcrep01=false;
  }
  onSubmitSearch(pf?: NgForm){
    let query: any;

    let hora = new Date().getHours();
    hora = 24-hora;
    this.hasT.setHours(new Date().getHours()+hora-1);

    query = (ref: CollectionReference)=>{
       let q = ref.where("fechapedido", ">=", this.desD)
      .where("fechapedido", "<=", this.hasT)
      q = q.where("status", "==", "ENTREGADO")
      .orderBy("fechapedido", "desc")
      .orderBy("creado", "desc")
      .limit(5000)

      if (typeof this.codCli =="undefined" || this.codCli == null){}else{
        q = q.where("idcliente", "==", this.codCli)
      }
      if (typeof this.codVen =="undefined" || this.codVen =="null" || this.codVen == null){}else{
        q = q.where("nomvendedor", "in", this.codVen)
      }

      return q;
    }
    this.pedidoS.getPedidosRep03(query).subscribe(ped =>{
      this.Ped_ = ped;
      this.data = this.Ped_;
      
      if(!this.firstTime){
        this.rerender();
      }
    })

    this.opcrep01=true;

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
