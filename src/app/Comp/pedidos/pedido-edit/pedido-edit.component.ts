import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Pedido } from 'src/app/models/pedido';
import { PedidoDet } from 'src/app/models/pedidoDet';
import { PedidoService } from 'src/app/services/pedido.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { animate, state,style,transition,trigger } from '@angular/animations';

//  Service 
import { ClientService } from '../../../services/client.service';
import { VendedorService } from '../../../services/vendedor.service';
import { LprecioService } from '../../../services/lprecio.service';
import { CpagoService } from '../../../services/cpago.service';
import { ProductService } from '../../../services/product.service';
import { UmedidaService } from '../../../services/umedida.service';
import { IimpuestoService } from '../../../services/iimpuesto.service';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';
import { TipodService } from 'src/app/services/tipod.service';
// Class
import { Client } from '../../../models/client';
import { Vendedor } from '../../../models/vendedor';
import { Lprecio } from '../../../models/lprecio';
import { Cpago } from '../../../models/cpago';
import { Product } from '../../../models/product';
import { Umedida } from '../../../models/umedida';
import { Iimpuesto } from '../../../models/iimpuesto';
import { Tipod } from '../../../models/tipod';
import { registerLocaleData } from '@angular/common';
import { reduce } from 'rxjs/operators';
import { noUndefined } from '@angular/compiler/src/util';
import * as $ from 'jquery';

@Component({
  selector: 'app-pedido-edit',
  templateUrl: './pedido-edit.component.html',
  styleUrls: ['./pedido-edit.component.css']
})
export class PedidoEditComponent implements OnInit {
  ocultarBtn: string;
  MostrarPed: string;
  mensaje01: string;
  opcnf = false;
  opcnd = false;
  opcne = false;
  estadoElement= "estado1";
  currencyPipeVEF='VEF';
  currencyPipeUSD='USD';
  currencyPipe: String;
  elementoBorrados: PedidoDet[]=[];

  valorAutPed = "";
  pedidoslistDet=[];
  pedido_ = {} as Pedido;
  pedidoDet_ = {} as PedidoDet;

  totalPri: number = 0;
  totalCnt: number = 0;
  totalPed: number = 0;

  tmontb: number=0;
  tmontd: number=0;
  tmonti: number=0;
  tmontn: number=0;
  
  public pedidoslist: Pedido[];
  public clienteList: Client[]; //arreglo vacio
  public vendedorList: Vendedor[]; //arreglo vacio
  public lprecioList: Lprecio[]; //arreglo vacio
  public cpagoList: Cpago[]; //arreglo vacio
  public productList: Product[]; //arreglo vacio
  public umedidaList: Umedida[]; //arreglo vacio
  public iimpuestoList: Iimpuesto[]; //arreglo vacio
  public tipodocList: Tipod[]; //arreglo vacio

  public keywordPed = "uid";
  public keywordsCli = ['idcliente','descripcion'];
 
  maxDate: Date;
  enviar = false;
  private myempty: number;
  public msj_enlace: string = 'Pedidos';

  @ViewChild('pedidoFormnf') myFormnf;
  @ViewChild('pedidoFormnd') myFormnd;
  @ViewChild('pedidoFormne') myFormne;
  constructor
  ( 
    public pedidoService: PedidoService,
    private toastr      : ToastrService,
    public clienteS     : ClientService,
    public vendedorS    : VendedorService,
    public lprecioS     : LprecioService,
    public cpagoS       : CpagoService,
    public productS     : ProductService,
    public umedidaS     : UmedidaService,
    public iimpuestoS   : IimpuestoService,
    public loginS       : FirebaseloginService,
    public tipodS       : TipodService
  ) 
  {
    const currentYear = new Date().getFullYear();
    const currentm = new Date().getMonth();
    const currentd = new Date().getDate();
    this.maxDate = new Date(currentYear, currentm, currentd);
  }

   
  ngOnInit(): void {
    this.ocultarBtn = 'padding: 10px;display:none;';

    this.MostrarPed = 'display:none;';
    this.pedidoService.getPedidos().subscribe(pedidos=>{
      this.pedidoslist = pedidos;
    })
    this.pedido_ = {} as Pedido;
    this.valorAutPed = "";

    this.clienteS.getClients().valueChanges().subscribe(cs =>{
      this.clienteList = cs;
    })

    this.vendedorS.getVendedors().valueChanges().subscribe(vs =>{
      this.vendedorList = vs;
    })

    this.lprecioS.getLprecio().valueChanges().subscribe(lps =>{
      this.lprecioList = lps;
    })

    this.cpagoS.getCpagos().valueChanges().subscribe(cps =>{
      this.cpagoList = cps;
    })

    this.productS.getProducts().valueChanges().subscribe(ps =>{
      this.productList = ps;
    })

    this.umedidaS.getUmedidas().valueChanges().subscribe(ums =>{
      this.umedidaList = ums;
    })    

    this.iimpuestoS.getIimpuestos().valueChanges().subscribe(iis =>{
      this.iimpuestoList = iis;
    })

    this.tipodS.getTipods().valueChanges().subscribe(tid =>{
      this.tipodocList = tid;
    })

    
    this.enviar = false;
    //coloca el campo de busqueda de vendedror disabled
    this.pedidoService.disabledFieldVen = true;
  }

