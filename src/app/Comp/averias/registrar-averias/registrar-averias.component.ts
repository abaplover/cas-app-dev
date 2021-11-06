import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { Averia } from 'src/app/models/gaveria';
import { Stats } from 'src/app/models/stats';
import { AveriaDet } from 'src/app/models/gaveriaDet';
import { GestionaveriasService } from 'src/app/services/gestionaverias.service';
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
import { PedidoService } from '../../../services/pedido.service';
import { MaveriaService } from 'src/app/services/maveria.service';
// Class
import { Client } from '../../../models/client';
import { Vendedor } from '../../../models/vendedor';
import { Lprecio } from '../../../models/lprecio';
import { Cpago } from '../../../models/cpago';
import { Product } from '../../../models/product';
import { Umedida } from '../../../models/umedida';
import { Iimpuesto } from '../../../models/iimpuesto';
import { Datoemp } from '../../../models/datoemp';
import { Pedido } from '../../../models/pedido';
import { PedidoDet } from '../../../models/pedidoDet';
import { Maveria } from 'src/app/models/maveria';
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
import { Event } from '@angular/router';


(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-registrar-averias',
  templateUrl: './registrar-averias.component.html',
  styleUrls: ['./registrar-averias.component.css']
})

export class RegistrarAveriasComponent implements OnInit {

  //@ViewChild('pForm') pform_: ElementRef;
  @ViewChild('cantidadmaterial') cantidadmaterial_: MatInput;

  estadoElement= "estado1";
  currencyPipeVEF='VEF';
  currencyPipeUSD='USD';
  currencyPipe: String;
  //pdfURL: Observable<string>;
  UploadValue: number;
  public URLPublica: any;
  //elementoBorrados: AveriaDet[]=[];
  
  public msj_enlace: string = 'Averias';
  public clienteList: Client[]; //arreglo vacio
  public vendedorList: Vendedor[]; //arreglo vacio
  public lprecioList: Lprecio[]; //arreglo vacio
  public cpagoList: Cpago[]; //arreglo vacio
  public nrodocList: Cpago[]; //arreglo vacio
  public productList: Product[]; //arreglo vacio
  public umedidaList: Umedida[]; //arreglo vacio
  public iimpuestoList: Iimpuesto[]; //arreglo vacio
  public dempresaList: Datoemp[]; //arreglo vacio
  private idAveNumber: Averia[]; //arreglo vacio

  public maveriaList: Maveria[];
  public motivoAve:string;

  public matrix: PedidoDet[];
  public maxCant: number;
  public cantidadmaterial: number;
  public preciomaterial: number;
  public codigodematerial: string;
  public descripcionmaterial: string;
  public totalpormaterial: number
  private nrodoc:string;

  private myempty: number;
  //public keywordCli = "idcliente";
  public keywordCli = "descripcion";
  public keywordDoc = "nrofactura";
  public keywordsCli = ['idcliente','descripcion'];
  public keywordVen = "idvendedor";
  valorAutCli: string;
  valorAutVen: string;
  //maxDate:Date;
  maxDate= moment(new Date()).format('YYYY-MM-DD');
  codeBlock ='';
  companyblk ='';
  //minDate = moment(new Date()).format('YYYY-MM-DD')
  timeFD = moment(new Date()).format('DD/MM/YYYY')
  montoOriginal: number;
  totalAveria: number;
  porcentajeReclamo: number;
  cntMat = 0;

  nomCli='';
  rifCli='';
  nomrifCli='';
  tlfCli='';
  dirCli='';
  zonVen='';

  constructor
  ( 
    public gestionaveriasService: GestionaveriasService,
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
    public lpedidoS     : PedidoService,
    public maveriaS     : MaveriaService,
    private renderer: Renderer2,
    private afStorage:AngularFireStorage
  ) 
  {
    const currentYear = new Date().getFullYear();
    const currentm = new Date().getMonth();
    const currentd = new Date().getDate();
    //this.maxDate = new Date(currentYear, currentm, currentd);
  }

  ngOnInit(): void {
    //console.log('El DOCU: ',this.gestionaveriasService.averia_.nrodocumento)

    this.gestionaveriasService.mostrarForm = false;
    this.gestionaveriasService.valorAutCli = "";
    this.gestionaveriasService.valorAutVen = "";

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

    this.maveriaS.getMaverias().valueChanges().subscribe(mave =>{
      this.maveriaList = mave;
    })

    this.gestionaveriasService.enviar = false;
    //coloca el campo de busqueda de vendedror disabled
    this.gestionaveriasService.disabledFieldVen = true;
    
  }//ngOnInit

