import { Component, OnInit,ViewChild } from '@angular/core';
import { GestionaveriasService } from 'src/app/services/gestionaverias.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Averia } from 'src/app/models/gaveria';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';
import { MrechazoService } from 'src/app/services/mrechazo.service';

import { Mrechazo } from '../../../models/mrechazo';
import * as moment from 'moment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AveriaShowComponent } from '../averia-show/averia-show.component';
import { PedidoService } from 'src/app/services/pedido.service';
import { ContentObserver } from '@angular/cdk/observers';



@Component({
  selector: 'app-reg-ave-list',
  templateUrl: './reg-ave-list.component.html',
  styleUrls: ['./reg-ave-list.component.css']
})
export class RegAveListComponent implements OnInit {
  averiaVer_ = {} as Averia;
  txtComentario = "";
  mostrardiv:boolean=false;
  pedIndex: number=-990;
  idaveriaEli: string="";
  fechaaveriaEli: Date;
  clienteaveriaEli: string="";
  averiaslist = [];
  AvelistDet=[];
  public mrechazoList: Mrechazo[]; //arreglo vacio
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['uid', 'Fecha', 'nrodocumento', 'Status', 'Cliente', 'Vendedor', 'totalaveria', 'Opc'];


  constructor(
    public gestionaveriasService: GestionaveriasService,
    public loginS       : FirebaseloginService,
    private toastr      : ToastrService,
    public mrechazoS    : MrechazoService,
    private dialogo     : MatDialog,
    private lpedidoS    : PedidoService
  ) { }

