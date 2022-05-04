import { Component, OnInit,ViewChild } from '@angular/core';
import { CobrosService } from 'src/app/services/cobros.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Pedido } from 'src/app/models/pedido';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';

//  Service 
import { Cobro } from 'src/app/models/cobro';
import { CobroDet } from 'src/app/models/cobro-det';
import { VpagoService } from '../../../services/vpago.service';
import { BancoService } from '../../../services/banco.service';
//models
import { Vpago } from '../../../models/vpago';
import { Banco } from '../../../models/banco';
import { TipodocCobros } from 'src/app/models/tipodoc-cobros';
import { TipodcobrosService } from 'src/app/services/tipodcobros.service';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-gcobrov-list',
  templateUrl: './gcobrov-list.component.html',
  styleUrls: ['./gcobrov-list.component.css']
})
export class GcobrovListComponent implements OnInit {
  txtComentario = "";
  mostrardiv:boolean=false;
  pedIndex: number=-990;
  idpedidoEli: string="";
  fechapedidoEli: Date;
  clientepedidoEli: string="";
  montodepago = 0;
  disableBSF =  false;
  
  //var
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Pedido', 'Factura','Condicion', 'Fecha','Cliente','Vendedor', 'Subtotal', 'totalmontoimpuesto', 'totalmontoneto','abono','Opc'];
  cobro_ = {} as Cobro;
  cobroDet_ = {} as CobroDet;
  MostrarCob: string;
  vp_efectivo=true;
  pagototal=true;
  pagoparcialpagado:number;
  ver:boolean;
  public vpagoList: Vpago[]; //arreglo vacio
  public tipodocList: TipodocCobros[]; //arreglo vacio
  public bancoList: Banco[]; //arreglo vacio
  cobroslist = [];
  matrisDetCobro: CobroDet[]=[];
  pedidoCobro: Pedido[];
  sendemail=false;
  importeremanente = 0;
  visual = false;

  constructor(
    public cobroService: CobrosService,
    public loginS      : FirebaseloginService,
    private toastr     : ToastrService,
    public vpagoS      : VpagoService,
    public tipodcobroS : TipodcobrosService,
    public bancoS      : BancoService,
    public pedidoS     : PedidoService,
  ) { }

