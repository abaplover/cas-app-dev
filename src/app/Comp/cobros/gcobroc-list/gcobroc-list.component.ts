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
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-gcobroc-list',
  templateUrl: './gcobroc-list.component.html',
  styleUrls: ['./gcobroc-list.component.css']
})
export class GcobrocListComponent implements OnInit {
  txtComentario = "";
  mostrardiv:boolean=false;
  pedIndex: number=-990;
  idpedidoEli: string="";
  fechapedidoEli: Date;
  clientepedidoEli: string="";
  
  //var
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  displayedColumns: string[] = ['Pedido', 'Factura', 'Status', 'Condicion', 'Fecha','Cliente','Vendedor', 'Subtotal', 'totalmontoimpuesto', 'totalmontoneto','demora', 'Opc'];
  
  cobro_ = {} as Cobro;
  cobroDet_ = {} as CobroDet;
  MostrarCob: string;
  vp_efectivo=true;
  pagototal=true;
  pagoparcialpagado:number;
  ver:boolean;

  public vpagoList: Vpago[]; //arreglo vacio
  public bancoList: Banco[]; //arreglo vacio
  cobroslist = [];
  matrisDetCobro: CobroDet[]=[];

  constructor(
    public cobroService: CobrosService,
    public loginS      : FirebaseloginService,
    private toastr     : ToastrService,
    public vpagoS      : VpagoService,
    public bancoS      : BancoService
  ) { }

  ngOnInit(): void {
    this.cobro_ = {} as Cobro;

    this.cobroService.getCobrosC().subscribe(cobros=>{
      this.cobroslist = cobros;
      

      //ELEMENT_DATA
      this.dataSource = new MatTableDataSource(this.cobroslist);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })

    this.vpagoS.getVpagos().valueChanges().subscribe(vps =>{
      this.vpagoList = vps;
    })

    this.bancoS.getBancos().valueChanges().subscribe(bc =>{
      this.bancoList = bc;
    })

  }//ngOnInit

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }//applyFilter
  checkValue(){
    console.log("valor");
  }
  vpagoselected(val){
    if (val!="Efectivo"){
      this.vp_efectivo=false;
    }else{
      this.cobro_.banco = "";
      //this.cobro_.nroreferencia="";
      this.vp_efectivo=true;
    }
  }//vpagoselected

  tpagoselected(val){
  
    if (val == "Pago Total"){
      let mp:number=0;
      for (let i in this.matrisDetCobro){
        mp = mp + this.matrisDetCobro[i].montodepago;
        //this.matrisDetCobro[i].fechadepago = this.timestampConvert(this.matrisDetCobro[i].fechadepago);
      }
     // this.cobroDet_.montodepago = parseFloat((this.cobro_.totalmontoneto-mp).toFixed(2));
      this.pagototal = true;
    }

    if (val == "Pago Parcial"){
      let aux:number=0;
      this.cobroDet_.montodepago = aux;
      this.pagototal = false;
    }
  }

  timestampConvert(fec){
    let dateObject = new Date(fec.seconds*1000);
    let mes_ = dateObject.getMonth()+1;
    let ano_ = dateObject.getFullYear();
    let dia_ = dateObject.getDate();
    return dateObject;
  }//timestampConvert

  onCancelar(pf?: NgForm){
    if(pf != null) pf.reset();
    this.cobroslist=[];
    this.cobro_ = {} as Cobro;
    this.cobroDet_ = {} as CobroDet;
    this.MostrarCob = 'display:none;';
    this.pagoparcialpagado=0;
    this.ver=false;
  }//onCancelar

  verdetalles($event,elemento){
    this.ver = true;
    this.cobro_ =  Object.assign({}, elemento);

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
    if (this.cobro_.viadepago != "Efectivo"){
      this.vp_efectivo=false;
    }else{
      this.cobro_.banco = "";
      //this.cobro_.nroreferencia="";
      this.vp_efectivo=true;
    }


    //Get Order detaills
    this.pagoparcialpagado = 0;
    this.cobroService.getCobrosDet(elemento.idpedido.toString()).subscribe(cobrosDet=>{
      //this.cobroslistDet = cobrosDet;
      this.matrisDetCobro = cobrosDet;
      for (let i in this.matrisDetCobro){
        this.matrisDetCobro[i].fechadepago = this.timestampConvert(this.matrisDetCobro[i].fechadepago);
        this.pagoparcialpagado = (this.pagoparcialpagado + this.matrisDetCobro[i].montodepago);
      }
              
    }) 
    
    if (this.cobro_.uid){
      this.MostrarCob = 'display:block;';
    }
  }//verdetalles

  selectEventCob(elemento){
    this.cobro_ =  Object.assign({}, elemento);

    if (this.cobroDet_.fechadepago == null || typeof this.cobroDet_.fechadepago === "undefined"){
      this.cobroDet_.fechadepago =  new Date(); //propone la fecha actual
    }

    if (elemento.fpvencimiento != null && typeof elemento.fpvencimiento != "undefined"){
     // this.cobro_.fpvencimiento = this.timestampConvert(elemento.fpvencimiento);
    } 
    if (elemento.fechadepago != null && typeof elemento.fechadepago != "undefined"){
      this.cobro_.fechadepago = this.timestampConvert(elemento.fechadepago);
    } 

    //Valida la via de pago 
    if (this.cobro_.viadepago != "Efectivo"){
      this.vp_efectivo=false;
    }else{
      this.cobro_.banco = "";
      //this.cobro_.nroreferencia="";
      this.vp_efectivo=true;
    }


    //Get Order detaills
    this.pagoparcialpagado = 0;
    this.cobroService.getCobrosDet(elemento.idpedido.toString()).subscribe(cobrosDet=>{
      //this.cobroslistDet = cobrosDet;
      this.matrisDetCobro = cobrosDet;
      for (let i in this.matrisDetCobro){
        this.matrisDetCobro[i].fechadepago = this.timestampConvert(this.matrisDetCobro[i].fechadepago);
        this.pagoparcialpagado = (this.pagoparcialpagado + this.matrisDetCobro[i].montodepago);
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
      this.cobro_.montodepago=0;
    
      this.cobro_.modificado = new Date;
      this.cobro_.modificadopor = this.loginS.getCurrentUser().email;
 
      this.cobroDet_.uid = this.cobro_.idpedido.toString();
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
      //this.cobro_.statuscobro="PARCIAL";
      this.cobroService.updatecobros(this.cobro_);
      this.toastr.show('Elemento Eliminado','Operación Terminada');
    }
  }
}