  onSubmitnf(pf?: NgForm){
    if(this.pedido_.uid != null){
      this.pedido_.status="FACTURADO";
      this.pedido_.modificado = new Date;
      this.pedido_.modificadopor = this.loginS.getCurrentUser().email;
      //Update Pedido - Notifi Facttura
      this.pedidoService.updatePedidos(this.pedido_);
      this.toastr.success('Operación Terminada', 'Nofificacinón de factura Creada');
    }
  }
  onSubmitnd(pf?: NgForm){
    if(this.pedido_.uid != null){
      this.pedido_.status="DESPACHADO";
      this.pedido_.modificado = new Date;
      this.pedido_.modificadopor = this.loginS.getCurrentUser().email;
      //Update Pedido - Notifi Facttura
      this.pedidoService.updatePedidos(this.pedido_);
      this.toastr.success('Operación Terminada', 'Nofificacinón de despacho creada');
    }
  }
  onSubmitne(pf?: NgForm){
    if(this.pedido_.uid != null){
      this.pedido_.status="ENTREGADO";
      this.pedido_.modificado = new Date;
      this.pedido_.modificadopor = this.loginS.getCurrentUser().email;
      //Update Pedido - Notifi Facttura
      this.pedidoService.updatePedidos(this.pedido_);
      this.toastr.success('Operación Terminada', 'Nofificacinón de entrega creada');
    }
    
  }
  anulardoc(pf?: NgForm){
    if(confirm('¿Está seguro de que quiere anular la notificación de factura actual?')) {
      if(this.pedido_.uid != null){
          this.pedido_.status="ACTIVO";
          this.pedido_.modificado = new Date;
          this.pedido_.modificadopor = this.loginS.getCurrentUser().email;
          //this.pedido_.ffactura = null;
          this.pedido_.tipodoc = "";
          this.pedido_.nrofactura = "";
          this.pedidoService.updatePedidos(this.pedido_);

          if(pf != null) pf.reset();
      }
      this.toastr.warning('Operación Terminada', 'Notificación de Factura, anulada');
    }
  }
  resetFormnf(pf?: NgForm){
    if(pf != null) pf.reset();
    this.pedidoService.txtBtnAccion = "Guardar"; 
  }
  resetFormnd(pf?: NgForm){
    if(pf != null) pf.reset();
    this.pedidoService.txtBtnAccion = "Guardar"; 
  }
  resetFormne(pf?: NgForm){
    if(pf != null) pf.reset();
    this.pedidoService.txtBtnAccion = "Guardar"; 
  }

  moForm(opc?: number){
    if (opc==1){
      this.opcnf = true;
      this.opcnd = false;
      this.opcne = false;
      
      if (this.pedido_.ffactura == null || typeof this.pedido_.ffactura === "undefined"){
        this.pedido_.ffactura =  new Date();
      }else{
        this.pedido_.ffactura = this.pedido_.ffactura;
      }

      this.pedidoService.txtBtnAccion = "Guardar";     
    } 

    if (opc==2){
      this.opcnf = false;
      this.opcnd = true;
      this.opcne = false;
      
      if (this.pedido_.fdespacho == null || typeof this.pedido_.fdespacho === "undefined"){
        this.pedido_.fdespacho =  new Date();
      }else{
        this.pedido_.fdespacho = this.pedido_.fdespacho;
      }

      if (this.pedido_.ftentrega == null || typeof this.pedido_.ftentrega === "undefined"){
        this.pedido_.ftentrega =  new Date();
      }else{
        this.pedido_.ftentrega = this.pedido_.ftentrega;
      }

      this.pedidoService.txtBtnAccion = "Guardar"; 
    } 

    if (opc==3){
      this.opcnf = false;
      this.opcnd = false;
      this.opcne = true;

      if (this.pedido_.fentrega == null || typeof this.pedido_.fentrega === "undefined"){
        this.pedido_.fentrega =  new Date();
      }else{
        this.pedido_.fentrega = this.pedido_.fentrega;
      }

      if (this.pedido_.fpago == null || typeof this.pedido_.fpago === "undefined"){
        this.pedido_.fpago =  new Date();
      }else{
        this.pedido_.fpago = this.pedido_.fpago;
      }

      this.pedidoService.txtBtnAccion = "Guardar"; 
    } 
  }

