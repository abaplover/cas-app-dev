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
  displayedColumns: string[] = ['fechapago', 'pedido','documento', 'vendedor','cliente','tipopago', 'viapago', 'banco', 'totalmontonetousd','totalmontonetobsf'];
  
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

      //Obtenemos la lista de todos los pedidos
      this.pedidoS.getPedidos2().subscribe(pedidos => {
        this.pedidos = [];
        let filter1 = [];
        let filterTwoWeeks =[];
        this.pedidos = pedidos;

        this.cobroService.cobrosPagados.subscribe(cobros => {
          //Filtramos solo los cobros que tienen fecha de pago, es decir, que estan pagados
          //ya sea parcial o total
          filter1 = cobros.filter( cobro1 => {
            return cobro1.fechadepago;
          });

          //Filtramos solo los cobros de las ultimas dos semanas a la fecha del dia
          filterTwoWeeks = filter1.filter( cobro2 => {
            let c: any = cobro2.fechadepago;
            let now = moment();
            let other:any = moment.unix(c.seconds);
    
            let days:any = moment(now).diff(moment(other), 'days');
    
            return days <= 14;
          });
          this.cobroslist = [];
    
          //combinamos en un solo array los datos de cobro junto a los de su pedido correspondiente
            for(let i = 0; i<pedidos.length;i++) {

              for(let j = 0; j<filterTwoWeeks.length;j++) {

                if (pedidos[i].idpedido == filterTwoWeeks[j].idpedido) {
                  this.cobroslist.push(
                    {
                      idpedido: filterTwoWeeks[j].idpedido,
                      fechadepago: filterTwoWeeks[j].fechadepago,
                      nrofactura: pedidos[i].nrofactura,
                      nomcliente: pedidos[i].nomcliente,
                      nomvendedor: pedidos[i].nomvendedor,
                      tipopago: filterTwoWeeks[j].tipopago,
                      viadepago: filterTwoWeeks[j].viadepago,
                      banco: filterTwoWeeks[j].banco,
                      montodepago: filterTwoWeeks[j].montodepago,
                      montobsf: filterTwoWeeks[j].montobsf
                    }
                  );
                }
              }
    
            }
          // Asignamos los datos a la tabla del html
          this.dataSource = new MatTableDataSource(this.cobroslist);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
      });
    });

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
