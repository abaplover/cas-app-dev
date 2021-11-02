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
import { MrechazoService } from 'src/app/services/mrechazo.service';
// Class
import { Client } from '../../../models/client';
import { Vendedor } from '../../../models/vendedor';
import { Lprecio } from '../../../models/lprecio';
import { Cpago } from '../../../models/cpago';
import { Product } from '../../../models/product';
import { Umedida } from '../../../models/umedida';
import { Iimpuesto } from '../../../models/iimpuesto';
import { registerLocaleData } from '@angular/common';
import { reduce } from 'rxjs/operators';
import { noUndefined } from '@angular/compiler/src/util';



import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css'],
})
export class PedidoComponent implements OnInit {
 // +PARA EL LISTAR PEDIDOS +
 // @ViewChild('codMateri', { static: false }) codMat: ElementRef;

  dataSource: any;
  pedidoslist = [];
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['uid', 'Fecha', 'Status', 'Cliente', 'Vendedor', 'totalCnt', 'totalmontoimpuesto', 'totalmontodescuento', 'totalmontoneto', 'Opc'];

  pedIndex: number=-990;
  idpedidoEli: string="";
  fechapedidoEli: Date;
  clientepedidoEli: string="";
  mostrardiv:boolean=false;

  txtComentario = "";
  pedidoslistDet=[];
  // +PARA EL LISTAR PEDIDOS +
  
  
  
  estadoElement= "estado1";
  currencyPipeVEF='VEF';
  currencyPipeUSD='USD';
  currencyPipe: String;
  elementoBorrados: PedidoDet[]=[];



  public clienteList: Client[]; //arreglo vacio
  public vendedorList: Vendedor[]; //arreglo vacio
  public lprecioList: Lprecio[]; //arreglo vacio
  public cpagoList: Cpago[]; //arreglo vacio
  public productList: Product[]; //arreglo vacio
  public umedidaList: Umedida[]; //arreglo vacio
  public iimpuestoList: Iimpuesto[]; //arreglo vacio
  public mrechazoList: Iimpuesto[]; //arreglo vacio
  //pedidoService.matrisDetPedido: PedidoDet[]=[];
  
  public keywordCli = "idcliente";
  public keywordsCli = ['idcliente','descripcion'];
  public keywordVen = "idvendedor";
  valorAutCli: string;
  valorAutVen: string;
  maxDate: Date;
  private myempty: number;

  //pedido = {} as Pedido;
  public msj_enlace: string = 'Pedidos';

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
    public mrechazoS    : MrechazoService,  
    public loginS       : FirebaseloginService
  ) 
  {
    const currentYear = new Date().getFullYear();
    const currentm = new Date().getMonth();
    const currentd = new Date().getDate();
    this.maxDate = new Date(currentYear, currentm, currentd);
  }

   
  ngOnInit(): void {
    //this.pedidoService.pedido_.descuentoporc = 0;
    //this.pedidoService.pedido_.descuentovalor = 0;
    this.pedidoService.mostrarForm = false;
    this.pedidoService.valorAutCli = "";
    this.pedidoService.valorAutVen = "";
    this.pedidoService.pedido_.fechapedido = new Date;

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

    this.mrechazoS.getMrechazos().valueChanges().subscribe(mrz =>{
      this.mrechazoList = mrz;
    })

    this.pedidoService.enviar = false;
    //coloca el campo de busqueda de vendedror disabled
    this.pedidoService.disabledFieldVen = true;

    //busca los pedidos con estatus A
    this.pedidoService.getPedidosA().subscribe(pedidos=>{
      this.pedidoslist = pedidos;
      //ELEMENT_DATA
      this.dataSource = new MatTableDataSource(this.pedidoslist);
      this.dataSource.sort = this.sort;
    })

  }









// + FUNCIONES DEL LISTAR+
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarOcultar(event,pedi){
    this.mostrardiv = true;
    this.pedIndex = pedi;
    this.idpedidoEli = this.pedidoslist[this.pedIndex].uid;
    this.fechapedidoEli = this.pedidoslist[this.pedIndex].fechapedido;
    this.clientepedidoEli = this.pedidoslist[this.pedIndex].nomcliente;
    
  }

  onCancelar(pf?: NgForm){
    if(pf != null) pf.reset();
    this.idpedidoEli = "";
    this.clientepedidoEli = "";
    this.mostrardiv = false;
  }