  timestampConvert(fec){
    let dateObject = new Date(fec.seconds*1000);
    let mes_ = dateObject.getMonth()+1;
    let ano_ = dateObject.getFullYear();
    let dia_ = dateObject.getDate();
    return dateObject;
  }

  selectEventPed(elemento){

    this.pedido_ =  Object.assign({}, elemento);
    
    if (this.pedido_.uid){
      this.MostrarPed = 'display:block;';
    }

    if (elemento.fechapedido != null && typeof elemento.fechapedido != "undefined"){
        this.pedido_.fechapedido = this.timestampConvert(elemento.fechapedido);
    }
    if (elemento.ffactura != null || typeof elemento.ffactura != "undefined"){
        this.pedido_.ffactura = this.timestampConvert(elemento.ffactura);
    }
    if (elemento.ftentrega != null || typeof elemento.ftentrega != "undefined"){
        this.pedido_.ftentrega = this.timestampConvert(elemento.ftentrega);
    }
    if (elemento.fentrega != null || typeof elemento.fentrega != "undefined"){
        this.pedido_.fentrega = this.timestampConvert(elemento.fentrega);
    }
    if (elemento.fdespacho != null || typeof elemento.fdespacho != "undefined"){
        this.pedido_.fdespacho = this.timestampConvert(elemento.fdespacho);
    }
    if (elemento.fpago != null || typeof elemento.fpago != "undefined"){
        this.pedido_.fpago = this.timestampConvert(elemento.fpago);
    }
    
    
    
    this.moForm(this.pedidoService.selectedIndex);

    //Get Order detaills
    this.pedidoService.getPedidosDet(elemento.uid).subscribe(pedidosDet=>{
      this.pedidoslistDet = pedidosDet;
  
      for (let i in this.pedidoslistDet){
        this.totalPri = this.totalPri +  this.pedidoslistDet[i].preciomaterial;
        this.totalCnt = this.totalCnt +  this.pedidoslistDet[i].cantidadmaterial;
        this.totalPed = this.totalPed +  this.pedidoslistDet[i].totalpormaterial;
    
        //this.tmontb = this.tmontb + this.pedidoslistDet[i].totalpormaterial;
      }

      //Calculo del descuento en base al monto bruto
      this.tmontb = this.totalPed;
      this.tmontd = (this.totalPed*this.pedido_.descuentoporc)/100;
        
      //Calculo del Impuesto en base al monto bruto
      let montoDescAux=0;
      if (this.tmontd>0){
        montoDescAux = this.tmontd;
      }
      this.tmonti = ((this.tmontb - montoDescAux)* this.pedido_.indicadorImpuestoporc)/100;
    
      //Calculo Monto Neto anterior
      //this.tmontn = (this.tmontb - montoDescAux) + this.tmonti;
      //Calculo Monto Neto sin iva
      this.tmontn = (this.tmontb - montoDescAux);
    })


    if (this.opcnf == true){
      if (this.pedido_.status == "ACTIVO" || this.pedido_.status == "FACTURADO"){
        this.ocultarBtn = "padding: 10px;display:block;";
      }else{
        this.mensaje01 = " Este pedido tiene asignada una factura"
        this.ocultarBtn = "padding: 10px;display:none;";
      }
    }
    if (this.opcnd == true){
      if (this.pedido_.status == "FACTURADO" ||  this.pedido_.status == "DESPACHADO"){
        this.ocultarBtn = "padding: 10px;display:block;";
      }else{
        this.mensaje01 = " Este pedido contiene una solicitud de despacho"
        this.ocultarBtn = "padding: 10px;display:none;";
      }
    }
    if (this.opcne == true){
      if (this.pedido_.status == "DESPACHADO" ||  this.pedido_.status == "ENTREGADO"){
        this.ocultarBtn = "padding: 10px;display:block;";
      }else{
        this.mensaje01 = " Este pedido contiene una solicitud de entrega"
        this.ocultarBtn = "padding: 10px;display:none;";
      }
    }

  }