  ngOnInit(): void {
    this.cobro_ = {} as Cobro;

    this.pedidoS.getPedidosPagoVencido().subscribe(cobros => {
      let cobrosArray = [];
      cobrosArray = cobros;
      //Filtramos en el array a mostrar los elementos que no tienen el pago completo
      this.cobroslist = cobrosArray.filter( elemento => {
        if (elemento.montodepago) {
          return elemento.montodepago < elemento.totalmontoneto
        } else {
          return elemento;
        }
      })
      
      //ELEMENT_DATA
      this.dataSource = new MatTableDataSource(this.cobroslist);
      this.dataSource.sort = this.sort;
    })

    this.vpagoS.getVpagos().valueChanges().subscribe(vps =>{
      this.vpagoList = vps;
    })

    this.tipodcobroS.getTipods().valueChanges().subscribe(tipdoc => {
      this.tipodocList = tipdoc;
    });

    this.bancoS.getBancos().valueChanges().subscribe(bc =>{
      this.bancoList = bc;
    })

  }//ngOnInit

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }//applyFilter
  checkValue(){
  }

  vpagoselected(val) {
    if (val.substr(0,3)!="EFE") {
      this.vp_efectivo=false;
    } else {
      this.cobro_.banco = "";
      //this.cobro_.nroreferencia="";
      this.vp_efectivo=true;
    }
  }//vpagoselected

  bancoselected(val) {
    //Buscamos en la lista de bancos el que coincida con el nombre del banco seleccionado y determinamos su moneda
    let bancoSelected = this.bancoList.find( banco => banco.nombre == val);
    this.cobroDet_.moneda = bancoSelected.moneda;

    if ( this.cobroDet_.moneda !== "BSF") this.disableBSF = true;
    else this.disableBSF = false;
    
  }

  tpagoselected(val) {
  
    if (val == "TOTAL"){
      let mp:number=0;
      for (let i in this.matrisDetCobro){
        mp = mp + Number(this.matrisDetCobro[i].montodepago);
      }

      //this.cobroDet_.montodepago = parseFloat((this.cobro_.totalmontoneto-mp).toFixed(2));
      this.montodepago = this.cobroDet_.montodepago;
      this.pagototal = true;
      this.disableBSF = true;
    }

    if (val == "PARCIAL") {
      this.montodepago = 0;
      this.cobroDet_.montodepago = Number(this.montodepago);
      this.pagototal = false;
      this.disableBSF = false;
    }
  }

  timestampConvert(fec){
    let dateObject = new Date(fec.seconds*1000);
    let mes_ = dateObject.getMonth()+1;
    let ano_ = dateObject.getFullYear();
    let dia_ = dateObject.getDate();
    return dateObject;
  }//timestampConvert

  montoChanged(monto) {
    let montostring = monto;
    /* if (Number(montostring) > (this.cobro_.totalmontoneto - this.cobro_.montodepago)) {
      this.montodepago = 0;
    } */
  }

  onCancelar(pf?: NgForm){
    if(pf != null) pf.reset();
    this.cobroslist=[];
    this.cobro_ = {} as Cobro;
    this.cobroDet_ = {} as CobroDet;
    this.MostrarCob = 'display:none;';
    this.pagoparcialpagado=0;
    this.ver=false;
  }//onCancelar

  verdetalles($event,elemento) {

    this.ver = true;
    this.visual = true;
    this.cobro_ =  Object.assign({}, elemento);

    let id = this.cobro_.idpedido.toString();

    this.pedidoS.getSpecificPedido(id).subscribe(ped => {
      let pedido:any[] = ped ;
      this.pedidoCobro = ped;
    });

    if (this.cobroDet_.fechadepago == null || typeof this.cobroDet_.fechadepago === "undefined"){
      this.cobroDet_.fechadepago =  new Date(); //propone la fecha actual
    }

    if (elemento.fpvencimiento != null && typeof elemento.fpvencimiento != "undefined"){
      //this.cobro_.fpvencimiento = this.timestampConvert(elemento.fpvencimiento);
    } 
    if (elemento.fechadepago != null && typeof elemento.fechadepago != "undefined"){
      this.cobro_.fechadepago = this.timestampConvert(elemento.fechadepago);
    } 

    //Valida la via de pago 
    /* if (this.cobro_.viadepago.substr(0,3)!="EFE"){
      this.vp_efectivo=false;
    } else {
      this.cobro_.banco = "";
      this.cobro_.nroreferencia="";
      this.vp_efectivo=true;
    } */

    if ( this.cobro_.montodepago ) {
      //this.importeremanente = this.roundTo(this.cobro_.totalmontoneto - this.cobro_.montodepago,2);
    } else {
      this.importeremanente = 0;
    }

    //Get Order detaills
    this.pagoparcialpagado = 0;
    this.cobroService.getCobrosDet(elemento.idpedido.toString()).subscribe(cobrosDet=>{
      //this.cobroslistDet = cobrosDet;
      this.matrisDetCobro = cobrosDet;

      for (let i in this.matrisDetCobro) {
        this.matrisDetCobro[i].fechadepago = this.timestampConvert(this.matrisDetCobro[i].fechadepago);
        this.pagoparcialpagado = (this.pagoparcialpagado + this.matrisDetCobro[i].montodepago);
      }

      this.cobro_.montodepago = this.pagoparcialpagado


      if ( this.cobro_.montodepago ) {
        //this.importeremanente = this.roundTo(this.cobro_.totalmontoneto - this.cobro_.montodepago,2);
      } else {
        this.importeremanente = 0;
      }
              
    }) 
    
    if (this.cobro_.uid){
      this.MostrarCob = 'display:block;';
    }
  }//verdetalles

  selectEventCob(elemento) {

    this.visual = false;

    this.cobro_ =  Object.assign({}, elemento);

    let id = this.cobro_.idpedido.toString();

    this.pedidoS.getSpecificPedido(id).subscribe(ped => {
      let pedido:any[] = ped ;
      this.pedidoCobro = ped;
    });

    if (this.cobroDet_.fechadepago == null || typeof this.cobroDet_.fechadepago === "undefined"){
      this.cobroDet_.fechadepago =  new Date(); //propone la fecha actual
    }

    if (elemento.fpvencimiento != null && typeof elemento.fpvencimiento != "undefined"){
      ///this.cobro_.fpvencimiento = this.timestampConvert(elemento.fpvencimiento);
    } 
    if (elemento.fechadepago != null && typeof elemento.fechadepago != "undefined"){
      this.cobro_.fechadepago = this.timestampConvert(elemento.fechadepago);
    } 

    //Valida la via de pago 
    /* if (this.cobro_.viadepago.substr(0,3)!="EFE") {
      this.vp_efectivo=false;
    } else {
      this.cobroDet_.banco = "";
      //this.cobroDet_.nroreferencia="";
      this.vp_efectivo=true;
    } */


    //Get Order detaills
    this.pagoparcialpagado = 0;
    this.cobroService.getCobrosDet(elemento.idpedido.toString()).subscribe(cobrosDet=>{

      this.matrisDetCobro = cobrosDet;

      for (let i in this.matrisDetCobro) {
        this.matrisDetCobro[i].fechadepago = this.timestampConvert(this.matrisDetCobro[i].fechadepago);
        this.pagoparcialpagado = this.pagoparcialpagado + Number(this.matrisDetCobro[i].montodepago);
      }

      this.cobro_.montodepago = this.pagoparcialpagado


      if ( this.cobro_.montodepago ) {
        //this.importeremanente = this.roundTo(this.cobro_.totalmontoneto - this.cobro_.montodepago,2);
      } else {
        this.importeremanente = 0;
      }
              
    }) 
    
    if (this.cobro_.uid){
      this.MostrarCob = 'display:block;';
    }

  }//selectEventCob

  onEdit(event, ped){

  }//onEdit

  moForm(){
    if (this.cobroService.mostrarForm){
      this.cobroService.mostrarForm = false;
    }else{
      this.cobroService.mostrarForm = true;
    }


  }//moForm

  onSubmit(pf?: NgForm){
    if(this.cobro_.uid != null){

      this.cobroDet_.fechadepago =  new Date(this.cobroDet_.fechadepago);
      this.cobro_.fechadepago = new Date(this.cobroDet_.fechadepago);

      if (this.cobroDet_.tipopago == "TOTAL") {
        //this.cobro_.montodepago = this.cobro_.totalmontoneto;
        if(this.cobroDet_.montobsf) { this.cobro_.montobsf = this.cobroDet_.montobsf }
       // this.cobro_.statuscobro="CERRADA";
      }

      if (this.cobroDet_.tipopago == "PARCIAL") {
        //this.cobro_.statuscobro="PARCIAL";
        this.cobro_.montodepago += Number(this.montodepago);
        if(this.cobroDet_.montobsf) { this.cobro_.montobsf = this.cobroDet_.montobsf }

        //if (this.cobro_.totalmontoneto.toFixed(2) ==  this.cobro_.montodepago.toFixed(2)){
          //this.cobro_.statuscobro="CERRADA";
        //}
      }

      this.cobro_.viadepago = this.cobroDet_.viadepago;
      this.cobro_.banco = this.cobroDet_.banco;
      this.cobro_.tipopago = this.cobroDet_.tipopago;
    
      this.cobro_.modificado = new Date;
      this.cobro_.modificadopor = this.loginS.getCurrentUser().email;
 
      this.cobroDet_.uid = this.cobro_.idpedido.toString();
      this.cobroDet_.montodepago = Number(this.montodepago);

      //---------------------------------------------------------
      //Update Cobro - 
      this.cobroService.updatecobros(this.cobro_);
      //Add detalles de cobro
      this.cobroService.addCobrosDet(this.cobroDet_);

      this.toastr.success('Operación Terminada', 'Registro Actualizado');
    }
    this.onCancelar(pf);
  }//onsubmit

  removeDetRow(i){
    if(confirm('¿Está seguro de que quiere eliminar este elemento?.')) {
      this.cobroService.deleteCobrosDet(this.matrisDetCobro[i].docid);
      this.pagoparcialpagado=0;
      //Update Cobro -
     // this.cobro_.statuscobro="PARCIAL";
      this.cobroService.updatecobros(this.cobro_);
      this.toastr.show('Elemento Eliminado','Operación Terminada');
    }
  }

  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };
}