  ngOnInit(): void {

    this.gestionaveriasService.getAveriasA().subscribe(averias=>{
      this.averiaslist = averias;
      
      //ELEMENT_DATA
      this.dataSource = new MatTableDataSource(this.averiaslist);
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
    this.gestionaveriasService.averia_.fechaaveria = dateObject;
  }//timestampConvert

  timestamp3(fec){
    let dateObject = new Date(fec.seconds*1000);
    console.log(dateObject);
    this.gestionaveriasService.averia_.fechadocumento = dateObject;
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
    this.idaveriaEli = this.averiaslist[this.pedIndex].idaveria;
    this.fechaaveriaEli = this.averiaslist[this.pedIndex].fechaaveria;
    this.clienteaveriaEli = this.averiaslist[this.pedIndex].nomcliente;
    this.gestionaveriasService.mostrarForm=false;
  }
  
  onCancelar(pf?: NgForm){
    if(pf != null) pf.reset();
    this.idaveriaEli = "";
    this.clienteaveriaEli = "";
    this.mostrardiv = false;
  }

  onDelete(event){
    //this.gestionaveriasService.averia_ =  Object.assign({}, ped);
    if (this.txtComentario != ""){
      if (this.pedIndex!=-990){
        this.averiaslist[this.pedIndex].status="ELIMINADO";
        this.averiaslist[this.pedIndex].modificadopor=this.loginS.getCurrentUser().email;
        this.averiaslist[this.pedIndex].motivoEli = this.txtComentario;
        this.gestionaveriasService.deleteAverias(this.averiaslist[this.pedIndex]);
        this.toastr.show('Avería Eliminada','Operación Terminada');
        this.mostrardiv=false;
      }
    }
  }

  onEdit(event, ave){
    this.gestionaveriasService.elementoBorrados = [];
    this.gestionaveriasService.averiaslistDet = [];
    this.gestionaveriasService.lpedidoList = [];
    
    if (ave.status.toUpperCase() == 'ABIERTA'){
        this.gestionaveriasService.mostrarForm = true;
        this.gestionaveriasService.txtBtnAccion = "Actualizar Averia";
        this.gestionaveriasService.readonlyField = true;

        this.gestionaveriasService.valorAutCli = ave.nomcliente;
        this.gestionaveriasService.start_time = this.timestamp2(ave.fechaaveria).toString();
        this.gestionaveriasService.valorAutVen = ave.idvendedor;
        
        this.gestionaveriasService.presAscList = ave.precioasociado;
        this.gestionaveriasService.docAdd = ave.uid;

        this.gestionaveriasService.indicadorImpuesto = ave.indicadorImpuestoporc;
        this.gestionaveriasService.indicadorImpuestoDesc = ave.indicadorImpuestodesc;

        

        this.lpedidoS.getpedFact(ave.idcliente).subscribe(avfc=>{
          this.gestionaveriasService.lpedidoList = avfc;
        })

        this.gestionaveriasService.averia_ =  Object.assign({}, ave);
        this.gestionaveriasService.averia_.nrodocumento = ave.nrodocumento;
        this.timestampConvert(ave.fechaaveria);
        this.timestamp3(ave.fechadocumento);
        this.gestionaveriasService.nomCli = this.gestionaveriasService.averia_.nomcliente;
        this.gestionaveriasService.rifCli = this.gestionaveriasService.averia_.idcliente;   
        this.gestionaveriasService.nomrifCli = this.gestionaveriasService.rifCli + " - "+ this.gestionaveriasService.nomCli;

        //Get Order detaills
        this.gestionaveriasService.totalCnt = 0;
        this.gestionaveriasService.getAveriasDet(ave.uid).subscribe(averiasDet=>{
            this.AvelistDet = averiasDet;
            this.gestionaveriasService.matrisDetAveria = this.AvelistDet;

            for (let i in this.gestionaveriasService.matrisDetAveria){
              this.gestionaveriasService.totalPri = this.gestionaveriasService.totalPri +  this.gestionaveriasService.matrisDetAveria[i].preciomaterial;
              this.gestionaveriasService.totalCnt = this.gestionaveriasService.totalCnt +  this.gestionaveriasService.matrisDetAveria[i].cantidadmaterial;
              this.gestionaveriasService.totalAve = this.gestionaveriasService.totalAve +  this.gestionaveriasService.matrisDetAveria[i].totalpormaterial;
            }

            this.gestionaveriasService.enviar=true;
        }) 

        //Get Order detaills
        const value = this.gestionaveriasService.averia_.nrodocUID.toString().trim();
        this.lpedidoS.getPedidosDet(value).subscribe(pedidosDet=>{
          this.gestionaveriasService.averiaslistDet = pedidosDet;
        })

        // const value = this.gestionaveriasService.averia_.nrodocUID.toString().trim();
        // const i = value.indexOf( "<>" );
        // const uidPed = value.substring(i+2, value.length);

        // console.log('aaaa: ',uidPed)

        // //Get detalles del pedido
        // this.lpedidoS.getPedidosDet(uidPed).subscribe(pedidosDet=>{
        //   this.gestionaveriasService.averiaslistDet = pedidosDet;
        // })
        //console.log(this.gestionaveriasService.averiaslistDet)

    } //Si status es Abierta

  }//onEdit

  moForm(){
    //this.estadoElement = this.estadoElement === 'estado1' ? 'estado2' : 'estado1';

    if (this.gestionaveriasService.mostrarForm){
      this.gestionaveriasService.mostrarForm = false;
    }else{
      this.gestionaveriasService.mostrarForm = true;
    }

    this.gestionaveriasService.matrisDetAveria = []; // vacia la instancia
    this.gestionaveriasService.valorAutCli = "";
    this.gestionaveriasService.valorAutVen = "";
    this.gestionaveriasService.readonlyField = false;
    this.gestionaveriasService.averia_ = {} as Averia;  
    this.gestionaveriasService.averia_.fechaaveria = new Date;

    this.gestionaveriasService.totalPri = 0;
    this.gestionaveriasService.totalCnt = 0;
    this.gestionaveriasService.totalAve = 0;

    this.gestionaveriasService.start_time = moment(new Date()).format('YYYY-MM-DD');
    this.gestionaveriasService.txtBtnAccion = "Crear Averia";
 
  }//moForm

  verdetalles(event, ave){
    const dialogConfig = new MatDialogConfig;
    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "100%"
    dialogConfig.width = "95%";
    dialogConfig.height = "95%"
    this.gestionaveriasService.pestana = "RA";
    
    this.averiaVer_ =  Object.assign({}, ave);
    //this.timestampConvert(ave.fechaaveria);
    
    // if (ave.fechaaveria !== null && typeof ave.fechaaveria != "undefined"){
    //   this.timestampConvert(ave.fechaaveria); 
    // }
    // if (ave.fdespacho !== null && typeof ave.fdespacho != "undefined"){
    //   this.timestampConvert(ave.fdespacho); 
    // }
    // if (ave.fpago !== null && typeof ave.fpago != "undefined"){
    //   this.timestampConvert(ave.fpago); 
    // }
    // if (ave.ftentrega !== null && typeof ave.ftentrega != "undefined"){
    //   this.timestampConvert(ave.ftentrega); 
    // }
    // if (ave.fentrega !== null && typeof ave.fentrega != "undefined"){
    //   this.timestampConvert(ave.fentrega); 
    // }
  
    dialogConfig.data = {
      averiaShow: Object.assign({}, this.averiaVer_)
    };
  
    this.dialogo.open(AveriaShowComponent,dialogConfig);
  }


}



