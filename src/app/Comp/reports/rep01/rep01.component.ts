import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { VendedorService } from '../../../services/vendedor.service';
import { CpagoService } from '../../../services/cpago.service';
import { PedidoService } from 'src/app/services/pedido.service';

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
//declare const $;

@Component({
  selector: 'app-rep01',
  templateUrl: './rep01.component.html',
  styleUrls: ['./rep01.component.css']
})
export class Rep01Component implements OnDestroy, OnInit, AfterViewInit {
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

  public clienteList: Client[]; //arreglo vacio
  public vendedorList: Vendedor[]; //arreglo vacio
  public cpagoList: Cpago[]; //arreglo vacio
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
    public cpagoS: CpagoService,
    public pedidoS: PedidoService,
    private http: HttpClient,
    private dialogo: MatDialog,
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
                'copy', 'csv', 'excel', 'pdf', 'print'
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

    this.cpagoS.getCpagos().valueChanges().subscribe(cp =>{
      this.cpagoList = cp;
    })
   // this.dtTrigger.next(); 

  }//ngOnInit

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
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
    //this.Ped_ = [];
    this.opcrep01=false;
  }

  onBookChange(event)
  {
      if (event.value == ""){
        //console.log('vacio',event.value);
      }else
      {
        //console.log(event.value);
      }
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

      if (typeof this.codCli =="undefined" || this.codCli == null){}else{
        q = q.where("idcliente", "==", this.codCli)
      }
      if (typeof this.staTus =="undefined" || this.staTus ==null){}else{
        q = q.where("status", "==", this.staTus)
      }
      if (typeof this.codVen =="undefined" || this.codVen == null){}else{
        q = q.where("nomvendedor", "==", this.codVen)
      }   
      if (typeof this.conPag =="undefined" || this.conPag =="null" || this.conPag == null){}else{
        if (this.conPag == ""){}else{
          q = q.where("condiciondepago", "in", this.conPag)
        }
      }   
console.log(q)
      return q;
    }

    //this.Ped_ = [];
    this.pedidoS.getPedidosRep01(query).subscribe(ped =>{
      this.Ped_ = ped;
      this.data = this.Ped_;
      this.dtTrigger.next();
    })
    
    $('#dtable').DataTable().destroy();

    
    this.opcrep01=true;
    //this.data.destroy();
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


}
