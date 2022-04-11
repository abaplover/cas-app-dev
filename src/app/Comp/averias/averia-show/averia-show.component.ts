import { Component, OnInit } from '@angular/core';
import { Averia } from 'src/app/models/gaveria';
import { GestionaveriasService } from 'src/app/services/gestionaverias.service';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Inject } from '@angular/core';
import { AveriaDet } from 'src/app/models/gaveriaDet';

@Component({
  selector: 'app-averia-show',
  templateUrl: './averia-show.component.html',
  styleUrls: ['./averia-show.component.css']
})
export class AveriaShowComponent implements OnInit {

  averiaslistDet=[];
  averiaShow: Averia;
  averiaDetShow: AveriaDet;
  totalPri: number = 0;
  totalCnt: number = 0;
  totalPed: number = 0;
  fechadecierre: any;
  fechaderesolucion: any;

  tmontb: number=0;
  tmontd: number=0;
  tmonti: number=0;
  tmontn: number=0;

  existesolucion = false;

  constructor(
    public averiaService: GestionaveriasService,

    private dialogRef: MatDialogRef<AveriaShowComponent>,
        @Inject(MAT_DIALOG_DATA) data

  ) 
  {
    this.averiaShow = data.averiaShow;

    if (!this.averiaShow.fecierre){
      this.fechadecierre = "";
    }else{
      this.fechadecierre = this.timestampConvert(this.averiaShow.fecierre);
    }

    if (!this.averiaShow.feresolucion){
      this.fechaderesolucion = "";
    }else{
      this.fechaderesolucion = this.timestampConvert(this.averiaShow.feresolucion);
    }

    //Get Order detaills
    this.averiaService.getAveriasDet(data.averiaShow.uid).subscribe(averiasDet=>{
      this.totalPri=0;
      this.totalCnt=0;
      this.totalPed=0;
      
      this.averiaslistDet = averiasDet;

      for (let i in this.averiaslistDet){
        this.totalPri = this.totalPri +  this.averiaslistDet[i].preciomaterial;
        this.totalCnt = this.totalCnt +  this.averiaslistDet[i].cantidadmaterial;
        this.totalPed = this.totalPed +  this.averiaslistDet[i].totalpormaterial;

        //Si existe el dato solucion (si fue cerrada la averia) muestra la columna correspondiente
        if (this.averiaslistDet[i].solucion) this.existesolucion = true;
      }
      //Calculo del descuento en base al monto bruto
      this.tmontb = this.totalPed;
      this.tmontd = (this.totalPed*data.averiaShow.descuentoporc)/100;
      this.tmontd = this.tmontd + data.averiaShow.descuentovalor;
      //Calculo del Impuesto en base al monto bruto
      let montoDescAux=0;
      if (this.tmontd>0){
        montoDescAux = this.tmontd;
      }
      this.tmonti = ((this.tmontb - montoDescAux)* data.averiaShow.indicadorImpuestoporc)/100;

      //Calculo Monto Neto 
      this.tmontn = (this.tmontb - montoDescAux) + this.tmonti;

    })
  }

  timestampConvert(fec){
    let dateObject = new Date(fec.seconds*1000);
    let d1a, m3s,ano,ampm: string;

    d1a = dateObject.getDate().toString();
    if (dateObject.getDate()<10){
      d1a = "0"+dateObject.getDate().toString();
    }
    m3s = (dateObject.getMonth()+1).toString();
    if (dateObject.getMonth()+1<10){
      m3s = "0"+(dateObject.getMonth()+1).toString();
    }

    ampm = dateObject.getHours() >= 12 ? ' p.m.' : ' a.m.';

    return (d1a+"/"+m3s+"/"+dateObject.getFullYear() + " " +dateObject.getHours()+":"+dateObject.getMinutes()+ ampm).toString();
  }//timestampConvert


  ngOnInit(): void {
  }

  onClose(){
    this.dialogRef.close();
  }

}
