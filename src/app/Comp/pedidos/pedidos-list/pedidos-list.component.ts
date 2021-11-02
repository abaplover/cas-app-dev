import { Component, OnInit,AfterViewInit, ViewChild } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog,MatDialogConfig } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';
import { MatSort } from '@angular/material/sort';
import { PedidoShowComponent } from '../pedido-show/pedido-show.component';
import { Pedido } from 'src/app/models/pedido';
import { PedidoDet } from 'src/app/models/pedidoDet';
import { MatPaginator } from '@angular/material/paginator';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

/**
 * @title Table with filtering
 */

@Component({
  selector: 'app-pedidos-list',
  templateUrl: './pedidos-list.component.html',
  styleUrls: ['./pedidos-list.component.css']
})
export class PedidosListComponent implements OnInit {

  pedIndex: number=-990;
  idpedidoEli: string="";
  fechapedidoEli: Date;
  clientepedidoEli: string="";
  mostrardiv:boolean=false;
  txtComentario = "";
  pedidoslist = [];
  pedidoslistDet=[];
  
  resp: boolean=false;
  
  pedidoVer_ = {} as Pedido;

  //displayedColumns: string[];
  dataSource: any;

  //@ViewChild('nav') ngnav;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['uid', 'Fecha', 'Status', 'Cliente', 'Vendedor', 'Subtotal', 'totalmontodescuento','totalmontoimpuesto', 'totalmontoneto', 'Opc'];    
 
  constructor(
    public pedidoService: PedidoService, 
    private toastr: ToastrService,
    private modalService: NgbModal,
    private dialogo: MatDialog,
    public loginS: FirebaseloginService
  ) { }
  
  ngOnInit(): void {
    this.pedidoService.getPedidos().subscribe(pedidos=>{
      //console.log(pedidos);
      this.pedidoslist = pedidos;
      
      //ELEMENT_DATA
      this.dataSource = new MatTableDataSource(this.pedidoslist);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onCancelar(pf?: NgForm){
    if(pf != null) pf.reset();
    this.idpedidoEli = "";
    this.clientepedidoEli = "";
    this.mostrardiv = false;
  }

  mostrarOcultar(event,pedi){
    this.mostrardiv = true;
    this.pedIndex = pedi;
    this.idpedidoEli = this.pedidoslist[this.pedIndex].uid;
    this.fechapedidoEli = this.pedidoslist[this.pedIndex].fechapedido;
    this.clientepedidoEli = this.pedidoslist[this.pedIndex].nomcliente;
  }

  onDelete(event){
      //this.pedidoService.pedido_ =  Object.assign({}, ped);
      if (this.txtComentario != ""){
        if (this.pedIndex!=-990){
          this.pedidoslist[this.pedIndex].status="Eliminado";
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
    if (col==1){
      this.pedidoVer_.fechapedido = dateObject;
    }
    if (col==2){
      this.pedidoVer_.ffactura = dateObject;
    }
    if (col==3){
      this.pedidoVer_.fdespacho = dateObject;
    }
    if (col==4){
      this.pedidoVer_.fpago = dateObject;
    }
    if (col==5){
      this.pedidoVer_.ftentrega = dateObject;
    }
    if (col==6){
      this.pedidoVer_.fentrega = dateObject;
    }
  }

  verdetalles(event, ped){

    const dialogConfig = new MatDialogConfig;
    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "100%"
    dialogConfig.width = "95%";
    dialogConfig.height = "95%"

    this.pedidoVer_ =  Object.assign({}, ped);
    this.timestampConvert(ped.fechapedido,1);
    
    if (ped.ffactura !== null && typeof ped.ffactura != "undefined"){
      this.timestampConvert(ped.ffactura,2); 
    }
    if (ped.fdespacho !== null && typeof ped.fdespacho != "undefined"){
      this.timestampConvert(ped.fdespacho,3); 
    }
    if (ped.fpago !== null && typeof ped.fpago != "undefined"){
      this.timestampConvert(ped.fpago,4); 
    }
    if (ped.ftentrega !== null && typeof ped.ftentrega != "undefined"){
      this.timestampConvert(ped.ftentrega,5); 
    }
    if (ped.fentrega !== null && typeof ped.fentrega != "undefined"){
      this.timestampConvert(ped.fentrega,6); 
    }

    dialogConfig.data = {
      pedidoShow: Object.assign({}, this.pedidoVer_)
    };

    this.dialogo.open(PedidoShowComponent,dialogConfig);
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

            //Calculo Monto Neto 
            this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux) + this.pedidoService.tmonti;


            //Muestra los campos de descuento
            this.pedidoService.mostrardesc = true;

            //console.log('antes: ',this.pedidoService.selectedIndex);
            this.pedidoService.selectedIndex = 0;
            this.pedidoService.enviar=true;
            //console.log('despues: ',this.pedidoService.selectedIndex);
        }) 
    } //Si status es Activo

  }//onEdit

}