onDelete(event){
  //this.pedidoService.pedido_ =  Object.assign({}, ped);

  if (this.txtComentario != ""){
    if (this.pedIndex!=-990){
      /*this.pedIndex es el indice del pedido que se va a elimanr, se consigue al hacer click 
        en el icono de eliminar en la lista de documentos */
      this.pedidoslist[this.pedIndex].status="ELIMINADO";
      this.pedidoslist[this.pedIndex].modificado = new Date;
      this.pedidoslist[this.pedIndex].modificadopor=this.loginS.getCurrentUser().email;
      this.pedidoslist[this.pedIndex].motivorechazo = this.txtComentario;
      this.pedidoService.deletePedidos(this.pedidoslist[this.pedIndex]);
      this.toastr.show('Pedido Eliminado','Operación Terminada');
      this.mostrardiv=false;
    }
  }
}  

timestampConvert(fec,col?:number){
  let dateObject = new Date(fec.seconds*1000);
  let mes_ = dateObject.getMonth()+1;
  let ano_ = dateObject.getFullYear();
  let dia_ = dateObject.getDate();

  this.pedidoService.pedido_.fechapedido = dateObject;

}




onEdit(event, ped){
  this.pedidoService.totalPri=0;
  this.pedidoService.totalCnt=0;
  this.pedidoService.totalPed=0;

  if (ped.status.toUpperCase() == 'ACTIVO'){
      //console.log(ped);
      this.pedidoService.mostrarForm = true;
      this.pedidoService.txtBtnAccion = "Actualizar Pedido";
      this.pedidoService.readonlyField = true;
      
      this.pedidoService.valorAutCli = ped.idcliente;
      this.pedidoService.valorAutVen = ped.idvendedor;
      //this.pedidoService.pedido_.listaprecio = ped.listaprecio;
      
      this.pedidoService.presAscList = ped.precioasociado;
      this.pedidoService.docAdd = ped.uid;

      this.pedidoService.indicadorImpuesto = ped.indicadorImpuestoporc;
      this.pedidoService.indicadorImpuestoDesc = ped.indicadorImpuestodesc;
  
      this.pedidoService.pedido_ =  Object.assign({}, ped);
      
      this.timestampConvert(ped.fechapedido);

      //Get Order detaills
      this.pedidoService.getPedidosDet(ped.uid).subscribe(pedidosDet=>{
          this.pedidoslistDet = pedidosDet;
          this.pedidoService.matrisDetPedido = this.pedidoslistDet;

          for (let i in this.pedidoService.matrisDetPedido){
            this.pedidoService.totalPri = this.pedidoService.totalPri +  this.pedidoService.matrisDetPedido[i].preciomaterial;
            this.pedidoService.totalCnt = this.pedidoService.totalCnt +  this.pedidoService.matrisDetPedido[i].cantidadmaterial;
            this.pedidoService.totalPed = this.pedidoService.totalPed +  this.pedidoService.matrisDetPedido[i].totalpormaterial;
          }
          //Calculo del descuento en base al monto bruto
          this.pedidoService.tmontb = this.pedidoService.totalPed;
          this.pedidoService.tmontd = (this.pedidoService.totalPed*this.pedidoService.pedido_.descuentoporc)/100;
          this.pedidoService.tmontd = this.pedidoService.tmontd + this.pedidoService.pedido_.descuentovalor;
          //Calculo del Impuesto en base al monto bruto
          let montoDescAux=0;
          if (this.pedidoService.tmontd>0){
            montoDescAux = this.pedidoService.tmontd;
          }
          this.pedidoService.tmonti = ((this.pedidoService.tmontb - montoDescAux)* this.pedidoService.indicadorImpuesto)/100;

          //Calculo Monto Neto Anterior
          //this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux) + this.pedidoService.tmonti;
          //Calculo Monto Neto sin iva
          this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux);

          //Muestra los campos de descuento
          this.pedidoService.mostrardesc = true;

          //console.log('antes: ',this.pedidoService.selectedIndex);
          this.pedidoService.selectedIndex = 0;
          this.pedidoService.enviar=true;
          //console.log('despues: ',this.pedidoService.selectedIndex);
      }) 
  } //Si status es Activo

      
  
  //this.codMat.nativeElement.focus();
 

  
}//onEdit