  async generarpdf(pf?: NgForm){

    var bodyData = [];
    let observacion='';
    let totalArticulos=0;
    let spaceBottom=260;

    bodyData = this.gestionaveriasService.matrisDetAveria;

    if (this.gestionaveriasService.averia_.observacion=="" || typeof this.gestionaveriasService.averia_.observacion=="undefined"){
      observacion = "";
    }else{
      observacion = "Observación: "+this.gestionaveriasService.averia_.observacion;
    }
    this.tlfCli = this.gestionaveriasService.averia_.tlfcliente;
    this.dirCli = this.gestionaveriasService.averia_.clientedir;
    this.zonVen = this.gestionaveriasService.averia_.zonvendedor;
    this.gestionaveriasService.averia_.status = "ABIERTA"; 

    var algo = "";
    var rows = [];
    rows.push(['', '', '', '', '', '']);
    
    for (let i in this.gestionaveriasService.matrisDetAveria){
      let indice:number = parseInt(i);
      rows.push([this.gestionaveriasService.matrisDetAveria[i].codigodematerial.toString(), this.gestionaveriasService.matrisDetAveria[i].descripcionmaterial.toString(),this.gestionaveriasService.matrisDetAveria[i].cantidadmaterial.toLocaleString('de-DE', {maximumFractionDigits: 0}), this.gestionaveriasService.matrisDetAveria[i].preciomaterial.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2}), this.gestionaveriasService.matrisDetAveria[i].totalpormaterial.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2}),this.gestionaveriasService.matrisDetAveria[i].motivoaveria.toString()]);
      totalArticulos = indice+1;
      if (totalArticulos>1){
        spaceBottom=spaceBottom-20;
      }
    }
 
    let idAven: any;
    var docAdd: string

    if (this.gestionaveriasService.txtBtnAccion.toString() == "Crear Averia"){
      //busca el nro de averia
      idAven = await this.gestionaveriasService.getOrderStat2();
      docAdd = idAven.toString();
    }
    if (this.gestionaveriasService.txtBtnAccion.toString().trim() == "Actualizar Averia"){
      docAdd = this.gestionaveriasService.averia_.idaveria.toString();
    }

    const monthNames = ["01", "02", "03", "04", "05", "06","07", "08", "09", "10", "11", "12"];
    let dateObj = this.gestionaveriasService.averia_.fechaaveria;
    let dateObj2 = this.gestionaveriasService.averia_.fechadocumento;
    let min_ = dateObj.getMinutes();

	  var horas_ = new Array();
    horas_ [0]  = "12:" + min_ + " PM";
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
		horas_ [12] = "12:" + min_ + " AM";
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
    //let momento = horas_[dateObj.getHours()];  //Si requiere Horas
    let output = day +'/'+ month + '/' + year; //solo fecha
    let month2 = monthNames[dateObj2.getMonth()];
    let day2 = String(dateObj2.getDate()).padStart(2, '0');
    let year2 = dateObj2.getFullYear();
    //let momento2 = horas_[dateObj2.getHours()]; //Si requiere Horas
    let output2 = day2 +'/'+ month2 + '/' + year2;

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

        { text:'Solicitud de Avería ',style: "linecentertitle",fontSize: 16},

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
                        {text: this.gestionaveriasService.averia_.nomcliente, border: [false, true, true, false]}
                    ],  
                    [
                      {text: 'Rif:',style: "boldtxt", border: [true, false, false, false]}, 
                      {text: this.gestionaveriasService.averia_.idcliente, border: [false, false, true, false]}
                    ],  
                    [
                        {text: 'Teléfono:',style: "boldtxt", border: [true, false, false, false]}, 
                        {text: this.tlfCli, border: [false, false, true, false]}
                    ],    
                    [
                        {text: 'Dirección:',style: "boldtxt", border: [true, false, false, true]}, 
                        {text: this.dirCli, border: [false, false, true, true]}
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
                        {text: '',style: "boldtxt", border: [true, false, false, true]}, 
                        {text: '', border: [false, false, true, true]}
                      ]
                      ,
                      [
                          {text: '', border: [false, false, false, false]}, 
                          {text: '', border: [false, false, false, false]}
                      ]
                      ,    
                      [
                          {text: 'Vendedor:',style: "boldtxt", border: [true, true, false, false]}, 
                          {text: this.gestionaveriasService.averia_.nomvendedor, border: [false, true, true, false]}
                      ]
                      ,    
                      [
                          {text: 'Zona:',style: "boldtxt", border: [true, false, false, false]}, 
                          {text: this.gestionaveriasService.averia_.zonvendedor, border: [false, false, true, false]}
                      ],
                      [
                          {text: 'Doc. Ref:',style: "boldtxt", border: [true, false, false, false]}, 
                          {text: this.gestionaveriasService.averia_.nrodocumento, border: [false, false, true, false]}
                      ],
                      [
                          {text: 'Fecha Documento:',style: "boldtxt", border: [true, false, false, true]}, 
                          {text: output2, border: [false, false, true, true]}
                      ]
                    ]
                  }
            }
          ],
          // optional space between columns
          columnGap: 10
        },

         //solo espaciado
        { text:' ',style: "SpacingFull",fontSize: 14},

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
                      widths: [50, 195, 40, 40, 40,80],
                      body: 
                      [
                        [
                            {text: 'ARTÍCULO',style: "boldtxt", border: [true, true, false, true]}, 
                            {text: 'DESCRIPCIÓN',style: "boldtxt", border: [false, true, false, true]},
                            {text: 'CTD',style: "boldtxt", border: [false, true, false, true]},
                            {text: 'PREC. U',style: "boldtxt", border: [false, true, false, true]},
                            {text: 'TOTAL',style: "boldtxt", border: [false, true, true, true]},
                            {text: 'MOTIVO',style: "boldtxt", border: [false, true, true, true]},
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
          id: 'detalleTbl',fontSize: 9,
          table: {
            widths: [55, 195, 40, 40, 40,80],
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
                        {text: this.gestionaveriasService.totalCnt.toLocaleString('de-DE', {maximumFractionDigits: 0}), border: [false, false, true, true]}
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
                          {text: 'Total Averías:',style: "boldtxt", border: [true, true, false, true]}, 
                          {text: this.gestionaveriasService.averia_.totalaveria.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2}), alignment: 'left', border: [false, true, true, true]}
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
      if (this.gestionaveriasService.averia_.uid != null){
        fileId = parseInt(docAdd)-1;
      }else{
        fileId = parseInt(docAdd);
      }

      //console.log('fileId ',fileId);
      //const id = 'Order-'+ Math.random().toString(36).substring(2)+Date.now()+'.pdf';
      const idfile = fileId +'.pdf';
      this.gestionaveriasService.averia_.pdfname = idfile;
      this.gestionaveriasService.averia_.pdfb64 = file;
                                                                  
      const fileRef:AngularFireStorageReference=this.afStorage.ref("Orders").child(idfile);
      //const task: AngularFireUploadTask = fileRef.put(file); //Para guardar desde un archivo .Blob
      const task: AngularFireUploadTask = fileRef.putString(file, 'base64') //Para guardar desde un string base64
      task.snapshotChanges().pipe(
          finalize(() => {                        
            this.URLPublica = this.afStorage.ref("Orders").child(idfile).getDownloadURL();
              fileRef.getDownloadURL().subscribe(downloadURL => {
                this.gestionaveriasService.averia_.pdfurl=downloadURL;
                this.URLPublica = downloadURL;
                this.onSubmit(pf,this.URLPublica,docAdd);
              });
        })
      ).subscribe();

    });//pdfDocGenerator

    //>
    //pdfMake.createPdf(documentDefinition).open();
  }//pdf make


  onSubmit(pf?: NgForm, url?:string,aveNro?:any){
    //Nuevo Averia
    if(this.gestionaveriasService.averia_.uid == null)
    { 
        //set parameter date
    //> comentar la linea de abajo  
        //this.gestionaveriasService.averia_.email = "yhonatandcarruido@gmail.com"; 
        //this.gestionaveriasService.averia_.email = "yhonatandcarruido@gmail.com,ricardoarangures@gmail.com";
        
        this.gestionaveriasService.averia_.pdfurl = url;
        let ahora = new Date();
        this.gestionaveriasService.averia_.fechaaveria = new Date(this.gestionaveriasService.start_time);
        this.gestionaveriasService.averia_.fechaaveria.setDate(this.gestionaveriasService.averia_.fechaaveria.getDate()+1);
        this.gestionaveriasService.averia_.fechaaveria.setHours(ahora.getHours());
        this.gestionaveriasService.averia_.fechaaveria.setMinutes(ahora.getMinutes());
        this.gestionaveriasService.averia_.creado = new Date;
        this.gestionaveriasService.averia_.modificado = new Date;
        this.gestionaveriasService.averia_.creadopor = this.loginS.getCurrentUser().email;
        this.gestionaveriasService.averia_.modificadopor = this.loginS.getCurrentUser().email;
        this.gestionaveriasService.averia_.status = 'ABIERTA';

        if (!this.gestionaveriasService.averia_.txtAveria){
          this.gestionaveriasService.averia_.txtAveria = "";
        }
        if (!this.gestionaveriasService.averia_.txtResolucion){
          this.gestionaveriasService.averia_.txtResolucion = "";
        }
        if (!this.gestionaveriasService.averia_.txtCierre){
          this.gestionaveriasService.averia_.txtCierre = "";
        }
        
        //crear variable con el detalle de averias 
        this.codeBlock = '<table style="font-family: Helvetica;font-size: 11px; width:100%">'+
                         '<tr>'+
                         '<th style="text-align:left;border: 1px solid #ddd;" scope="row">Código de material</th>'+
                         '<th style="text-align:left;border: 1px solid #ddd;" scope="row">Descripción del material</th>'+
                         '<th style="text-align:right;border: 1px solid #ddd;" scope="row">Precio</th>'+
                         '<th style="text-align:right;border: 1px solid #ddd;" scope="row">Cantidad</th>'+
                         '<th style="text-align:right;border: 1px solid #ddd;" scope="row">Total por material</th>'+
                         '</tr>';
                         
        for (let i in this.gestionaveriasService.matrisDetAveria){
          this.codeBlock = this.codeBlock +  
            '<tr>' +
              '<td style="border: 1px solid #ddd;">'+this.gestionaveriasService.matrisDetAveria[i].codigodematerial.toString()+'</td>'+
              '<td style="border: 1px solid #ddd;">'+this.gestionaveriasService.matrisDetAveria[i].descripcionmaterial.toString()+'</td>'+
              '<td style="text-align:right;border: 1px solid #ddd;">'+this.gestionaveriasService.matrisDetAveria[i].preciomaterial.toString()+'</td>'+
              '<td style="text-align:right;border: 1px solid #ddd;">'+this.gestionaveriasService.matrisDetAveria[i].cantidadmaterial.toString()+'</td>'+
              '<td style="text-align:right;border: 1px solid #ddd;">'+this.gestionaveriasService.matrisDetAveria[i].totalpormaterial.toString()+'</td>'+
            '</tr>';

            //this.gestionaveriasService.matrisDetAveria[i].idaveria.toString();
           
        }
        this.codeBlock = this.codeBlock + 
          '<tr>'+
            '<th style="border: 1px solid #ddd;" scope="col" colspan=3>Total</th>'+
            '<th style="text-align:right;border: 1px solid #ddd;" scope="row">'+ this.gestionaveriasService.totalCnt +'</th>'+
            '<th style="text-align:right;border: 1px solid #ddd;" scope="row">'+ this.gestionaveriasService.totalAve.toFixed(2) +'</th>'+
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

        this.gestionaveriasService.averia_.codeBlock = this.codeBlock;
        this.gestionaveriasService.averia_.companycod = this.dempresaList[0].idempresa; 
        this.gestionaveriasService.averia_.companyblk = this.companyblk; 
        this.gestionaveriasService.averia_.nrodocumento = this.nrodoc;

        //Add in fireStore head
        this.gestionaveriasService.addAverias(this.gestionaveriasService.averia_,aveNro);  
          //Add details
        if (this.gestionaveriasService.docAdd != -1){
            //save detaills
            for (let i in this.gestionaveriasService.matrisDetAveria){
             this.gestionaveriasService.matrisDetAveria[i].idaveria=this.gestionaveriasService.averia_.uid;
             this.gestionaveriasService.matrisDetAveria[i].aprobado = false;
             this.gestionaveriasService.addAveriasDet(this.gestionaveriasService.matrisDetAveria[i]);
            }
            this.gestionaveriasService.totalPri = 0;
            this.gestionaveriasService.totalCnt = 0;
            this.gestionaveriasService.totalAve = 0;
        }

        this.toastr.success('Operación Terminada', 'Averia Incluido');
        this.gestionaveriasService.enviar = false;

    
    }else{ //Actualiza Averia
        this.gestionaveriasService.averia_.modificado = new Date;
        this.gestionaveriasService.averia_.modificadopor = this.loginS.getCurrentUser().email;
        
        //Update Orders
        this.gestionaveriasService.updateAverias(this.gestionaveriasService.averia_);
        
        for (let i in this.gestionaveriasService.matrisDetAveria){
          //Actualiza los registros 
          if (this.gestionaveriasService.matrisDetAveria[i].uid!=""){
              this.gestionaveriasService.updateAveriasDet(this.gestionaveriasService.matrisDetAveria[i]);       
          }else{
              //Agrega los nuevos registros
              this.gestionaveriasService.matrisDetAveria[i].idaveria=this.gestionaveriasService.averia_.uid;
              this.gestionaveriasService.addAveriasDet(this.gestionaveriasService.matrisDetAveria[i]);
          }      
        }
        //Elimina los registros seleccionados 
        for (let k in this.gestionaveriasService.elementoBorrados){
          this.gestionaveriasService.deleteAveriasDet(this.gestionaveriasService.elementoBorrados[k])
        }
        this.gestionaveriasService.elementoBorrados = []; // vacia la instancia

        this.gestionaveriasService.totalPri = 0;
        this.gestionaveriasService.totalCnt = 0;
        this.gestionaveriasService.totalAve = 0;
   
        this.toastr.success('Operación Terminada','Averia Actualizado');
        this.gestionaveriasService.enviar = false;
    }

    // if(this.gestionaveriasService.txtBtnAccion == "Agregar Averia"){}else{}

    pf.resetForm();
    this.gestionaveriasService.readonlyField = false;
    this.gestionaveriasService.averia_ = {} as Averia;  
    this.gestionaveriasService.matrisDetAveria = []; // vacia la instancia
    this.gestionaveriasService.txtBtnAccion = "Crear Averia"; 
    this.gestionaveriasService.mostrarForm = false;
  }//onSubmit

  @ViewChild('avForm') myForm;
  resetFormFunc(field?: number){  
    this.myForm.resetForm();
    if (field == 2){  
    }
  }//resetFormfunc


  resetForm(pf?: NgForm)
  {
   
    if (this.gestionaveriasService.averia_.nomcliente !== undefined){
      if(confirm("¿Quieres abandonar esta averia? " )) {
        if(pf != null) pf.reset();
        this.gestionaveriasService.matrisDetAveria = []; // vacia la instancia
        this.gestionaveriasService.elementoBorrados = []; // vacia la instancia
        this.gestionaveriasService.readonlyField = false;
        this.gestionaveriasService.averia_ = {} as Averia; 
        this.gestionaveriasService.averia_.totalaveria = 0;
        this.gestionaveriasService.totalPri = 0;
        this.gestionaveriasService.totalCnt = 0;
        this.gestionaveriasService.totalAve = 0;

        this.gestionaveriasService.txtBtnAccion = "Crear Averia"; 
        this.gestionaveriasService.enviar = false;
        this.gestionaveriasService.mostrarForm = false;
      }
    }else{
        if(pf != null) pf.reset();
        this.gestionaveriasService.matrisDetAveria = []; // vacia la instancia
        this.gestionaveriasService.elementoBorrados = []; // vacia la instancia
        this.gestionaveriasService.readonlyField = false;
        this.gestionaveriasService.averia_ = {} as Averia; 
        this.gestionaveriasService.averia_.totalaveria;
        this.gestionaveriasService.totalPri = 0;
        this.gestionaveriasService.totalCnt = 0;
        this.gestionaveriasService.totalAve = 0;
        this.gestionaveriasService.txtBtnAccion = "Crear Averia"; 
        this.gestionaveriasService.enviar = false;
        this.gestionaveriasService.mostrarForm = false;
    }
    
  }//resetForm

  selectEvent(elemento){

    this.gestionaveriasService.averiaslistDet = [];
    this.gestionaveriasService.lpedidoList = [];
    
    
    const val = elemento.idcliente;
    this.gestionaveriasService.averia_.idcliente = val;
    const isLargeNumber = (element) => element.idcliente.trim() == val.trim();
    const indice = this.clienteList.findIndex(isLargeNumber);

    this.lpedidoS.getpedFact(elemento.idcliente).subscribe(ped=>{
      this.gestionaveriasService.lpedidoList = ped;
    })
    


    this.gestionaveriasService.nomCli="";
    this.gestionaveriasService.rifCli="";
    this.gestionaveriasService.nomrifCli = "";
    this.tlfCli="";
    this.dirCli="";
    this.zonVen="";

    this.gestionaveriasService.matrisDetAveria = []; // vacia la instancia
    this.gestionaveriasService.totalPri = 0;
    this.gestionaveriasService.totalCnt = 0;
    this.gestionaveriasService.totalAve = 0;

    if (indice != -1){
      this.gestionaveriasService.averia_.nomcliente = this.clienteList[indice].descripcion;
      this.gestionaveriasService.averia_.email = this.clienteList[indice].email;
      this.gestionaveriasService.averia_.clientedir = this.clienteList[indice].direccion;
      this.gestionaveriasService.nomCli=this.clienteList[indice].descripcion;
      this.tlfCli=this.clienteList[indice].telefonof;
      this.gestionaveriasService.averia_.tlfcliente = this.clienteList[indice].telefonof;
      this.dirCli=this.clienteList[indice].direccion;
      
      this.gestionaveriasService.rifCli=this.clienteList[indice].rif;
      this.gestionaveriasService.nomrifCli = this.gestionaveriasService.rifCli + " - " + this.gestionaveriasService.nomCli;
      this.gestionaveriasService.averia_.status = "ABIERTA";

      //Buscamos el Vendedor asociado a la zona de ventas asociada al cliente
      //se puede comentar estas lineas para buscar el vendedor de forma manual, ademas de quitar el ReadOnly del campo de busqueda
      const idven = (element) => element.vzona.trim() == this.clienteList[indice].zona.trim();
      const indVen = this.vendedorList.findIndex(idven);
      this.gestionaveriasService.averia_.nomvendedor = this.vendedorList[indVen].descripcion;
      this.gestionaveriasService.averia_.idvendedor = this.vendedorList[indVen].idvendedor;
      this.gestionaveriasService.averia_.zonvendedor = this.vendedorList[indVen].vzona;
      //********************************************************************************* */
    }
  }//selectEvent

  onChangeSearch(val: string) {
    this.gestionaveriasService.averia_.idcliente = val;

    const isLargeNumber = (element) => element.idcliente.trim() == val.trim();
    const indice = this.clienteList.findIndex(isLargeNumber);
    this.gestionaveriasService.averia_.nomcliente = "";
    this.gestionaveriasService.averia_.email = "";
    this.gestionaveriasService.averia_.nomvendedor = "";
    this.gestionaveriasService.valorAutVen = "";

    this.gestionaveriasService.nomCli="";
    this.gestionaveriasService.rifCli="";
    this.gestionaveriasService.nomrifCli = "";
    this.tlfCli="";
    this.dirCli="";   
    this.zonVen="";
    
    this.gestionaveriasService.matrisDetAveria = []; // vacia la instancia
    this.gestionaveriasService.totalPri = 0;
    this.gestionaveriasService.totalCnt = 0;
    this.gestionaveriasService.totalAve = 0;

    if (indice != -1){
      this.gestionaveriasService.averia_.nomcliente = this.clienteList[indice].descripcion;
      this.gestionaveriasService.averia_.email = this.clienteList[indice].email;
      this.gestionaveriasService.averia_.clientedir = this.clienteList[indice].direccion;

      this.gestionaveriasService.nomCli=this.clienteList[indice].descripcion;
      this.tlfCli=this.clienteList[indice].telefonof;
      this.gestionaveriasService.averia_.tlfcliente = this.clienteList[indice].telefonof;
      this.dirCli=this.clienteList[indice].direccion;
      this.gestionaveriasService.rifCli=this.clienteList[indice].rif;
      this.nomrifCli = this.gestionaveriasService.rifCli + " - " + this.gestionaveriasService.nomCli;

      //Buscar precio asociado a l lista de precios
      const lnum = (element) => element.descripcion.trim() == this.clienteList[indice].listaprecio.trim();
      const ind = this.lprecioList.findIndex(lnum);
      this.gestionaveriasService.presAscList = this.lprecioList[ind].precio;

      const idven = (element) => element.vzona.trim() == this.clienteList[indice].zona.trim();
      const indVen = this.vendedorList.findIndex(idven);
      this.gestionaveriasService.averia_.nomvendedor = this.vendedorList[indVen].descripcion;
      this.gestionaveriasService.averia_.idvendedor = this.vendedorList[indVen].idvendedor;
      this.gestionaveriasService.averia_.zonvendedor = this.vendedorList[indVen].vzona;

      //Buscamos el indicador de impuesto
      const limp = (element) => element.descripcion.trim() == this.clienteList[indice].iimpuesto.trim();
      const indic = this.iimpuestoList.findIndex(limp);
      this.gestionaveriasService.indicadorImpuesto = this.iimpuestoList[indic].porcentajei;
      this.gestionaveriasService.indicadorImpuestoDesc = this.iimpuestoList[indic].descripcion;

    }
  }//onChangeSearch

  closeautoComplete(){
    this.gestionaveriasService.lpedidoList = [];

    this.gestionaveriasService.nomCli="";
    this.gestionaveriasService.rifCli="";
    this.gestionaveriasService.nomrifCli = "";
    this.tlfCli="";
    this.dirCli="";
    this.zonVen=""
    this.gestionaveriasService.averia_.nomcliente = "";
    this.gestionaveriasService.averia_.nomvendedor = "";
    this.gestionaveriasService.valorAutVen = "";
    this.gestionaveriasService.averia_.email = "";
    this.gestionaveriasService.presAscList = "";
    this.gestionaveriasService.indicadorImpuesto=0;
    this.gestionaveriasService.indicadorImpuestoDesc="";
    this.gestionaveriasService.matrisDetAveria = []; // vacia la instancia
    this.gestionaveriasService.totalPri = 0;
    this.gestionaveriasService.totalCnt = 0;
    this.gestionaveriasService.totalAve = 0;

    this.borrarSeleccion()

  }//closeautoComplete















  selectEventDoc(txt){
    //solo si se envia $event como parametro
    console.log(txt)
    const uidPed = txt.uid;
    const tdoc = txt.tipodoc;
    const fdoc = txt.ffactura.seconds;
    this.gestionaveriasService.averia_.montoOriginal = txt.totalmontobruto;

    this.gestionaveriasService.averia_.tipodocumento = tdoc;
    this.gestionaveriasService.averia_.nrodocumento = txt.nrofactura;
     
    this.gestionaveriasService.averia_.fechadocumento = this.timestampConvert(fdoc);

    this.gestionaveriasService.averia_.nrodocUID = uidPed;
    
    //Get Order detaills
    this.lpedidoS.getPedidosDet(uidPed).subscribe(pedidosDet=>{
      this.gestionaveriasService.averiaslistDet = pedidosDet;
    })
    this.nrodoc = txt.nrofactura
    this.borrarSeleccion();
  }
  
  onChangeSearchDoc(txt){
    let uidPed;
    let tdoc;
    let fdoc;
    const info = (element) => element.nrofactura.trim() == txt.trim();
    const indice = this.gestionaveriasService.lpedidoList.findIndex(info);

    if (indice != -1){
      uidPed = this.gestionaveriasService.lpedidoList[indice].uid;
      tdoc = this.gestionaveriasService.lpedidoList[indice].tipodoc;
      fdoc = this.gestionaveriasService.lpedidoList[indice].ffactura;
  
      this.gestionaveriasService.averia_.tipodocumento = tdoc;
      this.gestionaveriasService.averia_.nrodocumento = this.gestionaveriasService.lpedidoList[indice].nrofactura;
     
     console.log('jjjj',this.gestionaveriasService.averia_.nrodocumento)
      this.gestionaveriasService.averia_.fechadocumento = this.timestampConvert(fdoc);
  
      //Get Order detaills
      this.lpedidoS.getPedidosDet(uidPed).subscribe(pedidosDet=>{
        this.gestionaveriasService.averiaslistDet = pedidosDet;
      })
      this.nrodoc = txt
      this.borrarSeleccion();
    }else{
      //no existe
    }  
  }

  closeautoCompleteDoc(){
    this.gestionaveriasService.averiaslistDet=[];
    this.borrarSeleccion();
  }

  // //se cambio el Select por el ng-autocomplete
  // selectedFactDoc(txt){
  //   //solo si se envia $event como parametro
  //   const value = txt.target.value.toString().trim();
  //   const text  = txt.target.options[txt.target.options.selectedIndex].text
  //   let i = value.indexOf( "<>" );
  //   let k = value.indexOf( "*" );
  //   let j = value.indexOf( "=" );

  //   const uidPed = value.substring(i+2, k);
  //   const tdoc = value.substring(k+1, j);
  //   const fdoc = value.substring(j+1, value.length);

  //   this.gestionaveriasService.averia_.tipodocumento = tdoc;
  //   this.gestionaveriasService.averia_.fechadocumento = this.timestampConvert(fdoc);

  //   //Get Order detaills
  //   this.lpedidoS.getPedidosDet(uidPed).subscribe(pedidosDet=>{
  //     this.gestionaveriasService.averiaslistDet = pedidosDet;
  //   })
  //   this.nrodoc = text
  //   this.borrarSeleccion();
  // }


  borrarSeleccion(){
    this.cantidadmaterial = 1;
    this.maxCant = 0
    this.preciomaterial = 0;
    this.totalpormaterial = 0;
    this.motivoAve = "";
    this.codigodematerial = "";
  }
  
  timestampConvert(fec){

    let dateObject = new Date(fec*1000);
    let d1a, m3s : string;

    d1a = dateObject.getDate().toString();
    if (dateObject.getDate()<10){
      d1a = "0"+dateObject.getDate().toString();
    }
    m3s = (dateObject.getMonth()+1).toString();
    if (dateObject.getMonth()+1<10){
      m3s = "0"+(dateObject.getMonth()+1).toString();
    }
    
    this.timeFD = (d1a+"/"+m3s+"/"+dateObject.getFullYear()).toString();

    return dateObject;
   // return new Date(dateObject);
  }//timestampConvert

  selectedchangeCodMat(val,pffield?){
    this.borrarSeleccion();

    //console.log(val.target.value.toString().trim())
    const isLargeNumber = (element) => element.codigodematerial == val.target.value.toString().trim();
    const i = this.gestionaveriasService.averiaslistDet.findIndex(isLargeNumber);

    if (i != -1){
      this.descripcionmaterial = this.gestionaveriasService.averiaslistDet[i].descripcionmaterial;
      this.codigodematerial = this.gestionaveriasService.averiaslistDet[i].codigodematerial;

      this.maxCant =  this.gestionaveriasService.averiaslistDet[i].cantidadmaterial;
      this.preciomaterial =  this.gestionaveriasService.averiaslistDet[i].preciomaterial;
      this.totalpormaterial = this.preciomaterial * this.cantidadmaterial;
    }
    this.renderer.selectRootElement('#cantidadmaterial').focus();
  }// selectedchangeCodMat  

  txtctnchange(cnt){
    let tmat;
    if (cnt.target.value > this.maxCant){
      this.cantidadmaterial = 1;
      tmat = 1 * this.preciomaterial;
      this.totalpormaterial = parseFloat(tmat.toFixed(2));
    }else{
      if (this.preciomaterial != null){
        tmat = cnt.target.value * this.preciomaterial;
        this.totalpormaterial = parseFloat(tmat.toFixed(2));  //.toLocaleString("es-CO");
      }
    }
    
  }//txtctnchange

  txtdescvchange(descv){
    let aux_tmontdv = descv.target.value;

    if (aux_tmontdv == null || typeof aux_tmontdv == undefined || aux_tmontdv.toString() ==""){
         aux_tmontdv=0;
    }

    //Calculo del Impuesto en base al monto bruto
    let montoDescAux=0;
 
  }//txtdescvchange



  agregardetalles(){
    //console.log('Cod Mat: ',this.codigodematerial)
    //console.log('Cant: ',this.cantidadmaterial)
    //console.log('Max Cant: ',this.maxCant)

    this.cntMat = this.cantidadmaterial;
    for (let i in this.gestionaveriasService.matrisDetAveria){
      if (this.gestionaveriasService.matrisDetAveria[i].codigodematerial == this.codigodematerial){
        this.cntMat = this.cntMat + this.gestionaveriasService.matrisDetAveria[i].cantidadmaterial;
      }
    }
    //console.log('Van: ',this.cntMat);


    if(this.cntMat > this.maxCant){
      alert('No puede exceder la cantidad original del pedido');
    }// si cntMat > maxCant
    else{
      this.gestionaveriasService.matrisDetAveria = this.gestionaveriasService.matrisDetAveria.concat({
        idaveria:null,
        uid:'',
        codigodematerial:this.codigodematerial,
        descripcionmaterial:this.descripcionmaterial,
        preciomaterial:this.preciomaterial,
        cantidadmaterial:this.cantidadmaterial,
        totalpormaterial:this.totalpormaterial,
        motivoaveria:this.motivoAve,
        indice:this.gestionaveriasService.matrisDetAveria.length
      });
  
      let totalm: number=0;
      for (let i in this.gestionaveriasService.matrisDetAveria){
       totalm = totalm + this.gestionaveriasService.matrisDetAveria[i].totalpormaterial
      }
      this.gestionaveriasService.averia_.totalaveria = totalm;
      this.gestionaveriasService.averia_.porcentajeReclamo = (this.gestionaveriasService.averia_.totalaveria * 100)/this.gestionaveriasService.averia_.montoOriginal;
      // porcentajeReclamo;
  
      //Calcular totales para la tabla 
      this.gestionaveriasService.totalCnt = this.gestionaveriasService.totalCnt + this.cantidadmaterial;
   
      if (this.gestionaveriasService.matrisDetAveria.length > 0){
        this.gestionaveriasService.mostrardesc = true;
      }else{
        this.gestionaveriasService.mostrardesc = false;
      }
  
      if (this.gestionaveriasService.averia_.totalaveria > 0){
        this.gestionaveriasService.enviar = true;
        this.gestionaveriasService.readonlyField = true;
      }
      this.borrarSeleccion();
    }
    

  }//agregardetalles

  removeDetRow(i){
    //console.log('Total Averia: ',this.gestionaveriasService.averia_.totalaveria.toFixed(2))
    //console.log('i: ',this.gestionaveriasService.matrisDetAveria[i].totalpormaterial)
   this.gestionaveriasService.averia_.totalaveria = parseFloat(this.gestionaveriasService.averia_.totalaveria.toFixed(2));

    this.gestionaveriasService.averia_.totalaveria = this.gestionaveriasService.averia_.totalaveria - this.gestionaveriasService.matrisDetAveria[i].totalpormaterial;
    this.gestionaveriasService.averia_.porcentajeReclamo = (this.gestionaveriasService.averia_.totalaveria * 100)/this.gestionaveriasService.averia_.montoOriginal;
    this.gestionaveriasService.totalCnt = this.gestionaveriasService.totalCnt - this.gestionaveriasService.matrisDetAveria[i].cantidadmaterial;

    //Auxiliar de elementos a eliminar de la db
    this.gestionaveriasService.elementoBorrados.push(this.gestionaveriasService.matrisDetAveria[i]);

    //Eliminando el registro del vector
    i !== -1 && this.gestionaveriasService.matrisDetAveria.splice( i, 1 );

    //console.log(this.gestionaveriasService.matrisDetAveria.length)
    if (this.gestionaveriasService.matrisDetAveria.length > 0){
      this.gestionaveriasService.mostrardesc = true;
    }else{
      this.gestionaveriasService.mostrardesc = false;
    }
//console.log(this.gestionaveriasService.averia_.totalaveria)

    if (this.gestionaveriasService.averia_.totalaveria <= 0){
      if (this.gestionaveriasService.txtBtnAccion != "Actualizar Averia"){
        this.gestionaveriasService.enviar = false;
        this.gestionaveriasService.valorAutCli = "";
        this.gestionaveriasService.readonlyField = false;
      }
    }
    this.borrarSeleccion();

  }//removeDetRow

}//class







