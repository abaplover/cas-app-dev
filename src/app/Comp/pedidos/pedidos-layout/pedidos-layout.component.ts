import { Component, OnInit,AfterViewInit, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';
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
import {BehaviorSubject, Observable} from 'rxjs';


@Component({
  selector: 'app-pedidos-layout',
  templateUrl: './pedidos-layout.component.html',
  styleUrls: ['./pedidos-layout.component.css']
})

export class PedidosLayoutComponent implements OnInit, OnChanges{
  pedIndex: number=-990;
  idpedidoEli: string="";
  fechapedidoEli: Date;
  clientepedidoEli: string="";
  mostrardiv:boolean=false;
  txtComentario = "";

  pedidoslistDet=[];

  resp: boolean=false;


  pedidoVer_ = {} as Pedido;

  @Input() pedidoslist : Pedido[] = [];
  tipoPedido: string = "ND";

  @Input()  pedidoEsp : string;
  @Output() detalles = new EventEmitter<any>();
  @Output() EventPed = new EventEmitter<any>();
  @Output() anular = new EventEmitter<{pf: NgForm, elemento: any, num:number}>();

  dataSource: any;

  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idpedido', 'fechapedido', 'status', 'nomcliente', 'nomvendedor', 'totalmontobruto', 'totalmontodescuento',/*'totalmontoimpuesto',*/ 'totalmontoneto', 'Opc'];
  constructor(
    public pedidoService: PedidoService,
    private toastr: ToastrService,
    private dialogo: MatDialog,
    public loginS: FirebaseloginService
  ) { }

  ngOnInit(): void {
    //this.tipoPedido = this.pedidoEsp;
    this.dataSource = new MatTableDataSource(this.pedidoslist);
    this.dataSource.sort = this.sort;

  }

  ngOnChanges(){
    this.tipoPedido = this.pedidoEsp;
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

  verdetalles(ped){
    console.log(ped);
    this.detalles.emit(ped);
  }
  selectEventPed(elemento){
    this.EventPed.emit(elemento);
  }

  anulardoc(pdf,elemento, number){
    this.anular.emit({pf: pdf, elemento:elemento, num:number});
  }

}

