import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/models/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Inject } from '@angular/core';
import { PedidoDet } from 'src/app/models/pedidoDet';
import { FormControl, NgForm } from '@angular/forms';
import { finalize, isEmpty, map } from 'rxjs/operators';

import * as JsBarcode from 'jsbarcode'; //Para el codigo de barras

import * as moment from 'moment';
import { ClientService } from 'src/app/services/client.service';
import { Datoemp } from 'src/app/models/datoemp';


import * as pdfMake from "pdfmake/build/pdfmake";
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { DatoempService } from 'src/app/services/datoemp.service';
import { Client } from 'src/app/models/client';

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

  public URLPublica: any;

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
    public clienteS: ClientService,
    private afStorage:AngularFireStorage,
    public datoempresaS : DatoempService,

    private dialogRef: MatDialogRef<PedidoShowComponent>,
        @Inject(MAT_DIALOG_DATA) data
        
  ) 
  {
    console.log(data);
    this.pedidoShow = data.pedidoShow;

    //Verifica que el pedido haya pasado por el proceso de almacen
    if (this.pedidoShow.nrobultos) this.someticket = true;

    //Get Order detaills
    this.pedidoService.getPedidosDet(data.pedidoShow.uid).subscribe(pedidosDet=>{
      this.totalPri=0;
      this.totalCnt=0;
      this.totalPed=0;
      
      this.pedidoslistDet = pedidosDet;
      console.log("pedidoslist ", this.pedidoslistDet);

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

    console.log("fecha factura1 ",this.pedidoShow.ffactura)


  }

  onClose(){
    this.dialogRef.close();
  }

  async downloadPdf(pf?: NgForm){
   
    var bodyData = [];
    let observacion='';
    let totalArticulos=0;
    let spaceBottom=260;

    bodyData = this.pedidoslistDet;
    //console.log(bodyData);
    if (this.pedidoService.pedido_.observacion=="" || typeof this.pedidoService.pedido_.observacion=="undefined"){
      observacion = "";
    }else{
      observacion = "Observación: "+this.pedidoService.pedido_.observacion;
    }
    var algo = "";
    var rows = [];
    rows.push(['', '', '', '', '']);

    //Para llenar la tabla de detalle de pedido
    for (let i in this.pedidoslistDet) {
      let indice:number = parseInt(i);
      rows.push([this.pedidoslistDet[i].codigodematerial.toString(), this.pedidoslistDet[i].descripcionmaterial.toString(),this.pedidoslistDet[i].cantidadmaterial.toLocaleString('de-DE', {maximumFractionDigits: 0}), this.pedidoslistDet[i].preciomaterial.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2}), this.pedidoslistDet[i].totalpormaterial.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2})]);
      totalArticulos = indice+1;
      if (totalArticulos>1){
        spaceBottom=spaceBottom-20;
      }
    }

    let ordern: any;
    var docAdd: string

    this.tlfCli = this.clienteS.clientData[0].telefonom;
    this.zonVen = this.clienteS.clientData[0].zona;
    docAdd = this.pedidoShow.idpedido.toString();

    const monthNames = ["01", "02", "03", "04", "05", "06","07", "08", "09", "10", "11", "12"];
    let dateObj = moment(this.pedidoService.start_time).toDate(); //Toma la fecha del formulario
    let min_ = new Date().getMinutes();

	  var horas_ = new Array();
    horas_ [0]  = "12:" + min_ + " AM";
    horas_ [23] = "11:" + min_ + " PM";
    horas_ [22] = "10:" + min_ + " PM";
    horas_ [21] = "09:" + min_ + " PM";
		horas_ [20] = "08:" + min_ + " PM";
		horas_ [19] = "07:" + min_ + " PM";
		horas_ [18] = "06:" + min_ + " PM";
		horas_ [17] = "05:" + min_ + " PM";
		horas_ [16] = "04:" + min_ + " PM";
		horas_ [15] = "03:" + min_ + " PM";
		horas_ [14] = "02:" + min_ + " PM";
		horas_ [13] = "01:" + min_ + " PM";
		horas_ [12] = "12:" + min_ + " PM";
		horas_ [11] = "11:" + min_ + " AM";
		horas_ [10] = "10:" + min_ + " AM";
		horas_ [9] = "09:" + min_ + " AM";
		horas_ [8] = "08:" + min_ + " AM";
		horas_ [7] = "07:" + min_ + " AM";
		horas_ [6] = "06:" + min_ + " AM";
		horas_ [5] = "05:" + min_ + " AM";
		horas_ [4] = "04:" + min_ + " AM";
		horas_ [3] = "03:" + min_ + " AM";
		horas_ [2] = "02:" + min_ + " AM";
    horas_ [1] = "01:" + min_ + " AM";

    let month = monthNames[dateObj.getMonth()];
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let momento = horas_[new Date().getHours()];
    let output = day +'/'+ month + '/' + year + ' '+ momento;
    let margin_bottom = 50;
    let y1 = 600;
    let y2 = 630;
    let y3 = 640;

    if (rows.length-1 > 17){
      margin_bottom = 150;
      y1 = 520;
      y2 = 550;
      y3 = 540;
    }

    const documentDefinition = {
      pageSize: {
        width: 600,
        height: 760
      },
      pageMargins: [ 25, 30, 25, margin_bottom ],


      //Aqui va el footer



      content: [
        // if you don't need styles, you can use a simple string to define a paragraph

        {
          columns: [
            {
              width: 150,
              image: this.dempresaList[0].imglogob64,
              height: 37
            },
            {
              width: 10,
              text: ''
            },
            {
              width: 200,
              table:
              {
                  widths: [200],
                  body:
                      [
                          [
                              {text: this.dempresaList[0].descripcion,style: "boldtxt", alignment: 'center', fontSize: 12,border: [false, false, false, false]},
                          ],
                          [
                              {text: this.dempresaList[0].direccion, fontSize: 10,border: [false, false, false, false]},
                          ]
                      ]
              }
            },
            {
              width: 5,
              text: ''
            },
            {
              width: '*',
              table:
              {
                  widths: [40,'*'],
                  body:
                      [
                          [
                              {text: 'Teléfono',style: "boldtxt", fontSize: 10,border: [false, false, false, false]},
                              {text: this.dempresaList[0].telefonoFijo, fontSize: 10,border: [false, false, false, false]},
                          ],
                          [
                              {text: 'Celular',style: "boldtxt", fontSize: 10,border: [false, false, false, false]},
                              {text: this.dempresaList[0].telefonocel1, fontSize: 10,border: [false, false, false, false]},
                          ],
                          [
                              {text: 'Email:',style: "boldtxt", fontSize: 10,border: [false, false, false, false]},
                              {text: this.dempresaList[0].email, fontSize: 9,border: [false, false, false, false]},
                          ]
                      ]
              }

            }
          ],
        },

        { text:'Confirmación de pedido ',style: "linecentertitle",fontSize: 16},

        { //dos columnas, en cada se define una tabla
          columns:
          [
            {
              width: 285,
              table:
              {
                  widths: [50, 175],
                  body: [
                    [
                        {text: 'Cliente:',style: "boldtxt", border: [true, true, false, false]},
                        {text: this.pedidoShow.nomcliente, border: [false, true, true, false]}
                    ],
                    [
                      {text: 'Rif:',style: "boldtxt", border: [true, false, false, false]},
                      {text: this.pedidoShow.idcliente, border: [false, false, true, false]}
                    ],
                    [
                        {text: 'Teléfono:',style: "boldtxt", border: [true, false, false, false]},
                        {text: this.tlfCli, border: [false, false, true, false]}
                    ],
                    [
                        {text: 'Dirección:',style: "boldtxt", border: [true, false, false, true]},
                        {text: this.pedidoShow.clientedir, border: [false, false, true, true]}
                    ]
                  ]
              }
            },
            {
                width: 180,
                table:
                {
                    widths: [90, 135],
                    body: [
                      [
                          {text: 'N°:',style: "boldtxt", border: [true, true, false, false]},
                          {text: docAdd , border: [false, true, true, false]}
                      ],
                      [
                        {text: 'Fecha:',style: "boldtxt", border: [true, false, false, false]},
                        {text: output, border: [false, false, true, false]}
                      ],
                      [
                        {text: 'Condición de pago :',style: "boldtxt", border: [true, false, false, true]},
                        {text: this.pedidoShow.condiciondepago, border: [false, false, true, true]}
                      ]
                      ,
                      [
                          {text: '', border: [false, false, false, false]},
                          {text: '', border: [false, false, false, false]}
                      ]
                      ,
                      [
                          {text: 'Vendedor:',style: "boldtxt", border: [true, true, false, false]},
                          {text: this.pedidoShow.nomvendedor, border: [false, true, true, false]}
                      ]
                      ,
                      [
                          {text: 'Zona:',style: "boldtxt", border: [true, false, false, true]},
                          {text: this.zonVen, border: [false, false, true, true]}
                      ]
                    ]
                  }
            }
          ],
          // optional space between columns
          columnGap: 10
        },

         //solo espaciado
        { text:' ',style: "SpacingFull",fontSize: 16},

        //IMPRIME EL DETALLE DE LA MATRIX
        {
          width: 530,
          table:
          {
            widths: [530],
            body:
            [
              [
                {
                  layout: 'lightHorizontalLines', // optional
                  table:
                      {
                      widths: [55, 250, 40, 50, 50],
                      body:
                      [
                        [
                            {text: 'ARTÍCULO',style: "boldtxt", border: [true, true, false, true]},
                            {text: 'DESCRIPCIÓN',style: "boldtxt", border: [false, true, false, true]},
                            {text: 'CTD',style: "boldtxt", border: [false, true, false, true]},
                            {text: 'PRECIO U',style: "boldtxt", border: [false, true, false, true]},
                            {text: 'TOTAL',style: "boldtxt", border: [false, true, true, true]},
                        ]
                      ]

                      }
                }
              ]
            ]
          }
        },

        //Tabla simple sin borde, se llena con la variable "rows"
        {
          layout: 'headerLineOnly', // optional
          id: 'detalleTbl',
          table: {
            widths: [60, 250, 40, 50, 50],
            body: rows,
          },

        },
        //IMPRIME EL DETALLE DE LA MATRIX


         //solo espaciado
        // {
        //   text:rows.length-1,
        //   style: "lineSpacing",
        //   fontSize: 10,
        //   pageBreak: "before"
        // },


        // { text:' ',style: "lineSpacing",fontSize: 10,absolutePosition:{x:25, y:590}},

        {
          text: observacion,
          id: "observacion",
          style: "lineSpacing",
          fontSize: 10,
          dontBreakRows: true,
          absolutePosition:{x:25, y:y1}
        },

        { text:' ',style: "lineSpacing",fontSize: 10,absolutePosition:{x:25, y:y2}},

        //va en el pie de la pagina pero no como footer
        {
          columns:
          [
           { //columna 1
              width: 295,
              table:
              {
                  dontBreakRows: true,
                  widths: [80, 145],
                  body: [
                    [
                        {text: 'Total artículos:',style: "boldtxt", border: [true, true, false, false]},
                        {text: totalArticulos, border: [false, true, true, false]}
                    ],
                    [
                        {text: 'Total cantidades:',style: "boldtxt", border: [true, false, false, true]},
                        {text: this.pedidoShow.totalCnt.toLocaleString('de-DE', {maximumFractionDigits: 0}), border: [false, false, true, true]}
                    ]
                  ]
              }
            }, //columna 2
            {
                width: 180,
                table:
                {
                    dontBreakRows: true,
                    widths: [70, 155],
                    body: [
                      [
                          {text: 'Sub total:',style: "boldtxt", border: [true, true, false, false]},
                          {text: this.pedidoShow.totalmontobruto.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2}), alignment: 'left' , border: [false, true, true, false]}
                      ],
                      [
                          {text: 'Descuento:',style: "boldtxt", border: [true, false, false, false]},
                          {text: this.pedidoShow.totalmontodescuento.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2}), alignment: 'left', border: [false, false, true, false]}
                      ],
                      [
                          {text: 'Total a pagar:',style: "boldtxt", border: [true, false, false, true]},
                          {text: this.pedidoShow.totalPed.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2}), alignment: 'left', border: [false, false, true, true]}
                      ]
                    ]
                }
            }
          ],absolutePosition:{x:25, y:y3}

        },










      ],
      defaultStyle: {
        fontSize: 10
      },
      pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        //check if signature part is completely on the last page, add pagebreak if not
        // if (currentNode.id === 'observacion' && rows.length-1 > 17 && rows.length-1 < 24) {
        //   return true;
        // }
        return false;
      }
      ,

      styles:{
        'linecentertitle': {
            margin:[190,30,0,30] //change number 6 to increase nspace
        },
        'lineSpacing': {
          margin:[0,0,0,10] //change number 6 to increase nspace
        },
        'SpacingFull': {
          margin:[0,0,0,30] //change number 6 to increase nspace
        },
        'SpacingFull2': {
          margin:[0,0,0,60] //change number 6 to increase nspace
        },
        'SpacingFullxl': {
          margin:[0,0,0,spaceBottom] //change number 6 to increase nspace
        },
        'boldtxt':{
          bold: true
        }
      }
    }; //documentDefinition

    //si se va a generar en string base64
    /* const pdfDocGenerator0 = pdfMake.createPdf(documentDefinition);
      pdfDocGenerator0.getBase64((data) => {
        var file = data; */
      // });

    var fileId: number;
    fileId = parseInt(docAdd);

    //descomentar si se va agenerar el file de tipo blob. y comentar el de arriba
      const pdfDocGenerator1 = pdfMake.createPdf(documentDefinition);
      pdfDocGenerator1.getBlob((blob) => {
      var file = blob;

      if (fileId != this.pedidoService.pedido_.idpedido && this.pedidoService.pedido_.idpedido) {
        fileId = this.pedidoService.pedido_.idpedido;
      }

      //console.log('fileId ',fileId);
      //const id = 'Order-'+ Math.random().toString(36).substring(2)+Date.now()+'.pdf';

      const idfile = fileId +'.pdf';
      this.pedidoService.pedido_.pdfname = idfile;
      this.pedidoService.pedido_.pdfb64 = file;

      const fileRef:AngularFireStorageReference=this.afStorage.ref("Orders").child(idfile);
      const task: AngularFireUploadTask = fileRef.put(file); //Para guardar desde un archivo .Blob
      //const task: AngularFireUploadTask = fileRef.putString(file, 'base64') //Para guardar desde un string base64
      task.snapshotChanges().pipe(
          finalize(() => {
            this.URLPublica = this.afStorage.ref("Orders").child(idfile).getDownloadURL();
              fileRef.getDownloadURL().subscribe(downloadURL => {
                this.pedidoService.pedido_.pdfurl=downloadURL;
                this.URLPublica = downloadURL;
                //this.onSubmit(pf,this.URLPublica,docAdd);
              });
        })
      ).subscribe();

    });//pdfDocGenerator

    //>

    pdfMake.createPdf(documentDefinition).download(`Pedido N° ${fileId}.pdf`);


  }//pdf make
  downloadEtiquetas() {
    window.open(this.pedidoShow.ticketurl);
  }

  //Genera el codigo de barras en una imagen para poder colocarla en la etiqueta
textToBase64Barcode(text){
  var canvas = document.createElement("canvas");
  JsBarcode(canvas, text, {
    format: "CODE39",
    displayValue: false,
    lineColor: "#2f3232",
    width:4,
    height:20,
    marginLeft: 60

  });
  return canvas.toDataURL("image/png");
}

}


