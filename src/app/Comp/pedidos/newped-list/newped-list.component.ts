import { Component, OnInit,ViewChild } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Pedido } from 'src/app/models/pedido';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';
import { MrechazoService } from 'src/app/services/mrechazo.service';

import { Mrechazo } from '../../../models/mrechazo';
import * as moment from 'moment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PedidoShowComponent } from '../pedido-show/pedido-show.component';

@Component({
  selector: 'app-newped-list',
  templateUrl: './newped-list.component.html',
  styleUrls: ['./newped-list.component.css']
})
export class NewpedListComponent implements OnInit {
  pedidoVer_ = {} as Pedido;
  txtComentario = "";
  mostrardiv:boolean=false;
  pedIndex: number=-990;
  idpedidoEli: string="";
  fechapedidoEli: Date;
  clientepedidoEli: string="";
  pedidoslist = [];
  pedidoslistDet=[];
  public mrechazoList: Mrechazo[]; //arreglo vacio
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['uid', 'Fecha', 'Status', 'Cliente', 'Vendedor', 'Subtotal', 'totalmontodescuento','totalmontoimpuesto', 'totalmontoneto', 'Opc'];


  constructor(
    public pedidoService: PedidoService,
    public loginS       : FirebaseloginService,
    private toastr      : ToastrService,
    public mrechazoS    : MrechazoService,
    private dialogo     : MatDialog,
  ) { }

  ngOnInit(): void {

    this.pedidoService.getPedidosA().subscribe(pedidos=>{
      this.pedidoslist = pedidos;
      
      //ELEMENT_DATA
      this.dataSource = new MatTableDataSource(this.pedidoslist);
      this.dataSource.sort = this.sort;
    })

    this.mrechazoS.getMrechazos().valueChanges().subscribe(mrz =>{
      this.mrechazoList = mrz;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  timestampConvert(fec){
    let dateObject = new Date(fec.seconds*1000);
    let mes_ = dateObject.getMonth()+1;
    let ano_ = dateObject.getFullYear();
    let dia_ = dateObject.getDate();
    this.pedidoService.pedido_.fechapedido = dateObject;
  }//timestampConvert

  timestamp2(fec){
    let dateObject = new Date(fec.seconds*1000);
    let d1a, m3s : string;

    d1a = dateObject.getDate().toString();
    if (dateObject.getDate()<10){
      d1a = "0"+dateObject.getDate().toString();
    }
    m3s = (dateObject.getMonth()+1).toString();
    if (dateObject.getMonth()+1<10){
      m3s = "0"+(dateObject.getMonth()+1).toString();
    }

    return dateObject.getFullYear()+"-"+m3s+"-"+d1a;
  }//timestampConvert

  mostrarOcultar(event,pedi){
    this.mostrardiv = true;
    this.pedIndex = pedi;
    this.idpedidoEli = this.pedidoslist[this.pedIndex].uid;
    this.fechapedidoEli = this.pedidoslist[this.pedIndex].fechapedido;
    this.clientepedidoEli = this.pedidoslist[this.pedIndex].nomcliente;
    this.pedidoService.mostrarForm=false;
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
        this.pedidoslist[this.pedIndex].status="ELIMINADO";
        this.pedidoslist[this.pedIndex].modificadopor=this.loginS.getCurrentUser().email;
        this.pedidoslist[this.pedIndex].motivorechazo = this.txtComentario;
        this.pedidoService.deletePedidos(this.pedidoslist[this.pedIndex]);
        this.toastr.show('Pedido Eliminado','Operación Terminada');
        this.mostrardiv=false;
      }
    }
  }

  onEdit(event, ped){
    this.pedidoService.totalPri=0;
    this.pedidoService.totalCnt=0;
    this.pedidoService.totalPed=0;
    this.pedidoService.elementoBorrados = [];
    
    if (ped.status.toUpperCase() == 'ACTIVO'){
        //console.log(ped);
        this.pedidoService.mostrarForm = true;
        this.pedidoService.txtBtnAccion = "Actualizar Pedido";
        this.pedidoService.readonlyField = true;

        this.pedidoService.valorAutCli = ped.nomcliente;
        this.pedidoService.start_time = this.timestamp2(ped.fechapedido).toString();
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

            //Calculo Monto Neto 
            this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux) + this.pedidoService.tmonti;


            //Muestra los campos de descuento
            //this.pedidoService.mostrardesc = true;

            //console.log('antes: ',this.pedidoService.selectedIndex);
            //this.pedidoService.selectedIndex = 0;
            this.pedidoService.enviar=true;
            //console.log('despues: ',this.pedidoService.selectedIndex);
        }) 
    } //Si status es Activo

  }//onEdit

  moForm(){
    //this.estadoElement = this.estadoElement === 'estado1' ? 'estado2' : 'estado1';

    if (this.pedidoService.mostrarForm){
      this.pedidoService.mostrarForm = false;
    }else{
      this.pedidoService.mostrarForm = true;
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
    this.pedidoService.start_time = moment(new Date()).format('YYYY-MM-DD');
    this.pedidoService.txtBtnAccion = "Crear Pedido";
 
  }//moForm

  verdetalles(event, ped){
    const dialogConfig = new MatDialogConfig;
    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "100%"
    dialogConfig.width = "95%";
    dialogConfig.height = "95%"
    
    this.pedidoVer_ =  Object.assign({}, ped);
    this.timestampConvert(ped.fechapedido);
    
    if (ped.ffactura !== null && typeof ped.ffactura != "undefined"){
      this.timestampConvert(ped.ffactura); 
    }
    if (ped.fdespacho !== null && typeof ped.fdespacho != "undefined"){
      this.timestampConvert(ped.fdespacho); 
    }
    if (ped.fpago !== null && typeof ped.fpago != "undefined"){
      this.timestampConvert(ped.fpago); 
    }
    if (ped.ftentrega !== null && typeof ped.ftentrega != "undefined"){
      this.timestampConvert(ped.ftentrega); 
    }
    if (ped.fentrega !== null && typeof ped.fentrega != "undefined"){
      this.timestampConvert(ped.fentrega); 
    }
  
    dialogConfig.data = {
      pedidoShow: Object.assign({}, this.pedidoVer_)
    };
  
    this.dialogo.open(PedidoShowComponent,dialogConfig);
  }


}


