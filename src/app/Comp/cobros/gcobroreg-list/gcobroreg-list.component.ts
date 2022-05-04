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
  


  //var
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['fechapago', 'pedido','documento', 'vendedor','cliente','tipopago', 'viapago', 'banco', 'totalmontonetousd','totalmontonetobsf'];
  cobro_ = {} as Cobro;
  cobro0_ = {} as Cobro;
  cobroDet_ = {} as CobroDet;
  MostrarCob: string;
  vp_efectivo=true;
  pagototal=true;
  pagoparcialpagado:number;
  ver:boolean;
  public vpagoList: Vpago[]; //arreglo vacio
  public bancoList: Banco[]; //arreglo vacio
  cobroslist = [];
  pedidos = [];
  matrisDetCobro: CobroDet[]=[];
  sendemail=false;

  constructor(
    public cobroService: CobrosService,
    public loginS      : FirebaseloginService,
    private toastr     : ToastrService,
    public vpagoS      : VpagoService,
    public bancoS      : BancoService,
    public pedidoS     : PedidoService
  ) { }

  ngOnInit(): void {
    this.cobro_ = {} as Cobro;

    this.cobroService.cobrosPagados.subscribe(cobros => {
      //Filtramos solo los cobros que tienen fecha de pago, es decir, que estan pagados
      //ya sea parcial o total
      let filter1 = cobros.filter( cobro => {
        return cobro.fechadepago;
      })
      //Filtramos solo los cobros de las ultimas dos semanas a la fecha del dia
      let filterTwoWeeks = filter1.filter( cobro => {
        let c: any = cobro.fechadepago;
        let now = moment();
        let other:any = moment.unix(c.seconds);

        let days:any = moment(now).diff(moment(other), 'days');

        return days <= 14;
      })

      //Obtenemos la lista de todos los pedidos
      this.pedidoS.pedidos.subscribe(pedidos => {
        this.pedidos = pedidos;

        //combinamos en un solo array los datos de cobro junto a los de su pedido correspondiente
        for(let i = 0; i<filterTwoWeeks.length;i++) {  
          for(let j = 0; j<this.pedidos.length;j++) {
            if (this.pedidos[j].idpedido == filterTwoWeeks[i].idpedido) {
              this.cobroslist.push(
                {
                  idpedido: filterTwoWeeks[i].idpedido,
                  fechadepago: filterTwoWeeks[i].fechadepago,
                  nrofactura: this.pedidos[j].nrofactura,
                  nomcliente: this.pedidos[j].nomcliente,
                  nomvendedor: this.pedidos[j].nomvendedor,
                  tipopago: filterTwoWeeks[i].tipopago,
                  viadepago: filterTwoWeeks[i].viadepago,
                  banco: filterTwoWeeks[i].banco,
                  montodepago: filterTwoWeeks[i].montodepago,
                  montobsf: filterTwoWeeks[i].montobsf
                }
              );
              //Sale del for porque ya encontro la coincidencia */
            }
          }
        }

      // Asignamos los datos a la tabla del html
      this.dataSource = new MatTableDataSource(this.cobroslist);
      this.dataSource.sort = this.sort;

      });
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
    this.cobro_ = {} as CobroDet;
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