// + FUNCIONES DEL LISTAR+













  onSubmit(pf?: NgForm){
    //Nuevo Pedido
    if(this.pedidoService.pedido_.uid == null){ 
        //set parameter date
        this.pedidoService.pedido_.fechapedido = new Date(this.pedidoService.pedido_.fechapedido);
        this.pedidoService.pedido_.creado = new Date;
        this.pedidoService.pedido_.modificado = new Date;
        this.pedidoService.pedido_.creadopor = this.loginS.getCurrentUser().email;
        this.pedidoService.pedido_.modificadopor = this.loginS.getCurrentUser().email;
        this.pedidoService.pedido_.status = 'ACTIVO';
        this.pedidoService.pedido_.motivorechazo = "";
        this.pedidoService.pedido_.precioasociado = this.pedidoService.presAscList;
        //campos calculados que no vienen del form
        this.pedidoService.pedido_.totalmontobruto = this.pedidoService.tmontb;
        this.pedidoService.pedido_.totalmontodescuento = this.pedidoService.tmontd;
        this.pedidoService.pedido_.totalmontoimpuesto = this.pedidoService.tmonti;
        this.pedidoService.pedido_.totalmontoneto = this.pedidoService.tmontn;
        this.pedidoService.pedido_.totalPri = this.pedidoService.totalPri; 
        this.pedidoService.pedido_.totalCnt = this.pedidoService.totalCnt;
        this.pedidoService.pedido_.totalPed = this.pedidoService.totalPed;
        this.pedidoService.pedido_.indicadorImpuestodesc = this.pedidoService.indicadorImpuestoDesc;
        this.pedidoService.pedido_.indicadorImpuestoporc = this.pedidoService.indicadorImpuesto;

        //Limpia los campos que se iran al detalle del pedido
        this.pedidoService.pedido_.codigodematerial = "";
        this.pedidoService.pedido_.descripcionmaterial = "";
        this.pedidoService.pedido_.cantidadmaterial = 0;
        this.pedidoService.pedido_.unidaddemedida = "";
        this.pedidoService.pedido_.preciomaterial = 0;
        this.pedidoService.pedido_.totalpormaterial = 0;


        if (this.pedidoService.pedido_.descuentoporc == null || typeof this.pedidoService.pedido_.descuentoporc === "undefined" || isNaN(this.pedidoService.pedido_.descuentoporc)){
          this.pedidoService.pedido_.descuentoporc = 0;
        }
        if (this.pedidoService.pedido_.descuentovalor == null || typeof this.pedidoService.pedido_.descuentovalor === "undefined" || isNaN(this.pedidoService.pedido_.descuentovalor)){
          this.pedidoService.pedido_.descuentovalor = 0;
        }

        //Add in fireStore head
        this.pedidoService.addPedidos(this.pedidoService.pedido_);
        this.pedidoService.tmontb = 0;
        this.pedidoService.tmontd = 0;
        this.pedidoService.tmonti = 0;
        this.pedidoService.tmontn = 0;
        //console.log('id Insertado: ', this.pedidoService.docAdd);
      
          //Add details
        if (this.pedidoService.docAdd != -1){
            //save detaills

            for (let i in this.pedidoService.matrisDetPedido){
             this.pedidoService.matrisDetPedido[i].idpedido=this.pedidoService.pedido_.uid;
              this.pedidoService.addPedidosDet(this.pedidoService.matrisDetPedido[i]);
            }
            this.pedidoService.totalPri = 0;
            this.pedidoService.totalCnt = 0;
            this.pedidoService.totalPed = 0;
        }

        this.toastr.success('Operación Terminada', 'Pedido Incluido');
        this.pedidoService.enviar = false;
    
    }else{ //Actualiza Pedido
        //set parameter date
        //this.pedidoService.pedido_.fechapedido = new Date(this.pedidoService.pedido_.fechapedido);
        this.pedidoService.pedido_.modificado = new Date;
        this.pedidoService.pedido_.modificadopor = this.loginS.getCurrentUser().email;
        this.pedidoService.pedido_.precioasociado = this.pedidoService.presAscList;
        //campos calculados que no vienen del form
        this.pedidoService.pedido_.totalmontobruto = this.pedidoService.tmontb;
        this.pedidoService.pedido_.totalmontodescuento = this.pedidoService.tmontd;
        this.pedidoService.pedido_.totalmontoimpuesto = this.pedidoService.tmonti;
        this.pedidoService.pedido_.totalmontoneto = this.pedidoService.tmontn;
        this.pedidoService.pedido_.totalPri = this.pedidoService.totalPri; 
        this.pedidoService.pedido_.totalCnt = this.pedidoService.totalCnt;
        this.pedidoService.pedido_.totalPed = this.pedidoService.totalPed;
        this.pedidoService.pedido_.indicadorImpuestodesc = this.pedidoService.indicadorImpuestoDesc;
        this.pedidoService.pedido_.indicadorImpuestoporc = this.pedidoService.indicadorImpuesto;
        
        //Limpia los campos que se iran al detalle del pedido
        this.pedidoService.pedido_.codigodematerial = "";
        this.pedidoService.pedido_.descripcionmaterial = "";
        this.pedidoService.pedido_.cantidadmaterial = 0;
        this.pedidoService.pedido_.unidaddemedida = "";
        this.pedidoService.pedido_.preciomaterial = 0;
        this.pedidoService.pedido_.totalpormaterial = 0;


        
        if (this.pedidoService.pedido_.descuentoporc == null || typeof this.pedidoService.pedido_.descuentoporc === "undefined" || isNaN(this.pedidoService.pedido_.descuentoporc)){
          this.pedidoService.pedido_.descuentoporc = 0;
        }
        if (this.pedidoService.pedido_.descuentovalor == null || typeof this.pedidoService.pedido_.descuentovalor === "undefined" || isNaN(this.pedidoService.pedido_.descuentovalor)){
          this.pedidoService.pedido_.descuentovalor = 0;
        }
        
        //Update Orders
        this.pedidoService.updatePedidos(this.pedidoService.pedido_);

        for (let i in this.pedidoService.matrisDetPedido){
          //Actualiza los registros 
          if (this.pedidoService.matrisDetPedido[i].uid!=""){
              this.pedidoService.updatePedidosDet(this.pedidoService.matrisDetPedido[i]);
          }else{
              //Agrega los nuevos registros
              this.pedidoService.matrisDetPedido[i].idpedido=this.pedidoService.pedido_.uid;
              this.pedidoService.addPedidosDet(this.pedidoService.matrisDetPedido[i]);
          }      
        }
        //Elimina los registros seleccionados 
        for (let k in this.elementoBorrados){
          this.pedidoService.deletePedidosDet(this.elementoBorrados[k])
        }
        this.elementoBorrados = []; // vacia la instancia


        this.pedidoService.totalPri = 0;
        this.pedidoService.totalCnt = 0;
        this.pedidoService.totalPed = 0;

        this.pedidoService.tmontb = 0;
        this.pedidoService.tmontd = 0;
        this.pedidoService.tmonti = 0;
        this.pedidoService.tmontn = 0;
        
        
        this.toastr.success('Operación Terminada','Pedido Actualizado');
        this.pedidoService.enviar = false;
    }

    // if(this.pedidoService.txtBtnAccion == "Agregar Pedido"){}else{}

    pf.resetForm();
    this.pedidoService.mostrarForm = false;
    this.pedidoService.readonlyField = false;
    this.pedidoService.pedido_ = {} as Pedido;  
    this.pedidoService.matrisDetPedido = []; // vacia la instancia
    this.pedidoService.txtBtnAccion = "Enviar Pedido"; 
  }//onSubmit

  
  @ViewChild('pedidoForm') myForm;
  resetFormFunc(field?: number){  
    this.myForm.resetForm();
    if (field == 2){  
    }
  }//resetForm function


  resetForm(pf?: NgForm)
  {
    if(pf != null) pf.reset();
    this.pedidoService.matrisDetPedido = []; // vacia la instancia
    this.pedidoService.readonlyField = false;
    this.pedidoService.pedido_ = {} as Pedido; 
    this.pedidoService.totalPri = 0;
    this.pedidoService.totalCnt = 0;
    this.pedidoService.totalPed = 0;
    this.pedidoService.tmontb = 0;
    this.pedidoService.tmontd = 0;
    this.pedidoService.tmonti = 0;
    this.pedidoService.tmontn = 0;
    this.pedidoService.txtBtnAccion = "Enviar Pedido"; 
    this.pedidoService.enviar = false;
    this.pedidoService.mostrarForm = false;
  }


  moForm(){
    //this.estadoElement = this.estadoElement === 'estado1' ? 'estado2' : 'estado1';

    if (this.pedidoService.mostrarForm){
      this.pedidoService.mostrarForm = false;
      this.msj_enlace = 'Pedidos';
    }else{
      this.pedidoService.mostrarForm = true;
      this.msj_enlace = '';
    }

    this.pedidoService.matrisDetPedido = []; // vacia la instancia
    this.pedidoService.valorAutCli = "";
    this.pedidoService.valorAutVen = "";
    this.pedidoService.readonlyField = false;
    this.pedidoService.pedido_ = {} as Pedido;  
    this.pedidoService.pedido_.fechapedido = new Date;

    this.pedidoService.totalPri = 0;
    this.pedidoService.totalCnt = 0;
    this.pedidoService.totalPed = 0;
    this.pedidoService.tmontb = 0;
    this.pedidoService.tmontd = 0;
    this.pedidoService.tmonti = 0;
    this.pedidoService.tmontn = 0;
  
    this.pedidoService.txtBtnAccion = "Enviar Pedido"; 
  }

  selectEvent(elemento){
    const val = elemento.idcliente;
    this.pedidoService.pedido_.idcliente = val;
    const isLargeNumber = (element) => element.idcliente.trim() == val.trim();
    const indice = this.clienteList.findIndex(isLargeNumber);
    this.pedidoService.pedido_.nomcliente = "";
    this.pedidoService.pedido_.email = "";
    this.pedidoService.pedido_.listaprecio = "";

    this.pedidoService.pedido_.codigodematerial = "Ninguno";
    this.pedidoService.pedido_.descripcionmaterial = "";
    this.pedidoService.pedido_.preciomaterial = this.myempty;
    this.pedidoService.pedido_.cantidadmaterial = this.myempty;
    this.pedidoService.pedido_.totalpormaterial = this.myempty;
    this.pedidoService.matrisDetPedido = []; // vacia la instancia
    this.pedidoService.totalPri = 0;
    this.pedidoService.totalCnt = 0;
    this.pedidoService.totalPed = 0;

    this.pedidoService.tmontb = 0;
    this.pedidoService.tmontd = 0;
    this.pedidoService.tmonti = 0;
    this.pedidoService.tmontn = 0;
    this.pedidoService.pedido_.descuentovalor = this.myempty;
    this.pedidoService.pedido_.descuentoporc = this.myempty;


    if (indice != -1){
      this.pedidoService.pedido_.nomcliente = this.clienteList[indice].descripcion;
      this.pedidoService.pedido_.email = this.clienteList[indice].email;
      this.pedidoService.pedido_.listaprecio = this.clienteList[indice].listaprecio;

      //Buscar precio asociado a l lista de precios
      const lnum = (element) => element.descripcion.trim() == this.clienteList[indice].listaprecio.trim();
      const ind = this.lprecioList.findIndex(lnum);
      this.pedidoService.presAscList = this.lprecioList[ind].precio;
      //console.log('precio saociado: ',this.lprecioList[ind].precio);

      //Buscamos el indicador de impuesto
      const limp = (element) => element.descripcion.trim() == this.clienteList[indice].iimpuesto.trim();
      const indic = this.iimpuestoList.findIndex(limp);
      this.pedidoService.indicadorImpuesto = this.iimpuestoList[indic].porcentajei;
      this.pedidoService.indicadorImpuestoDesc = this.iimpuestoList[indic].descripcion;
      //console.log('impuesto asociado: ',this.pedidoService.indicadorImpuestoDesc, ' %: ',this.pedidoService.indicadorImpuesto);

      //Buscamos el Vendedor asociado a la zona de ventas asociada al cliente
      //se puede comentar estas lineas para buscar el vendedor de forma manual, ademas de quitar el ReadOnly del campo de busqueda
      const idven = (element) => element.vzona.trim() == this.clienteList[indice].zona.trim();
      const indVen = this.vendedorList.findIndex(idven);
      this.pedidoService.valorAutVen = this.vendedorList[indVen].idvendedor;
      this.pedidoService.pedido_.nomvendedor = this.vendedorList[indVen].descripcion;
      this.pedidoService.pedido_.idvendedor = this.vendedorList[indVen].idvendedor;
      //********************************************************************************* */
      
    }
  }

  onChangeSearch(val: string) {
    //console.log('aqui: ',val);
    this.pedidoService.pedido_.idcliente = val;

    const isLargeNumber = (element) => element.idcliente.trim() == val.trim();
    const indice = this.clienteList.findIndex(isLargeNumber);
    this.pedidoService.pedido_.nomcliente = "";
    this.pedidoService.pedido_.email = "";
    this.pedidoService.pedido_.listaprecio = "";

    this.pedidoService.pedido_.codigodematerial = "Ninguno";
    this.pedidoService.pedido_.descripcionmaterial = "";
    this.pedidoService.pedido_.preciomaterial = this.myempty;
    this.pedidoService.pedido_.cantidadmaterial = this.myempty;
    this.pedidoService.pedido_.totalpormaterial = this.myempty;
    this.pedidoService.matrisDetPedido = []; // vacia la instancia
    this.pedidoService.totalPri = 0;
    this.pedidoService.totalCnt = 0;
    this.pedidoService.totalPed = 0;

    this.pedidoService.tmontb = 0;
    this.pedidoService.tmontd = 0;
    this.pedidoService.tmonti = 0;
    this.pedidoService.tmontn = 0;
    this.pedidoService.pedido_.descuentovalor = this.myempty;
    this.pedidoService.pedido_.descuentoporc = this.myempty;

    if (indice != -1){
      this.pedidoService.pedido_.nomcliente = this.clienteList[indice].descripcion;
      this.pedidoService.pedido_.email = this.clienteList[indice].email;
      this.pedidoService.pedido_.listaprecio = this.clienteList[indice].listaprecio;

      //Buscar precio asociado a l lista de precios
      const lnum = (element) => element.descripcion.trim() == this.clienteList[indice].listaprecio.trim();
      const ind = this.lprecioList.findIndex(lnum);
      this.pedidoService.presAscList = this.lprecioList[ind].precio;
      //console.log('precio asociado: ',this.lprecioList[ind].precio);


      //Buscamos el indicador de impuesto
      const limp = (element) => element.descripcion.trim() == this.clienteList[indice].iimpuesto.trim();
      const indic = this.iimpuestoList.findIndex(limp);
      this.pedidoService.indicadorImpuesto = this.iimpuestoList[indic].porcentajei;
      this.pedidoService.indicadorImpuestoDesc = this.iimpuestoList[indic].descripcion;
      //console.log('impuesto asociado: ',this.indicadorImpuestoDesc, ' %: ',this.indicadorImpuesto);
    }
  }

  closeautoComplete(){
    this.pedidoService.pedido_.nomcliente = "";
    this.pedidoService.pedido_.email = "";
    this.pedidoService.pedido_.listaprecio = "";
    this.pedidoService.presAscList = "";
    this.pedidoService.indicadorImpuesto=0;
    this.pedidoService.indicadorImpuestoDesc="";
    this.pedidoService.pedido_.codigodematerial = "Ninguno";
    this.pedidoService.pedido_.descripcionmaterial = "";
    this.pedidoService.pedido_.preciomaterial = this.myempty;
    this.pedidoService.pedido_.cantidadmaterial = this.myempty;
    this.pedidoService.pedido_.totalpormaterial = this.myempty;
    this.pedidoService.matrisDetPedido = []; // vacia la instancia
    this.pedidoService.totalPri = 0;
    this.pedidoService.totalCnt = 0;
    this.pedidoService.totalPed = 0;

    this.pedidoService.tmontb = 0;
    this.pedidoService.tmontd = 0;
    this.pedidoService.tmonti = 0;
    this.pedidoService.tmontn = 0;
    this.pedidoService.pedido_.descuentovalor = this.myempty;
    this.pedidoService.pedido_.descuentoporc = this.myempty;
    //this.resetFormFunc(2);
  }


  /**
   **************************************************
   //VENDEDORES VENDEDORES VENDEDORES VENDEDORES
   **************************************************
  **/
  selectEventVen(elemento){
    const val = elemento.idvendedor;
    this.pedidoService.pedido_.idvendedor = val;
    const isLargeNumber = (element) => element.idvendedor == val;
    const indice = this.vendedorList.findIndex(isLargeNumber);
    this.pedidoService.pedido_.nomvendedor = "";
    if (indice != -1){
      this.pedidoService.pedido_.nomvendedor = this.vendedorList[indice].descripcion;
    }
  }

  onChangeSearchVen(val: string) {
    this.pedidoService.pedido_.idvendedor = val;
    const isLargeNumber = (element) => element.idvendedor == val;
    const indice = this.vendedorList.findIndex(isLargeNumber);
    this.pedidoService.pedido_.nomvendedor = "";
    if (indice != -1){
      this.pedidoService.pedido_.nomvendedor = this.vendedorList[indice].descripcion;
    }
  }

  closeautoCompleteVen(){
    this.pedidoService.pedido_.nomvendedor = "";
  }
  /**
   --------------------------------------------------------------------
   ********************************************************************
  **/

  selectedchangeCodMat(val){
    let pusd1: number = 0;
    let pusd2: number = 0;
    let pvef1: number = 0;
    let pvef2: number = 0;
    let precioMaterial: number;

    const isLargeNumber = (element) => element.idmaterial == val;
    const i = this.productList.findIndex(isLargeNumber);

    if (i != -1){

      this.pedidoService.pedido_.descripcionmaterial = this.productList[i].descripcion;
      pusd1 = this.productList[i].preciousd1;
      pusd2 = this.productList[i].preciousd2;
      pvef1 = this.productList[i].preciovef1;
      pvef2 = this.productList[i].preciovef2;

      if (this.pedidoService.presAscList == "P-USD-1"){
        precioMaterial = this.productList[i].preciousd1
        this.currencyPipe = this.currencyPipeUSD;
      }
      if (this.pedidoService.presAscList == "P-USD-2"){
        precioMaterial = this.productList[i].preciousd2
        this.currencyPipe = this.currencyPipeUSD;
      }
      if (this.pedidoService.presAscList == "P-VEF-1"){
        precioMaterial = this.productList[i].preciovef1
        this.currencyPipe = this.currencyPipeVEF;
      }
      if (this.pedidoService.presAscList == "P-VEF-2"){
        precioMaterial = this.productList[i].preciovef2
        this.currencyPipe = this.currencyPipeVEF;
      }
      this.pedidoService.pedido_.unidaddemedida =  this.productList[i].unidadmedida;
      this.pedidoService.pedido_.preciomaterial =  precioMaterial;
      this.pedidoService.pedido_.cantidadmaterial = this.myempty;
      this.pedidoService.pedido_.totalpormaterial = this.myempty;
      
    }
  }// selectedchange

  txtctnchange(cnt){
    let tmat;
    if (this.pedidoService.pedido_.preciomaterial != null){
      tmat = cnt.target.value * this.pedidoService.pedido_.preciomaterial;
      this.pedidoService.pedido_.totalpormaterial = parseFloat(tmat.toFixed(2));  //.toLocaleString("es-CO");
    }
  }//txtctnchange

  txtdescpchange(descp){
    let valor = (this.pedidoService.totalPed*descp.target.value)/100;
    this.pedidoService.tmontd = parseFloat(valor.toFixed(2));
    //this.pedidoService.pedido_.descuentovalor = this.pedidoService.tmontd;

    //Calculo del Impuesto en base al monto bruto
    let montoDescAux=0;
    if (this.pedidoService.tmontd>0){
      montoDescAux = this.pedidoService.tmontd;
    }
    this.pedidoService.tmonti = ((this.pedidoService.tmontb - montoDescAux)* this.pedidoService.indicadorImpuesto)/100;

    //Calculo Monto Neto anterior
    //this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux) + this.pedidoService.tmonti;
    //Calculo Monto Neto sin iva
    this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux);    

  }//txtdescpchange

  txtdescvchange(descv){
    let aux_tmontdv = descv.target.value;

    if (aux_tmontdv == null || typeof aux_tmontdv == undefined || aux_tmontdv.toString() ==""){
         aux_tmontdv=0;
    }

    //Calcula el desc porcentual 
    let auxDescPorce = (this.pedidoService.totalPed*this.pedidoService.pedido_.descuentoporc)/100;

    this.pedidoService.tmontd = auxDescPorce + parseFloat(aux_tmontdv);
    
    
    //let valor:number = (this.pedidoService.tmontd*100)/this.pedidoService.totalPed;
    //this.pedidoService.pedido_.descuentoporc = parseFloat(valor.toFixed(2));

    //Calculo del Impuesto en base al monto bruto
    let montoDescAux=0;
    if (this.pedidoService.tmontd>0){
      montoDescAux = this.pedidoService.tmontd;
    }
    this.pedidoService.tmonti = ((this.pedidoService.tmontb - montoDescAux)* this.pedidoService.indicadorImpuesto)/100;
    
    //Calculo Monto Neto anterior
    //this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux) + this.pedidoService.tmonti;
    //Calculo Monto Neto sin iva
    this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux);


  }//txtdescvchange

  agregardetalles(){
    //agregar fila en el array
    this.pedidoService.matrisDetPedido = this.pedidoService.matrisDetPedido.concat({
      idpedido:null,
      uid:'',
      codigodematerial:this.pedidoService.pedido_.codigodematerial,
      descripcionmaterial:this.pedidoService.pedido_.descripcionmaterial,
      unidaddemedida:this.pedidoService.pedido_.unidaddemedida,
      preciomaterial:this.pedidoService.pedido_.preciomaterial,
      cantidadmaterial:this.pedidoService.pedido_.cantidadmaterial,
      totalpormaterial:this.pedidoService.pedido_.totalpormaterial
    });

    //Calcular totales para la tabla 
    this.pedidoService.totalPri = this.pedidoService.totalPri + this.pedidoService.pedido_.preciomaterial;
    this.pedidoService.totalCnt = this.pedidoService.totalCnt + this.pedidoService.pedido_.cantidadmaterial;
    this.pedidoService.totalPed = this.pedidoService.totalPed + this.pedidoService.pedido_.totalpormaterial;
  
    //Calculo del descuento en base al monto bruto
    this.pedidoService.tmontb = this.pedidoService.totalPed;
    if (this.pedidoService.pedido_.descuentoporc == null || typeof this.pedidoService.pedido_.descuentoporc === "undefined" || isNaN(this.pedidoService.pedido_.descuentoporc)){
      this.pedidoService.pedido_.descuentoporc = 0;
    }
    if (this.pedidoService.pedido_.descuentovalor == null || typeof this.pedidoService.pedido_.descuentovalor === "undefined" || isNaN(this.pedidoService.pedido_.descuentoporc)){
      this.pedidoService.pedido_.descuentovalor = 0;
    }
    this.pedidoService.tmontd = (this.pedidoService.totalPed*this.pedidoService.pedido_.descuentoporc)/100;
    //this.pedidoService.pedido_.descuentovalor = parseFloat(this.pedidoService.tmontd.toFixed(2));
    //-----------------------------------------------------------------------------------------------

    //Calculo del Impuesto en base al monto bruto
    let montoDescAux=0;
    if (this.pedidoService.tmontd>0){
      montoDescAux = this.pedidoService.tmontd;
    }
    //console.log('impuest: ',this.pedidoService.indicadorImpuesto);

    this.pedidoService.tmonti = ((this.pedidoService.tmontb - montoDescAux)* this.pedidoService.indicadorImpuesto)/100;

    //Calculo Monto Neto 
    //this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux) + this.pedidoService.tmonti;
    //Calculo Monto Neto sin iva
    this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux);

    if (this.pedidoService.matrisDetPedido.length > 0){
      this.pedidoService.mostrardesc = true;
    }else{
      this.pedidoService.mostrardesc = false;
    }

    this.pedidoService.pedido_.codigodematerial="";
    this.pedidoService.pedido_.descripcionmaterial="";
    this.pedidoService.pedido_.preciomaterial= this.myempty;
    this.pedidoService.pedido_.unidaddemedida="";
    this.pedidoService.pedido_.cantidadmaterial = this.myempty;
    this.pedidoService.pedido_.totalpormaterial = this.myempty;


    if (this.pedidoService.tmontn > 0 && this.pedidoService.totalCnt > 0 && this.pedidoService.tmontb>0){
      this.pedidoService.enviar = true;
      this.pedidoService.readonlyField = true;
    }
    

  }//agregardetalles

  removeDetRow(i){
    this.pedidoService.totalPri = this.pedidoService.totalPri - this.pedidoService.matrisDetPedido[i].preciomaterial;
    this.pedidoService.totalCnt = this.pedidoService.totalCnt - this.pedidoService.matrisDetPedido[i].cantidadmaterial;
    this.pedidoService.totalPed = this.pedidoService.totalPed - this.pedidoService.matrisDetPedido[i].totalpormaterial;

    this.pedidoService.tmontb = this.pedidoService.totalPed;
    this.pedidoService.tmontd = (this.pedidoService.totalPed*this.pedidoService.pedido_.descuentoporc)/100;
    this.pedidoService.pedido_.descuentovalor = this.pedidoService.tmontd

    //Auxiliar de elementos a eliminar de la db
    this.elementoBorrados.push(this.pedidoService.matrisDetPedido[i]);
    //Eliminando el registro del vector
    i !== -1 && this.pedidoService.matrisDetPedido.splice( i, 1 );

    if (this.pedidoService.matrisDetPedido.length > 0){
      this.pedidoService.mostrardesc = true;
    }else{
      this.pedidoService.mostrardesc = false;
    }

    //Calculo del Impuesto en base al monto bruto
    let montoDescAux=0;
    if (this.pedidoService.tmontd>0){
      montoDescAux = this.pedidoService.tmontd;
    }
    this.pedidoService.tmonti = ((this.pedidoService.tmontb - montoDescAux)* this.pedidoService.indicadorImpuesto)/100;

    //Calculo Monto Neto anterior
    //this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux) + this.pedidoService.tmonti;
    //Calculo Monto Neto sin iva
    this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux);

    if (this.pedidoService.tmontn <= 0 || this.pedidoService.totalCnt <= 0 || this.pedidoService.tmontb <= 0){
      this.pedidoService.enviar = false;
      this.pedidoService.readonlyField = false;
    }

  }//removeDetRow

}//export class PedidoComponent implements OnInit
