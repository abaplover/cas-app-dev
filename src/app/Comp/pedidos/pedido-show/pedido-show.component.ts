import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/models/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Inject } from '@angular/core';
import { PedidoDet } from 'src/app/models/pedidoDet';

@Component({
  selector: 'app-pedido-show',
  templateUrl: './pedido-show.component.html',
  styleUrls: ['./pedido-show.component.css']
})
export class PedidoShowComponent implements OnInit {

  pedidoslistDet=[];
  pedidoShow: Pedido;
  pedidoDetShow: PedidoDet;
  totalPri: number = 0;
  totalCnt: number = 0;
  totalPed: number = 0;

  tmontb: number=0;
  tmontd: number=0;
  tmonti: number=0;
  tmontn: number=0;

  constructor(
    public pedidoService: PedidoService,

    private dialogRef: MatDialogRef<PedidoShowComponent>,
        @Inject(MAT_DIALOG_DATA) data

  ) 
  {
    this.pedidoShow = data.pedidoShow;

    //Get Order detaills
    this.pedidoService.getPedidosDet(data.pedidoShow.uid).subscribe(pedidosDet=>{
      this.totalPri=0;
      this.totalCnt=0;
      this.totalPed=0;
      
      this.pedidoslistDet = pedidosDet;

      for (let i in this.pedidoslistDet){
        this.totalPri = this.totalPri +  this.pedidoslistDet[i].preciomaterial;
        this.totalCnt = this.totalCnt +  this.pedidoslistDet[i].cantidadmaterial;
        this.totalPed = this.totalPed +  this.pedidoslistDet[i].totalpormaterial;
      }
      //Calculo del descuento en base al monto bruto
      this.tmontb = this.totalPed;
      this.tmontd = (this.totalPed*data.pedidoShow.descuentoporc)/100;
      this.tmontd = this.tmontd + data.pedidoShow.descuentovalor;
      //Calculo del Impuesto en base al monto bruto
      let montoDescAux=0;
      if (this.tmontd>0){
        montoDescAux = this.tmontd;
      }
      this.tmonti = ((this.tmontb - montoDescAux)* data.pedidoShow.indicadorImpuestoporc)/100;

      //Calculo Monto Neto 
      this.tmontn = (this.tmontb - montoDescAux) + this.tmonti;

    })

  }

  ngOnInit(): void {
  }

  onClose(){
    this.dialogRef.close();
  }

}
