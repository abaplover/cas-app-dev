import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { Pedido } from 'src/app/models/pedido';
import { Stats } from 'src/app/models/stats';
import { PedidoDet } from 'src/app/models/pedidoDet';
import { PedidoService } from 'src/app/services/pedido.service';
import { FormControl, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { animate, state,style,transition,trigger } from '@angular/animations';

//  Service
import { ClientService } from '../../../services/client.service';
import { VendedorService } from '../../../services/vendedor.service';
import { LprecioService } from '../../../services/lprecio.service';
import { CpagoService } from '../../../services/cpago.service';
import { ProductService } from '../../../services/product.service';
import { UmedidaService } from '../../../services/umedida.service';
import { IimpuestoService } from '../../../services/iimpuesto.service';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';
import { DatoempService } from 'src/app/services/datoemp.service';
// Class
import { Client } from '../../../models/client';
import { Vendedor } from '../../../models/vendedor';
import { Lprecio } from '../../../models/lprecio';
import { Cpago } from '../../../models/cpago';
import { Product } from '../../../models/product';
import { Umedida } from '../../../models/umedida';
import { Iimpuesto } from '../../../models/iimpuesto';
import { Datoemp } from '../../../models/datoemp';

import { MatInput } from '@angular/material/input';

// Import pdfmake and the fonts to use
import * as pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"; // fonts provided for pdfmake
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { TextAst } from '@angular/compiler';
import { snapshotChanges } from '@angular/fire/database';
import { finalize, isEmpty, map } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import * as moment from 'moment';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


// import * as fs from 'fs';
// import * as path from 'path';
// import { writeFileSync } from ‘fs';


@Component({
  selector: 'app-newped',
  templateUrl: './newped.component.html',
  styleUrls: ['./newped.component.css']
})
export class NewpedComponent implements OnInit {
  //@ViewChild('pForm') pform_: ElementRef;
  @ViewChild('cantidadmaterial') cantidadmaterial_: MatInput;

  estadoElement= "estado1";
  currencyPipeVEF='VEF';
  currencyPipeUSD='USD';
  currencyPipe: String;
  //pdfURL: Observable<string>;
  UploadValue: number;
  public URLPublica: any;
  //elementoBorrados: PedidoDet[]=[];

  public msj_enlace: string = 'Pedidos';
  public clienteList: Client[]; //arreglo vacio
  //public justClient: Client[];
  public vendedorList: Vendedor[]; //arreglo vacio
  public lprecioList: Lprecio[]; //arreglo vacio
  public cpagoList: Cpago[]; //arreglo vacio
  public productList: Product[]; //arreglo vacio
  public umedidaList: Umedida[]; //arreglo vacio
  public iimpuestoList: Iimpuesto[]; //arreglo vacio
  public dempresaList: Datoemp[]; //arreglo vacio
  private orderNumber: Pedido[]; //arreglo vacio
  private myempty: number;
  //public keywordCli = "idcliente";
  public keywordCli = "descripcion";
  public keywordsCli = ['idcliente','descripcion'];
  public keywordVen = "idvendedor";
  valorAutCli: string;
  valorAutVen: string;
  //maxDate:Date;
  maxDate= moment(new Date()).format('YYYY-MM-DD');
  codeBlock ='';
  companyblk ='';
  //minDate = moment(new Date()).format('YYYY-MM-DD')
  start_time = moment().format('YYYY-MM-DD hh:mm:ss');

  nomCli='';
  rifCli='';
  tlfCli='';
  dirCli='';
  zonVen='';

  constructor
  (
    public pedidoService: PedidoService,
    private toastr      : ToastrService,
    public clienteS     : ClientService,
    public vendedorS    : VendedorService,
    public lprecioS     : LprecioService,
    public cpagoS       : CpagoService,
    public productS     : ProductService,
    public umedidaS     : UmedidaService,
    public iimpuestoS   : IimpuestoService,
    public loginS       : FirebaseloginService,
    public datoempresaS : DatoempService,
    private renderer: Renderer2,
    private afStorage:AngularFireStorage
  )
  {
    const currentYear = new Date().getFullYear();
    const currentm = new Date().getMonth();
    const currentd = new Date().getDate();

    // let f = this.clienteS.getSpecificClient('J12345678').valueChanges().subscribe( (data)  => {
    //   return data;
    //   console.log(data)
    //   //this.tlfCli = data;justClient
    // });

  }

    //this.maxDate = new Date(currentYear, currentm, currentd);

  ngOnInit(): void {
    
    //this.pedidoService.pedido_.descuentoporc = 0;
    //this.pedidoService.pedido_.descuentovalor = 0;
    this.pedidoService.mostrarForm = false;
    this.pedidoService.valorAutCli = "";
    this.pedidoService.valorAutVen = "";
  //this.pedidoService.pedido_.fechapedido = new Date;

    this.clienteS.getClients().valueChanges().subscribe(cs =>{
      this.clienteList = cs;
    })

    this.vendedorS.getVendedors().valueChanges().subscribe(vs =>{
      this.vendedorList = vs;
    })

    this.lprecioS.getLprecio().valueChanges().subscribe(lps =>{
      this.lprecioList = lps;
    })

    this.cpagoS.getCpagos().valueChanges().subscribe(cps =>{
      this.cpagoList = cps;
    })

    this.productS.getProducts().valueChanges().subscribe(ps =>{
      this.productList = ps;
    })

    this.umedidaS.getUmedidas().valueChanges().subscribe(ums =>{
      this.umedidaList = ums;
    })

    this.iimpuestoS.getIimpuestos().valueChanges().subscribe(iis =>{
      this.iimpuestoList = iis;
    })

    this.datoempresaS.getDatoemps().valueChanges().subscribe(emps =>{
      this.dempresaList = emps;
    })


    this.pedidoService.enviar = false;
    //coloca el campo de busqueda de vendedror disabled
    this.pedidoService.disabledFieldVen = true;

  }//ngOnInit

  async OneClient(){
    
  }

  async generarpdf(pf?: NgForm){
   
    var bodyData = [];
    let observacion='';
    let totalArticulos=0;
    let spaceBottom=260;

    bodyData = this.pedidoService.matrisDetPedido;
    //console.log(bodyData);
    if (this.pedidoService.pedido_.observacion=="" || typeof this.pedidoService.pedido_.observacion=="undefined"){
      observacion = "";
    }else{
      observacion = "Observación: "+this.pedidoService.pedido_.observacion;
    }
    var algo = "";
    var rows = [];
    rows.push(['', '', '', '', '']);

    for (let i in this.pedidoService.matrisDetPedido){
      let indice:number = parseInt(i);
      rows.push([this.pedidoService.matrisDetPedido[i].codigodematerial.toString(), this.pedidoService.matrisDetPedido[i].descripcionmaterial.toString(),this.pedidoService.matrisDetPedido[i].cantidadmaterial.toLocaleString('de-DE', {maximumFractionDigits: 0}), this.pedidoService.matrisDetPedido[i].preciomaterial.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2}), this.pedidoService.matrisDetPedido[i].totalpormaterial.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2})]);
      totalArticulos = indice+1;
      if (totalArticulos>1){
        spaceBottom=spaceBottom-20;
      }
    }

    let ordern: any;
    var docAdd: string

    if (this.pedidoService.txtBtnAccion.toString() == "Crear Pedido"){
      //busca el nro de pedido
      ordern = await this.pedidoService.getOrderStat2();
      docAdd = ordern.toString();
    }
    if (this.pedidoService.txtBtnAccion.toString() == "Actualizar Pedido"){
    //Llena los datos vacios del cliente para enviarlos al pdf cuando se actualiza un pedido
      this.tlfCli = this.clienteS.clientData[0].telefonom;
      this.zonVen = this.clienteS.clientData[0].zona;
      docAdd = this.pedidoService.pedido_.idpedido.toString();
    }

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
                        {text: this.pedidoService.pedido_.nomcliente, border: [false, true, true, false]}
                    ],
                    [
                      {text: 'Rif:',style: "boldtxt", border: [true, false, false, false]},
                      {text: this.pedidoService.pedido_.idcliente, border: [false, false, true, false]}
                    ],
                    [
                        {text: 'Teléfono:',style: "boldtxt", border: [true, false, false, false]},
                        {text: this.tlfCli, border: [false, false, true, false]}
                    ],
                    [
                        {text: 'Dirección:',style: "boldtxt", border: [true, false, false, true]},
                        {text: this.pedidoService.pedido_.clientedir, border: [false, false, true, true]}
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
                        {text: this.pedidoService.pedido_.condiciondepago, border: [false, false, true, true]}
                      ]
                      ,
                      [
                          {text: '', border: [false, false, false, false]},
                          {text: '', border: [false, false, false, false]}
                      ]
                      ,
                      [
                          {text: 'Vendedor:',style: "boldtxt", border: [true, true, false, false]},
                          {text: this.pedidoService.pedido_.nomvendedor, border: [false, true, true, false]}
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
                        {text: this.pedidoService.totalCnt.toLocaleString('de-DE', {maximumFractionDigits: 0}), border: [false, false, true, true]}
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
                          {text: this.pedidoService.tmontb.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2}), alignment: 'left' , border: [false, true, true, false]}
                      ],
                      [
                          {text: 'Descuento:',style: "boldtxt", border: [true, false, false, false]},
                          {text: this.pedidoService.tmontd.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2}), alignment: 'left', border: [false, false, true, false]}
                      ],
                      [
                          {text: 'Total a pagar:',style: "boldtxt", border: [true, false, false, true]},
                          {text: this.pedidoService.tmontn.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2}), alignment: 'left', border: [false, false, true, true]}
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
    const pdfDocGenerator0 = pdfMake.createPdf(documentDefinition);
      pdfDocGenerator0.getBase64((data) => {
        var file = data;
      // });


    //descomentar si se va agenerar el file de tipo blob. y comentar el de arriba
    //const pdfDocGenerator1 = pdfMake.createPdf(documentDefinition);
    // pdfDocGenerator1.getBlob((blob) => {
    //   var file = blob;
      var fileId: number;
      if (this.pedidoService.pedido_.uid != null){
        fileId = parseInt(docAdd)-1;
      }else{
        fileId = parseInt(docAdd);
      }

      if (fileId != this.pedidoService.pedido_.idpedido && this.pedidoService.pedido_.idpedido) {
        fileId = this.pedidoService.pedido_.idpedido;
      }

      //console.log('fileId ',fileId);
      //const id = 'Order-'+ Math.random().toString(36).substring(2)+Date.now()+'.pdf';

      const idfile = fileId +'.pdf';
      this.pedidoService.pedido_.pdfname = idfile;
      this.pedidoService.pedido_.pdfb64 = file;

      const fileRef:AngularFireStorageReference=this.afStorage.ref("Orders").child(idfile);
      //const task: AngularFireUploadTask = fileRef.put(file); //Para guardar desde un archivo .Blob
      const task: AngularFireUploadTask = fileRef.putString(file, 'base64') //Para guardar desde un string base64
      task.snapshotChanges().pipe(
          finalize(() => {
            this.URLPublica = this.afStorage.ref("Orders").child(idfile).getDownloadURL();
              fileRef.getDownloadURL().subscribe(downloadURL => {
                this.pedidoService.pedido_.pdfurl=downloadURL;
                this.URLPublica = downloadURL;
                this.onSubmit(pf,this.URLPublica,docAdd);
              });
        })
      ).subscribe();

    });//pdfDocGenerator

    //>



    //pdfMake.createPdf(documentDefinition).open();


  }//pdf make




  onSubmit(pf?: NgForm, url?:string,pedNro?:any){
    
    let ahora = new Date();

    //Nuevo Pedido
    if(this.pedidoService.pedido_.uid == null)
    {
        //set parameter date
        //console.log('desde pedidos: ',url);


        //this.pedidoService.pedido_.email = "yhonatandcarruido@gmail.com";



        this.pedidoService.pedido_.pdfurl = url;

  
        this.pedidoService.pedido_.fechapedido = new Date(this.pedidoService.start_time);
        this.pedidoService.pedido_.fechapedido.setDate(this.pedidoService.pedido_.fechapedido.getDate()+1);
        this.pedidoService.pedido_.fechapedido.setHours(ahora.getHours());
        this.pedidoService.pedido_.fechapedido.setMinutes(ahora.getMinutes());

        //console.log('Fecha ped: ',this.pedidoService.pedido_.fechapedido);


        this.pedidoService.pedido_.creado = new Date;
        this.pedidoService.pedido_.modificado = new Date;
        this.pedidoService.pedido_.creadopor = this.loginS.getCurrentUser().email;
        this.pedidoService.pedido_.modificadopor = this.loginS.getCurrentUser().email;
        this.pedidoService.pedido_.status = 'ACTIVO';
        this.pedidoService.pedido_.motivorechazo = "";
        this.pedidoService.pedido_.precioasociado = this.pedidoService.presAscList;
        //campos calculados que no vienen del form
        this.pedidoService.pedido_.totalmontobruto = this.pedidoService.tmontb;
        this.pedidoService.pedido_.totalmontodescuento = this.pedidoService.tmontd;
        this.pedidoService.pedido_.totalmontoimpuesto = this.pedidoService.tmonti;
        this.pedidoService.pedido_.totalmontoneto = this.pedidoService.tmontn;
        this.pedidoService.pedido_.totalPri = this.pedidoService.totalPri;
        this.pedidoService.pedido_.totalCnt = this.pedidoService.totalCnt;
        this.pedidoService.pedido_.totalPed = this.pedidoService.totalPed;
        this.pedidoService.pedido_.indicadorImpuestodesc = this.pedidoService.indicadorImpuestoDesc;
        this.pedidoService.pedido_.indicadorImpuestoporc = this.pedidoService.indicadorImpuesto;

        //Limpia los campos que se iran al detalle del pedido
        this.pedidoService.pedido_.codigodematerial = "";
        this.pedidoService.pedido_.descripcionmaterial = "";
        this.pedidoService.pedido_.cantidadmaterial = 0;
        this.pedidoService.pedido_.unidaddemedida = "";
        this.pedidoService.pedido_.preciomaterial = 0;
        this.pedidoService.pedido_.totalpormaterial = 0;

        if (this.pedidoService.pedido_.descuentoporc == null || typeof this.pedidoService.pedido_.descuentoporc === "undefined" || isNaN(this.pedidoService.pedido_.descuentoporc)){
          this.pedidoService.pedido_.descuentoporc = 0;
        }
        if (this.pedidoService.pedido_.descuentovalor == null || typeof this.pedidoService.pedido_.descuentovalor === "undefined" || isNaN(this.pedidoService.pedido_.descuentovalor)){
          this.pedidoService.pedido_.descuentovalor = 0;
        }


        //crear variable con el detalle de pedidos
        this.codeBlock = '<table style="font-family: Helvetica;font-size: 11px; width:100%">'+
                         '<tr>'+
                         '<th style="text-align:left;border: 1px solid #ddd;" scope="row">Código de material</th>'+
                         '<th style="text-align:left;border: 1px solid #ddd;" scope="row">Descripción del material</th>'+
                         '<th style="text-align:right;border: 1px solid #ddd;" scope="row">Precio</th>'+
                         '<th style="text-align:right;border: 1px solid #ddd;" scope="row">Cantidad</th>'+
                         '<th style="text-align:right;border: 1px solid #ddd;" scope="row">Total por material</th>'+
                         '</tr>';

        for (let i in this.pedidoService.matrisDetPedido){
          this.codeBlock = this.codeBlock +
            '<tr>' +
              '<td style="border: 1px solid #ddd;">'+this.pedidoService.matrisDetPedido[i].codigodematerial.toString()+'</td>'+
              '<td style="border: 1px solid #ddd;">'+this.pedidoService.matrisDetPedido[i].descripcionmaterial.toString()+'</td>'+
              '<td style="text-align:right;border: 1px solid #ddd;">'+this.pedidoService.matrisDetPedido[i].preciomaterial.toString()+'</td>'+
              '<td style="text-align:right;border: 1px solid #ddd;">'+this.pedidoService.matrisDetPedido[i].cantidadmaterial.toString()+'</td>'+
              '<td style="text-align:right;border: 1px solid #ddd;">'+this.pedidoService.matrisDetPedido[i].totalpormaterial.toString()+'</td>'+
            '</tr>';

            //this.pedidoService.matrisDetPedido[i].idpedido.toString();

        }
        this.codeBlock = this.codeBlock +
          '<tr>'+
            '<th style="border: 1px solid #ddd;" scope="col" colspan=3>Total</th>'+
            '<th style="text-align:right;border: 1px solid #ddd;" scope="row">'+ this.pedidoService.totalCnt +'</th>'+
            '<th style="text-align:right;border: 1px solid #ddd;" scope="row">'+ this.pedidoService.totalPed.toFixed(2) +'</th>'+
          '</tr>'
        '</table>';

        this.companyblk = '<tbody>'+
                                  '<tr style="font-size: 18px">'+
                                      '<td style="text-align:left" scope="row">'+ this.dempresaList[0].descripcion +'</td>'+
                                  '</tr>'+
                                  '<tr style="font-size: 18px">'+
                                      '<td style="text-align:left" scope="row">'+ this.dempresaList[0].direccion +'</td>'+
                                  '</tr>'+
                                  '<tr style="font-size: 18px">'+
                                      '<td style="text-align:left" scope="row">Rif: '+ this.dempresaList[0].rif +'</td>'+
                                   '</tr>'+
                                  '<tr style="font-size: 18px">'+
                                      '<td style="text-align:left" scope="row">Tlfs: '+ this.dempresaList[0].telefonoFijo +',  '+ this.dempresaList[0].telefonocel1 +'</td>'+
                                  '</tr>'+
                                  '<tr style="font-size: 18px">'+
                                      '<td style="text-align:left" scope="row">Email: '+ this.dempresaList[0].email +'</td>'+
                                   '</tr>'+
                            '</tbody>';

        this.pedidoService.pedido_.codeBlock = this.codeBlock;
        this.pedidoService.pedido_.companycod = this.dempresaList[0].idempresa;

        this.pedidoService.pedido_.companyblk = this.companyblk;

        //GENERAR PDF
        //this.generarpdf();
        //console.log('pdfURLooo: ',this.URLPublica);




        //Add in fireStore head
        this.pedidoService.addPedidos(this.pedidoService.pedido_,pedNro);
        this.pedidoService.tmontb = 0;
        this.pedidoService.tmontd = 0;
        this.pedidoService.tmonti = 0;
        this.pedidoService.tmontn = 0;
        //console.log('id Insertado: ', this.pedidoService.docAdd);

          //Add details
        if (this.pedidoService.docAdd != -1){
            //save detaills

            for (let i in this.pedidoService.matrisDetPedido){
             //this.pedidoService.matrisDetPedido[i].idpedido=this.pedidoService.docAdd;
             this.pedidoService.matrisDetPedido[i].idpedido=this.pedidoService.pedido_.uid;
             this.pedidoService.addPedidosDet(this.pedidoService.matrisDetPedido[i]);
            }
            this.pedidoService.totalPri = 0;
            this.pedidoService.totalCnt = 0;
            this.pedidoService.totalPed = 0;
        }

        this.toastr.success('Operación Terminada', 'Pedido Incluido');
        this.pedidoService.enviar = false;


    }else{ //Actualiza Pedido
        //set parameter date
        //console.log('www: ',this.pedidoService.tmonti)
        //this.pedidoService.pedido_.fechapedido = new Date(this.pedidoService.pedido_.fechapedido);
        
        
        this.pedidoService.pedido_.fechapedido = new Date(this.pedidoService.start_time);
        this.pedidoService.pedido_.fechapedido.setDate(this.pedidoService.pedido_.fechapedido.getDate()+1);
        this.pedidoService.pedido_.fechapedido.setHours(ahora.getHours());
        this.pedidoService.pedido_.fechapedido.setMinutes(ahora.getMinutes());

        
        this.pedidoService.pedido_.modificado = new Date;
        this.pedidoService.pedido_.modificadopor = this.loginS.getCurrentUser().email;
        this.pedidoService.pedido_.precioasociado = this.pedidoService.presAscList;
        //campos calculados que no vienen del form
        this.pedidoService.pedido_.totalmontobruto = this.pedidoService.tmontb;
        this.pedidoService.pedido_.totalmontodescuento = this.pedidoService.tmontd;
        this.pedidoService.pedido_.totalmontoimpuesto = this.pedidoService.tmonti;
        this.pedidoService.pedido_.totalmontoneto = this.pedidoService.tmontn;
        this.pedidoService.pedido_.totalPri = this.pedidoService.totalPri;
        this.pedidoService.pedido_.totalCnt = this.pedidoService.totalCnt;
        this.pedidoService.pedido_.totalPed = this.pedidoService.totalPed;
        this.pedidoService.pedido_.indicadorImpuestodesc = this.pedidoService.indicadorImpuestoDesc;
        this.pedidoService.pedido_.indicadorImpuestoporc = this.pedidoService.indicadorImpuesto;

        //Limpia los campos que se iran al detalle del pedido
        this.pedidoService.pedido_.codigodematerial = "";
        this.pedidoService.pedido_.descripcionmaterial = "";
        this.pedidoService.pedido_.cantidadmaterial = 0;
        this.pedidoService.pedido_.unidaddemedida = "";
        this.pedidoService.pedido_.preciomaterial = 0;
        this.pedidoService.pedido_.totalpormaterial = 0;

        if (this.pedidoService.pedido_.descuentoporc == null || typeof this.pedidoService.pedido_.descuentoporc === "undefined" || isNaN(this.pedidoService.pedido_.descuentoporc)){
          this.pedidoService.pedido_.descuentoporc = 0;
        }
        if (this.pedidoService.pedido_.descuentovalor == null || typeof this.pedidoService.pedido_.descuentovalor === "undefined" || isNaN(this.pedidoService.pedido_.descuentovalor)){
          this.pedidoService.pedido_.descuentovalor = 0;
        }

        //Update Orders
        console.log(this.pedidoService.pedido_);
        this.pedidoService.updatePedidos(this.pedidoService.pedido_);

        for (let i in this.pedidoService.matrisDetPedido){
          //Actualiza los registros
          if (this.pedidoService.matrisDetPedido[i].uid!=""){
              this.pedidoService.updatePedidosDet(this.pedidoService.matrisDetPedido[i]);


          }else{
              //Agrega los nuevos registros
              this.pedidoService.matrisDetPedido[i].idpedido=this.pedidoService.pedido_.uid;
              this.pedidoService.addPedidosDet(this.pedidoService.matrisDetPedido[i]);
          }
        }
        //Elimina los registros seleccionados
        for (let k in this.pedidoService.elementoBorrados){
          this.pedidoService.deletePedidosDet(this.pedidoService.elementoBorrados[k])
        }
        this.pedidoService.elementoBorrados = []; // vacia la instancia


        this.pedidoService.totalPri = 0;
        this.pedidoService.totalCnt = 0;
        this.pedidoService.totalPed = 0;

        this.pedidoService.tmontb = 0;
        this.pedidoService.tmontd = 0;
        this.pedidoService.tmonti = 0;
        this.pedidoService.tmontn = 0;


        this.toastr.success('Operación Terminada','Pedido Actualizado');
        this.pedidoService.enviar = false;
    }

    // if(this.pedidoService.txtBtnAccion == "Agregar Pedido"){}else{}

    pf.resetForm();
    this.pedidoService.readonlyField = false;
    this.pedidoService.pedido_ = {} as Pedido;
    this.pedidoService.matrisDetPedido = []; // vacia la instancia
    this.pedidoService.txtBtnAccion = "Crear Pedido";
    this.pedidoService.mostrarForm = false;
  }//onSubmit

  @ViewChild('pedidoForm') myForm;
  resetFormFunc(field?: number){
    this.myForm.resetForm();
    if (field == 2){
    }
  }//resetFormfunc


  resetForm(pf?: NgForm)
  {

    if (this.pedidoService.pedido_.nomcliente !== undefined || this.pedidoService.pedido_.condiciondepago !== undefined){
      if(confirm("¿Quieres abandonar el pedido? " )) {
        if(pf != null) pf.reset();
        this.pedidoService.matrisDetPedido = []; // vacia la instancia
        this.pedidoService.elementoBorrados = []; // vacia la instancia
        this.pedidoService.readonlyField = false;
        this.pedidoService.pedido_ = {} as Pedido;
        this.pedidoService.totalPri = 0;
        this.pedidoService.totalCnt = 0;
        this.pedidoService.totalPed = 0;
        this.pedidoService.tmontb = 0;
        this.pedidoService.tmontd = 0;
        this.pedidoService.tmonti = 0;
        this.pedidoService.tmontn = 0;
        this.pedidoService.txtBtnAccion = "Crear Pedido";
        this.pedidoService.enviar = false;
        this.pedidoService.mostrarForm = false;
      }
    }else{
        if(pf != null) pf.reset();
        this.pedidoService.matrisDetPedido = []; // vacia la instancia
        this.pedidoService.elementoBorrados = []; // vacia la instancia
        this.pedidoService.readonlyField = false;
        this.pedidoService.pedido_ = {} as Pedido;
        this.pedidoService.totalPri = 0;
        this.pedidoService.totalCnt = 0;
        this.pedidoService.totalPed = 0;
        this.pedidoService.tmontb = 0;
        this.pedidoService.tmontd = 0;
        this.pedidoService.tmonti = 0;
        this.pedidoService.tmontn = 0;
        this.pedidoService.txtBtnAccion = "Crear Pedido";
        this.pedidoService.enviar = false;
        this.pedidoService.mostrarForm = false;
    }

  }//resetForm

  selectEvent(elemento){
    const val = elemento.idcliente;
    this.pedidoService.pedido_.idcliente = val;
    const isLargeNumber = (element) => element.idcliente.trim() == val.trim();
    const indice = this.clienteList.findIndex(isLargeNumber);
    this.pedidoService.pedido_.nomcliente = "";

    this.nomCli="";
    this.rifCli="";
    this.tlfCli="";
    this.dirCli="";
    this.zonVen="";

    this.pedidoService.pedido_.email = "";
    this.pedidoService.pedido_.listaprecio = "";

    this.pedidoService.pedido_.codigodematerial = "Ninguno";
    this.pedidoService.pedido_.descripcionmaterial = "";
    this.pedidoService.pedido_.preciomaterial = this.myempty;
    this.pedidoService.pedido_.cantidadmaterial = this.myempty;
    this.pedidoService.pedido_.totalpormaterial = this.myempty;
    this.pedidoService.matrisDetPedido = []; // vacia la instancia
    this.pedidoService.totalPri = 0;
    this.pedidoService.totalCnt = 0;
    this.pedidoService.totalPed = 0;

    this.pedidoService.tmontb = 0;
    this.pedidoService.tmontd = 0;
    this.pedidoService.tmonti = 0;
    this.pedidoService.tmontn = 0;
    this.pedidoService.pedido_.descuentovalor = this.myempty;
    this.pedidoService.pedido_.descuentoporc = this.myempty;

    if (indice != -1){
      this.pedidoService.pedido_.nomcliente = this.clienteList[indice].descripcion;
      this.pedidoService.pedido_.email = this.clienteList[indice].email;
      this.pedidoService.pedido_.listaprecio = this.clienteList[indice].listaprecio;
      this.pedidoService.pedido_.clientedir = this.clienteList[indice].direccion;
      this.nomCli=this.clienteList[indice].descripcion;
      this.tlfCli=this.clienteList[indice].telefonof;
      this.dirCli=this.clienteList[indice].direccion;
      this.rifCli=this.clienteList[indice].rif;

      //Buscar precio asociado a l lista de precios
      const lnum = (element) => element.descripcion.trim() == this.clienteList[indice].listaprecio.trim();
      const ind = this.lprecioList.findIndex(lnum);
      this.pedidoService.presAscList = this.lprecioList[ind].precio;
      //console.log('precio saociado: ',this.lprecioList[ind].precio);

      //Buscamos el indicador de impuesto
      const limp = (element) => element.descripcion.trim() == this.clienteList[indice].iimpuesto.trim();
      const indic = this.iimpuestoList.findIndex(limp);
      this.pedidoService.indicadorImpuesto = this.iimpuestoList[indic].porcentajei;
      this.pedidoService.indicadorImpuestoDesc = this.iimpuestoList[indic].descripcion;
      //console.log('impuesto asociado: ',this.pedidoService.indicadorImpuestoDesc, ' %: ',this.pedidoService.indicadorImpuesto);

      //Buscamos el Vendedor asociado a la zona de ventas asociada al cliente
      //se puede comentar estas lineas para buscar el vendedor de forma manual, ademas de quitar el ReadOnly del campo de busqueda
      const idven = (element) => element.vzona.trim() == this.clienteList[indice].zona.trim();
      const indVen = this.vendedorList.findIndex(idven);
      this.pedidoService.valorAutVen = this.vendedorList[indVen].idvendedor;
      this.pedidoService.pedido_.nomvendedor = this.vendedorList[indVen].descripcion;
      this.zonVen = this.vendedorList[indVen].vzona;
      this.pedidoService.pedido_.idvendedor = this.vendedorList[indVen].idvendedor;
      //********************************************************************************* */

    }
  }//selectEvent

  onChangeSearch(val: string) {
    //console.log('aqui: ',val);
    this.pedidoService.pedido_.idcliente = val;

    const isLargeNumber = (element) => element.idcliente.trim() == val.trim();
    const indice = this.clienteList.findIndex(isLargeNumber);
    this.pedidoService.pedido_.nomcliente = "";
    this.pedidoService.pedido_.email = "";
    this.pedidoService.pedido_.listaprecio = "";
    this.pedidoService.pedido_.nomvendedor = "";
    this.pedidoService.valorAutVen = "";

    this.nomCli="";
    this.rifCli="";
    this.tlfCli="";
    this.dirCli="";
    this.zonVen="";


    this.pedidoService.pedido_.codigodematerial = "Ninguno";
    this.pedidoService.pedido_.descripcionmaterial = "";
    this.pedidoService.pedido_.preciomaterial = this.myempty;
    this.pedidoService.pedido_.cantidadmaterial = this.myempty;
    this.pedidoService.pedido_.totalpormaterial = this.myempty;
    this.pedidoService.matrisDetPedido = []; // vacia la instancia
    this.pedidoService.totalPri = 0;
    this.pedidoService.totalCnt = 0;
    this.pedidoService.totalPed = 0;

    this.pedidoService.tmontb = 0;
    this.pedidoService.tmontd = 0;
    this.pedidoService.tmonti = 0;
    this.pedidoService.tmontn = 0;
    this.pedidoService.pedido_.descuentovalor = this.myempty;
    this.pedidoService.pedido_.descuentoporc = this.myempty;

    if (indice != -1){
      this.pedidoService.pedido_.nomcliente = this.clienteList[indice].descripcion;
      this.pedidoService.pedido_.email = this.clienteList[indice].email;
      this.pedidoService.pedido_.listaprecio = this.clienteList[indice].listaprecio;
      this.pedidoService.pedido_.clientedir = this.clienteList[indice].direccion;

      this.nomCli=this.clienteList[indice].descripcion;
      this.tlfCli=this.clienteList[indice].telefonof;
      this.dirCli=this.clienteList[indice].direccion;
      this.rifCli=this.clienteList[indice].rif;

      //Buscar precio asociado a l lista de precios
      const lnum = (element) => element.descripcion.trim() == this.clienteList[indice].listaprecio.trim();
      const ind = this.lprecioList.findIndex(lnum);
      this.pedidoService.presAscList = this.lprecioList[ind].precio;
      //console.log('precio asociado: ',this.lprecioList[ind].precio);

      //Buscamos el indicador de impuesto
      const limp = (element) => element.descripcion.trim() == this.clienteList[indice].iimpuesto.trim();
      const indic = this.iimpuestoList.findIndex(limp);
      this.pedidoService.indicadorImpuesto = this.iimpuestoList[indic].porcentajei;
      this.pedidoService.indicadorImpuestoDesc = this.iimpuestoList[indic].descripcion;
      //console.log('impuesto asociado: ',this.indicadorImpuestoDesc, ' %: ',this.indicadorImpuesto);
    }
  }//onChangeSearch

  closeautoComplete(){
    this.nomCli="";
    this.rifCli="";
    this.tlfCli="";
    this.dirCli="";
    this.zonVen=""
    this.pedidoService.pedido_.nomcliente = "";
    this.pedidoService.pedido_.nomvendedor = "";
    this.pedidoService.valorAutVen = "";
    this.pedidoService.pedido_.email = "";
    this.pedidoService.pedido_.listaprecio = "";
    this.pedidoService.presAscList = "";
    this.pedidoService.indicadorImpuesto=0;
    this.pedidoService.indicadorImpuestoDesc="";
    this.pedidoService.pedido_.codigodematerial = "Ninguno";
    this.pedidoService.pedido_.descripcionmaterial = "";
    this.pedidoService.pedido_.preciomaterial = this.myempty;
    this.pedidoService.pedido_.cantidadmaterial = this.myempty;
    this.pedidoService.pedido_.totalpormaterial = this.myempty;
    this.pedidoService.matrisDetPedido = []; // vacia la instancia
    this.pedidoService.totalPri = 0;
    this.pedidoService.totalCnt = 0;
    this.pedidoService.totalPed = 0;

    this.pedidoService.tmontb = 0;
    this.pedidoService.tmontd = 0;
    this.pedidoService.tmonti = 0;
    this.pedidoService.tmontn = 0;
    this.pedidoService.pedido_.descuentovalor = this.myempty;
    this.pedidoService.pedido_.descuentoporc = this.myempty;
    //this.resetFormFunc(2);
  }//closeautoComplete

  selectedchangeCodMat(val,pffield?){
    let pusd1: number = 0;
    let pusd2: number = 0;
    let pvef1: number = 0;
    let pvef2: number = 0;
    let precioMaterial: number;

    const isLargeNumber = (element) => element.idmaterial == val;
    const i = this.productList.findIndex(isLargeNumber);

    if (i != -1){

      this.pedidoService.pedido_.descripcionmaterial = this.productList[i].descripcion;
      pusd1 = this.productList[i].preciousd1;
      pusd2 = this.productList[i].preciousd2;
      pvef1 = this.productList[i].preciovef1;
      pvef2 = this.productList[i].preciovef2;

      if (this.pedidoService.presAscList == "P-USD-1"){
        precioMaterial = this.productList[i].preciousd1
        this.currencyPipe = this.currencyPipeUSD;
      }
      if (this.pedidoService.presAscList == "P-USD-2"){
        precioMaterial = this.productList[i].preciousd2
        this.currencyPipe = this.currencyPipeUSD;
      }
      if (this.pedidoService.presAscList == "P-VEF-1"){
        precioMaterial = this.productList[i].preciovef1
        this.currencyPipe = this.currencyPipeVEF;
      }
      if (this.pedidoService.presAscList == "P-VEF-2"){
        precioMaterial = this.productList[i].preciovef2
        this.currencyPipe = this.currencyPipeVEF;
      }
      this.pedidoService.pedido_.unidaddemedida =  this.productList[i].unidadmedida;
      this.pedidoService.pedido_.preciomaterial =  precioMaterial;
      this.pedidoService.pedido_.cantidadmaterial = this.myempty;
      this.pedidoService.pedido_.totalpormaterial = this.myempty;


      //this.cantidadmaterial_.focus();
      //
      //this.cd.detectChanges();

    }
    this.renderer.selectRootElement('#cantidadmaterial').focus();
  }// selectedchangeCodMat

  txtctnchange(cnt){
    let tmat;
    if (this.pedidoService.pedido_.preciomaterial != null){
      tmat = cnt.target.value * this.pedidoService.pedido_.preciomaterial;
      this.pedidoService.pedido_.totalpormaterial = parseFloat(tmat.toFixed(2));  //.toLocaleString("es-CO");
    }
  }//txtctnchange

  txtdescpchange(descp){
    let valor = (this.pedidoService.totalPed*descp.target.value)/100;
    this.pedidoService.tmontd = parseFloat(valor.toFixed(2));
    this.pedidoService.tmontd = this.pedidoService.tmontd + this.pedidoService.pedido_.descuentovalor;
    //this.pedidoService.pedido_.descuentovalor = this.pedidoService.tmontd;

    //Calculo del Impuesto en base al monto bruto
    let montoDescAux=0;
    if (this.pedidoService.tmontd>0){
      montoDescAux = this.pedidoService.tmontd;
    }
    this.pedidoService.tmonti = ((this.pedidoService.tmontb - montoDescAux)* this.pedidoService.indicadorImpuesto)/100;

    //Calculo Monto Neto Anterior
    //this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux) + this.pedidoService.tmonti;
    //Calculo Monto Neto sin iva
    this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux);

  }//txtdescpchange

  txtdescvchange(descv){
    let aux_tmontdv = descv.target.value;

    if (aux_tmontdv == null || typeof aux_tmontdv == undefined || aux_tmontdv.toString() ==""){
         aux_tmontdv=0;
    }

    //Calcula el desc porcentual
    let auxDescPorce = (this.pedidoService.totalPed*this.pedidoService.pedido_.descuentoporc)/100;

    this.pedidoService.tmontd = auxDescPorce + parseFloat(aux_tmontdv);


    //let valor:number = (this.pedidoService.tmontd*100)/this.pedidoService.totalPed;
    //this.pedidoService.pedido_.descuentoporc = parseFloat(valor.toFixed(2));

    //Calculo del Impuesto en base al monto bruto
    let montoDescAux=0;
    if (this.pedidoService.tmontd>0){
      montoDescAux = this.pedidoService.tmontd;
    }
    this.pedidoService.tmonti = ((this.pedidoService.tmontb - montoDescAux)* this.pedidoService.indicadorImpuesto)/100;

    //Calculo Monto Neto Anterior
    //this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux) + this.pedidoService.tmonti;
    //Calculo Monto Neto sin iva
    this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux);

  }//txtdescvchange


  // sortBy(prop: string) {
  //   return this.composer.arrcompositions.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  // }

  agregardetalles(){

    //agregar fila en el array
   // console.log("indice ",this.pedidoService.matrisDetPedido.length);


    this.pedidoService.matrisDetPedido = this.pedidoService.matrisDetPedido.concat({
      idpedido:null,
      uid:'',
      codigodematerial:this.pedidoService.pedido_.codigodematerial,
      descripcionmaterial:this.pedidoService.pedido_.descripcionmaterial,
      unidaddemedida:this.pedidoService.pedido_.unidaddemedida,
      preciomaterial:this.pedidoService.pedido_.preciomaterial,
      cantidadmaterial:this.pedidoService.pedido_.cantidadmaterial,
      totalpormaterial:this.pedidoService.pedido_.totalpormaterial,
      indice:this.pedidoService.matrisDetPedido.length
    });
    //this.pedidoService.matrisDetPedido.sort((a, b) => (a.codigodematerial > b.codigodematerial ? 1 : -1));
    //this.pedidoService.matrisDetPedido.sort((a, b) => a.totalpormaterial - b.totalpormaterial)

    //Calcular totales para la tabla
    this.pedidoService.totalPri = this.pedidoService.totalPri + this.pedidoService.pedido_.preciomaterial;
    this.pedidoService.totalCnt = this.pedidoService.totalCnt + this.pedidoService.pedido_.cantidadmaterial;
    this.pedidoService.totalPed = this.pedidoService.totalPed + this.pedidoService.pedido_.totalpormaterial;

    //Calculo del descuento en base al monto bruto
    this.pedidoService.tmontb = this.pedidoService.totalPed;
    if (this.pedidoService.pedido_.descuentoporc == null || typeof this.pedidoService.pedido_.descuentoporc === "undefined" || isNaN(this.pedidoService.pedido_.descuentoporc)){
      this.pedidoService.pedido_.descuentoporc = 0;
    }
    if (this.pedidoService.pedido_.descuentovalor == null || typeof this.pedidoService.pedido_.descuentovalor === "undefined" || isNaN(this.pedidoService.pedido_.descuentoporc)){
      this.pedidoService.pedido_.descuentovalor = 0;
    }
    this.pedidoService.tmontd = (this.pedidoService.totalPed*this.pedidoService.pedido_.descuentoporc)/100;
    this.pedidoService.tmontd = this.pedidoService.tmontd + this.pedidoService.pedido_.descuentovalor;
    //this.pedidoService.pedido_.descuentovalor = parseFloat(this.pedidoService.tmontd.toFixed(2));
    //-----------------------------------------------------------------------------------------------

    //Calculo del Impuesto en base al monto bruto
    let montoDescAux=0;
    if (this.pedidoService.tmontd>0){
      montoDescAux = this.pedidoService.tmontd;
    }
    //console.log('impuest: ',this.pedidoService.indicadorImpuesto);

    this.pedidoService.tmonti = ((this.pedidoService.tmontb - montoDescAux)* this.pedidoService.indicadorImpuesto)/100;

    //Calculo Monto Neto Anterior
    //this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux) + this.pedidoService.tmonti;
    //Calculo Monto Neto sin iva
    this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux);

    if (this.pedidoService.matrisDetPedido.length > 0){
      this.pedidoService.mostrardesc = true;
    }else{
      this.pedidoService.mostrardesc = false;
    }

    this.pedidoService.pedido_.codigodematerial="";
    this.pedidoService.pedido_.descripcionmaterial="";
    this.pedidoService.pedido_.preciomaterial= this.myempty;
    this.pedidoService.pedido_.unidaddemedida="";
    this.pedidoService.pedido_.cantidadmaterial = this.myempty;
    this.pedidoService.pedido_.totalpormaterial = this.myempty;

    if (this.pedidoService.tmontn > 0 && this.pedidoService.totalCnt > 0 && this.pedidoService.tmontb>0){
      this.pedidoService.enviar = true;
      this.pedidoService.readonlyField = true;
    }
  }//agregardetalles

  removeDetRow(i){

    //console.log('aaa? ',i);
    //console.log('matriz pedido 1? ',this.pedidoService.matrisDetPedido);
    //console.table(this.pedidoService.matrisDetPedido);
    this.pedidoService.totalPri = this.pedidoService.totalPri - this.pedidoService.matrisDetPedido[i].preciomaterial;
    this.pedidoService.totalCnt = this.pedidoService.totalCnt - this.pedidoService.matrisDetPedido[i].cantidadmaterial;
    this.pedidoService.totalPed = this.pedidoService.totalPed - this.pedidoService.matrisDetPedido[i].totalpormaterial;

    //Calculo del descuento
    this.pedidoService.tmontb = this.pedidoService.totalPed;
    this.pedidoService.tmontd = (this.pedidoService.totalPed*this.pedidoService.pedido_.descuentoporc)/100;
    this.pedidoService.tmontd = this.pedidoService.tmontd + this.pedidoService.pedido_.descuentovalor;
    //this.pedidoService.pedido_.descuentovalor = this.pedidoService.tmontd

    //Auxiliar de elementos a eliminar de la db
    this.pedidoService.elementoBorrados.push(this.pedidoService.matrisDetPedido[i]);

    ////console.log('elementoBorrados? ',this.pedidoService.elementoBorrados);
    //console.table(this.pedidoService.elementoBorrados);

    //Eliminando el registro del vector
    i !== -1 && this.pedidoService.matrisDetPedido.splice( i, 1 );

    //console.log('matriz pedido 2? ',this.pedidoService.matrisDetPedido);
    console.table(this.pedidoService.matrisDetPedido);
    if (this.pedidoService.matrisDetPedido.length > 0){
      this.pedidoService.mostrardesc = true;
    }else{
      this.pedidoService.mostrardesc = false;
    }

    //Calculo del Impuesto en base al monto bruto
    let montoDescAux=0;
    if (this.pedidoService.tmontd>0){
      montoDescAux = this.pedidoService.tmontd;
    }
    this.pedidoService.tmonti = ((this.pedidoService.tmontb - montoDescAux)* this.pedidoService.indicadorImpuesto)/100;

    //Calculo Monto Neto Anterior
    //this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux) + this.pedidoService.tmonti;
    //Calculo Monto Neto sin iva
    this.pedidoService.tmontn = (this.pedidoService.tmontb - montoDescAux);

    if (this.pedidoService.tmontn <= 0 || this.pedidoService.totalCnt <= 0 || this.pedidoService.tmontb <= 0){
      this.pedidoService.enviar = false;
      this.pedidoService.readonlyField = false;
    }
  }//removeDetRow

}//class
