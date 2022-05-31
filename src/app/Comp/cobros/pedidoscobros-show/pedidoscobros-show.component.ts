import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client } from 'src/app/models/client';
import { Cobro } from 'src/app/models/cobro';
import { Datoemp } from 'src/app/models/datoemp';
import { Pedido } from 'src/app/models/pedido';
import { PedidoDet } from 'src/app/models/pedidoDet';
import { ClientService } from 'src/app/services/client.service';
import { CobrosService } from 'src/app/services/cobros.service';
import { DatoempService } from 'src/app/services/datoemp.service';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-pedidoscobros-show',
  templateUrl: './pedidoscobros-show.component.html',
  styleUrls: ['./pedidoscobros-show.component.css']
})
export class PedidoscobrosShowComponent implements OnInit {

  cobroslistDet=[];

  pedidoShow: Pedido;
  pedidoDetShow: PedidoDet;
  public Ped_: Pedido[]; //arreglo vacio


  matrisDetCobro: Cobro[]=[];
  pedidoPend_ = {} as Pedido;
  MostrarCob: string;
  importeremanente = 0;

  totalPri: number = 0;
  totalCnt: number = 0;
  totalPed: number = 0;

  public URLPublica: any;

  pagoparcialpagado:number = 0;

  visual = false;

  tmontb: number=0;
  tmontd: number=0;
  tmonti: number=0;
  tmontn: number=0;

  nomCli='';
  rifCli='';
  tlfCli='';
  dirCli='';
  zonVen='';
  someticket = false; //Variable que almacena si tiene etiquetas


  public dempresaList: Datoemp[]; //arreglo vacio
  public clienteList: Client[]; //arreglo vacio


  constructor(
    public pedidoService: PedidoService,
    public cobroService: CobrosService,
    public clienteS: ClientService,
    private afStorage:AngularFireStorage,
    public datoempresaS : DatoempService,

    private dialogRef: MatDialogRef<PedidoscobrosShowComponent>,
        @Inject(MAT_DIALOG_DATA) data

  ) 
  {
    this.pedidoShow = data.pedidoShow;

    this.visual = true;

    this.cobroService.getCobrosDet(this.pedidoShow.idpedido).subscribe(cobrosDet => {

      this.matrisDetCobro = cobrosDet;

      this.pagoparcialpagado = 0; //reiniciamos el pago parcial para que no se embasure

      for (let i in this.matrisDetCobro) {
        if(this.matrisDetCobro[i].fechadepago) this.matrisDetCobro[i].fechadepago = this.timestampConvert(this.matrisDetCobro[i].fechadepago);
        
        
        if(this.matrisDetCobro[i].status == "ACTIVO") {
          if (this.matrisDetCobro[i].montodepago>=0) {
            this.pagoparcialpagado += Number(this.matrisDetCobro[i].montodepago);
          } else {
            this.pagoparcialpagado += 0;
          }
        }
      }

      if ( this.pagoparcialpagado > 0 ) {
        this.importeremanente = this.roundTo(this.pedidoShow.totalmontoneto - this.pagoparcialpagado,2)
      } else {
        this.importeremanente = this.pedidoShow.totalmontoneto;
      }
              
    }) 
    
    if (this.pedidoShow.idpedido) {
      this.MostrarCob = 'display:block;';
    }

  }

  ngOnInit(): void {

    this.clienteS.getClients().valueChanges().subscribe(cs =>{
      this.clienteList = cs;
    })

    //Obtiene los datos del cliente
    this.clienteS.getSpecificClient(this.pedidoShow.idcliente).valueChanges().subscribe(client =>{
      this.clienteS.clientData = client;
    })

    this.datoempresaS.getDatoemps().valueChanges().subscribe(emps =>{
      this.dempresaList = emps;
    })

  }

  onClose(){
    this.dialogRef.close();
  }


  timestampConvert(fec) {
    let dateObject = new Date(fec.seconds * 1000);
    let mes_ = dateObject.getMonth() + 1;
    let ano_ = dateObject.getFullYear();
    let dia_ = dateObject.getDate();
    return dateObject;
  }//timestampConvert


  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

}
