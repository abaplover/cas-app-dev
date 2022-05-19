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
import * as moment from 'moment';
import { PedidoService } from 'src/app/services/pedido.service';
import { MatPaginator } from '@angular/material/paginator';
import { filter } from 'jszip';

@Component({
  selector: 'app-gcobroreg-list',
  templateUrl: './gcobroreg-list.component.html',
  styleUrls: ['./gcobroreg-list.component.css']
})


export class GcobroregListComponent implements OnInit {
  txtComentario = "";
  mostrardiv:boolean=false;
  pedIndex: number=-990;
  idpedidoEli: string="";
  fechapedidoEli: Date;
  clientepedidoEli: string="";
  vp_efectivo=true;
  pagototal=true;
  pagoparcialpagado:number;
  ver:boolean;
  
  //var
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  displayedColumns: string[] = ['fechadepago', 'idpedido','nrofacturapedido', 'nomvendedor','nomcliente','tipopago', 'viadepago', 'banco', 'montodepago','montobsf'];
  
  cobro_ = {} as Cobro;
  cobro0_ = {} as Cobro;
  cobroDet_ = {} as CobroDet;
  MostrarCob: string;

  public vpagoList: Vpago[]; //arreglo vacio
  public bancoList: Banco[]; //arreglo vacio
  cobroslist = [];
  pedidos = [];
  matrisDetCobro: CobroDet[]=[];

  sendemail=false;
  showSpinner = false;

  constructor(
    public cobroService: CobrosService,
    public loginS      : FirebaseloginService,
    private toastr     : ToastrService,
    public vpagoS      : VpagoService,
    public bancoS      : BancoService,
    public pedidoS     : PedidoService
  ) { }

  ngOnInit(): void {
    this.showSpinner = true;
    this.cobro_ = {} as Cobro;

      //Obtenemos la lista de todos los pedidos
      /* this.pedidoS.getPedidosCobros().subscribe(pedidos => {
        var arrayPedidos = pedidos; */

        this.cobroService.cobrosPagados.subscribe(cobros => {
          //var arrayCobros = cobros;
          this.cobroslist = cobros;
          //this.cobroslist = [];
          //combinamos en un solo array los datos de cobro junto a los de su pedido correspondiente
            /* for(let i = 0; i<arrayPedidos.length;i++) {

              for(let j = 0; j<arrayCobros.length;j++) {

                if (arrayPedidos[i].idpedido == arrayCobros[j].idpedido) {
                  this.cobroslist.push(
                    {
                      idpedido: arrayCobros[j].idpedido,
                      fechadepago: arrayCobros[j].fechadepago,
                      tipodoc: arrayPedidos[i].tipodoc,
                      nrofactura: arrayPedidos[i].nrofactura,
                      nomcliente: arrayPedidos[i].nomcliente,
                      nomvendedor: arrayPedidos[i].nomvendedor,
                      tipopago: arrayCobros[j].tipopago,
                      viadepago: arrayCobros[j].viadepago,
                      banco: arrayCobros[j].banco,
                      montodepago: arrayCobros[j].montodepago,
                      montobsf: arrayCobros[j].montobsf
                    }
                  );
                }
              }
    
            } */
          // Asignamos los datos a la tabla del html
          this.dataSource = new MatTableDataSource(this.cobroslist);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.showSpinner = false;
      });
    //});

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
    this.MostrarCob = 'display:none;';
    this.pagoparcialpagado=0;
    this.ver=false;
  }//onCancelar

  cancelNotifi(){
    this.cobro0_ = {} as Cobro;
    this.sendemail = false;
  }//onCancelar

  onEdit(event, ped){

  }//onEdit

  moForm(){
    if (this.cobroService.mostrarForm){
      this.cobroService.mostrarForm = false;
    }else{
      this.cobroService.mostrarForm = true;
    }


  }//moForm
  sendpopup(e){
    this.cobro0_ =  Object.assign({}, e);
    this.sendemail=true;
  }
  sendUpdate(){
    this.sendemail=true;
    //Update Cobro - 
    this.cobro0_.lastnotifsend = new Date;
    this.cobro0_.sendmail=true;
    this.cobroService.updatecobros(this.cobro0_);
    this.cancelNotifi();
    this.toastr.success('Operación Terminada', 'Se ha enviado una notificación de cobro');
  }
}