  onChangeSearchPed(elemento){

    this.pedido_ =  Object.assign({}, elemento);
    if (this.pedido_.uid){
      this.MostrarPed = 'display:block;';
    }

    if (elemento.fechapedido != null && typeof elemento.fechapedido != "undefined"){
      this.pedido_.fechapedido = this.timestampConvert(elemento.fechapedido);
    }
    if (elemento.ffactura != null || typeof elemento.ffactura != "undefined"){
        this.pedido_.ffactura = this.timestampConvert(elemento.ffactura);
    }
    if (elemento.ftentrega != null || typeof elemento.ftentrega != "undefined"){
        this.pedido_.ftentrega = this.timestampConvert(elemento.ftentrega);
    }
    if (elemento.fentrega != null || typeof elemento.fentrega != "undefined"){
        this.pedido_.fentrega = this.timestampConvert(elemento.fentrega);
    }
    if (elemento.fdespacho != null || typeof elemento.fdespacho != "undefined"){
        this.pedido_.fdespacho = this.timestampConvert(elemento.fdespacho);
    }
    if (elemento.fpago != null || typeof elemento.fpago != "undefined"){
        this.pedido_.fpago = this.timestampConvert(elemento.fpago);
    }

    this.moForm(this.pedidoService.selectedIndex);

    //Get Order detaills
    this.pedidoService.getPedidosDet(elemento.uid).subscribe(pedidosDet=>{
      this.pedidoslistDet = pedidosDet;
  
      for (let i in this.pedidoslistDet){
        this.totalPri = this.totalPri +  this.pedidoslistDet[i].preciomaterial;
        this.totalCnt = this.totalCnt +  this.pedidoslistDet[i].cantidadmaterial;
        this.totalPed = this.totalPed +  this.pedidoslistDet[i].totalpormaterial;
    
        //this.tmontb = this.tmontb + this.pedidoslistDet[i].totalpormaterial;
      }

      //Calculo del descuento en base al monto bruto
      this.tmontb = this.totalPed;
      this.tmontd = (this.totalPed*this.pedido_.descuentoporc)/100;
        
      //Calculo del Impuesto en base al monto bruto
      let montoDescAux=0;
      if (this.tmontd>0){
        montoDescAux = this.tmontd;
      }
      this.tmonti = ((this.tmontb - montoDescAux)* this.pedido_.indicadorImpuestoporc)/100;
    
      //Calculo Monto Neto anterior
      //this.tmontn = (this.tmontb - montoDescAux) + this.tmonti;
      //Calculo Monto Neto sin iva
      this.tmontn = (this.tmontb - montoDescAux);
    })

    if (this.pedido_.status == "ACTIVO"){
      this.ocultarBtn = "padding: 10px;display:block;";
    }else{
      this.ocultarBtn = "padding: 10px;display:none;";
    }

  }

  closeautoCompletePed(){
 
    this.MostrarPed = 'display:none;';
    this.mensaje01 = "";
    this.valorAutPed = "";
    this.pedido_.uid = "";
    this.pedido_.fechapedido = null;
    this.pedido_.status = "";
    this.pedido_.idcliente = "";
    this.pedido_.idvendedor = "";
    this.pedido_.nomvendedor = "";
    this.pedido_.condiciondepago = "";
    this.pedido_.nomcliente = "";
    this.pedido_.email = "";
    this.pedido_.listaprecio = "";
    this.pedido_.codigodematerial = "Ninguno";
    this.pedido_.descripcionmaterial = "";
    this.pedido_.preciomaterial = this.myempty;
    this.pedido_.cantidadmaterial = this.myempty;
    this.pedido_.totalpormaterial = this.myempty;
    this.pedidoslistDet = []; // vacia la instancia
    this.pedido_ = {} as Pedido;
    this.totalPri = 0;
    this.totalCnt = 0;
    this.totalPed = 0;

    this.tmontb = 0;
    this.tmontd = 0;
    this.tmonti = 0;
    this.tmontn = 0;
    this.pedido_.descuentovalor = this.myempty;
    this.pedido_.descuentoporc = this.myempty;
    if (this.pedidoService.selectedIndex==1){
      this.resetFormnf(this.myFormnf);
    }
    if (this.pedidoService.selectedIndex==2){
      this.resetFormnf(this.myFormnd);
    }
    if (this.pedidoService.selectedIndex==3){
      this.resetFormnf(this.myFormne);
    }
  }

}//class
