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

import { ElementRef, Renderer2 } from '@angular/core';
import { Stats } from 'src/app/models/stats';
import { AveriaDet } from 'src/app/models/gaveriaDet';
import { FormControl } from '@angular/forms';

import { animate, state,style,transition,trigger } from '@angular/animations';

//  Service 
import { ClientService } from '../../../services/client.service';
import { VendedorService } from '../../../services/vendedor.service';
import { LprecioService } from '../../../services/lprecio.service';
import { CpagoService } from '../../../services/cpago.service';
import { ProductService } from '../../../services/product.service';
import { UmedidaService } from '../../../services/umedida.service';
import { IimpuestoService } from '../../../services/iimpuesto.service';
import { DatoempService } from 'src/app/services/datoemp.service';
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
import { AlertsService } from 'src/app/services/alerts.service';


(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-modificar-averias',
  templateUrl: './modificar-averias.component.html',
  styleUrls: ['./modificar-averias.component.css']
})
export class ModificarAveriasComponent implements OnInit {
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
  public keywordsCli = ['idcliente','descripcion'];
  public keywordVen = "idvendedor";
  valorAutCli: string;
  valorAutVen: string;
  //maxDate:Date;
  maxDate= moment(new Date()).format('YYYY-MM-DD');
  codeBlock ='';
  companyblk ='';
  //minDate = moment(new Date()).format('YYYY-MM-DD');
  start_time = moment(new Date()).format('YYYY-MM-DD');
  timeFD = moment(new Date()).format('DD/MM/YYYY');
  timeFR = moment(new Date()).format('DD/MM/YYYY');
  checkboxState1: boolean;
  checkboxState: boolean[];
  nomCli='';
  rifCli='';
  tlfCli='';
  dirCli='';
  zonVen='';

  algo = "";
  rows = [];
  estado="";
  reject=0;
  bodyData = [];
  observacion='';
  totalArticulos=0;
  spaceBottom=260;

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
    public mrechazoS    : MrechazoService,
    private dialogo     : MatDialog,
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
    public alertsS      : AlertsService,
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

    this.gestionaveriasService.getAveriasA().subscribe(averias=>{
      this.averiaslist = averias;
      
      //ELEMENT_DATA
      this.dataSource = new MatTableDataSource(this.averiaslist);
      this.dataSource.sort = this.sort;
    })

    this.mrechazoS.getMrechazos().valueChanges().subscribe(mrz =>{
      this.mrechazoList = mrz;
    })

    this.gestionaveriasService.mostrarForm2 = false;
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

  }

  async generarpdf(pf?: NgForm){

    this.bodyData = this.gestionaveriasService.matrisDetAveria;

    if (this.gestionaveriasService.averia_.observacion=="" || typeof this.gestionaveriasService.averia_.observacion=="undefined"){
      this.observacion = "";
    }else{
      this.observacion = "Observación: "+this.gestionaveriasService.averia_.observacion;
    }
    this.tlfCli = this.gestionaveriasService.averia_.tlfcliente;
    this.dirCli = this.gestionaveriasService.averia_.clientedir;
    this.zonVen = this.gestionaveriasService.averia_.zonvendedor;
    this.gestionaveriasService.averia_.status = "PROCESADA";

    this.reject=0;
    this.rows = [];

    for (let i in this.gestionaveriasService.matrisDetAveria) {
      let indice:number = parseInt(i);

      if (this.gestionaveriasService.matrisDetAveria[i].aprobado == true){
        this.estado = "ACEPTADO";
      } else {
        this.estado = "RECHAZADO";
        this.reject++;
      }
      this.rows.push([
       this.gestionaveriasService.matrisDetAveria[i].codigodematerial.toString(),
       this.gestionaveriasService.matrisDetAveria[i].descripcionmaterial.toString(),
       this.gestionaveriasService.matrisDetAveria[i].cantidadmaterial.toLocaleString('de-DE', {maximumFractionDigits: 0}), 
       this.gestionaveriasService.matrisDetAveria[i].preciomaterial.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2}), 
       this.gestionaveriasService.matrisDetAveria[i].totalpormaterial.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2}),
       this.gestionaveriasService.matrisDetAveria[i].motivoaveria.toString(),this.estado.toString()]
      );
      this.totalArticulos = indice+1;
      if (this.totalArticulos>1){
        this.spaceBottom=this.spaceBottom-20;
      }
    }

    if (this.reject>=1) {
      this.alertsS.warning(
        "Existen materiales rechazados",
        "¿Está seguro que desea rechazar los materiales?","warning"
        ).then((res) => {
        if (res) {
          this.submit(pf);
        } else {
          return;
        }
      });
    } else {

      this.submit(pf);
    }
    //>
    //abrir el pdf en una nueva pestana
    //pdfMake.createPdf(documentDefinition).open();
  }//Generar pdf make

  submit(pf?: NgForm) {
    let idAven: any;
          var docAdd: string

          if (this.gestionaveriasService.txtBtnAccion.toString() == "Crear Averia"){
            //busca el nro de averia
            idAven = this.gestionaveriasService.getOrderStat2();
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
          let momento = horas_[dateObj.getHours()]; 
          let output = day +'/'+ month + '/' + year; // + ' '+ momento;

          let month2 = monthNames[dateObj2.getMonth()];
          let day2 = String(dateObj2.getDate()).padStart(2, '0');
          let year2 = dateObj2.getFullYear();
          let momento2 = horas_[dateObj2.getHours()]; 
          let output2 = day2 +'/'+ month2 + '/' + year2; // + ' '+ momento2;

          let margin_bottom = 50;
          let y1 = 600;
          let y2 = 630;
          let y3 = 640;

          if (this.rows.length-1 > 17){
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

              { text:'Gestión de Avería ',style: "linecentertitle",fontSize: 16},

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
                            ]
                            ,
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
                        layout: 'lightHorizontalLines', fontSize: 7,// optional
                        table: 
                            {
                            widths: [40, 175, 35, 35, 35,75,50],
                            body: 
                            [
                              [
                                  {text: 'ARTÍCULO',style: "boldtxt", border: [true, true, false, true]}, 
                                  {text: 'DESCRIPCIÓN',style: "boldtxt", border: [false, true, false, true]},
                                  {text: 'CTD',style: "boldtxt", border: [false, true, false, true]},
                                  {text: 'PREC. U',style: "boldtxt", border: [false, true, false, true]},
                                  {text: 'TOTAL',style: "boldtxt", border: [false, true, true, true]},
                                  {text: 'MOTIVO',style: "boldtxt", border: [false, true, true, true]},
                                  {text: 'RESOLUCIÓN',style: "boldtxt", border: [false, true, true, true]},
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
                id: 'detalleTbl',fontSize: 7,
                table: {
                  widths: [45, 175, 35, 35, 35,75,50],
                  body: this.rows,
                },

              },
              //IMPRIME EL DETALLE DE LA MATRIX
              { 
                text: this.observacion,
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
                              {text: this.totalArticulos, border: [false, true, true, false]}
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
                margin:[0,0,0,this.spaceBottom] //change number 6 to increase nspace
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

  }

  aceptarRechazarItems(e,ind){
    let estado_ = false;
    if (e.target.checked){
      estado_ = true;
    }

    for (let i in this.gestionaveriasService.matrisDetAveria){
      //Actualiza los registros 
      if (this.gestionaveriasService.matrisDetAveria[i].indice == ind){
        this.gestionaveriasService.matrisDetAveria[i].aprobado = estado_;
      }
    }
  }

  onSubmit(pf?: NgForm, url?:string,aveNro?:any){
    
    //this.gestionaveriasService.averia_.email = "yhonatandcarruido@gmail.com"; 
    //this.gestionaveriasService.averia_.email = "yhonatandcarruido@gmail.com,ricardoarangures@gmail.com";

    //Nuevo Averia
    if(this.gestionaveriasService.averia_.uid == null)
    { 
      //nada
    }else{ //Actualiza Averia
        this.gestionaveriasService.averia_.modificado = new Date;
        this.gestionaveriasService.averia_.modificadopor = this.loginS.getCurrentUser().email;
        this.gestionaveriasService.averia_.status = "PROCESADA";

        let ahora = new Date();
        this.gestionaveriasService.averia_.fechaaveria = new Date(this.gestionaveriasService.start_time);
        
        //console.log('sssssd ',this.timeFR)
        this.gestionaveriasService.averia_.feresolucion = new Date(this.timeFR);

        this.gestionaveriasService.averia_.fechaaveria.setDate(this.gestionaveriasService.averia_.fechaaveria.getDate()+1);
        this.gestionaveriasService.averia_.fechaaveria.setHours(ahora.getHours());
        this.gestionaveriasService.averia_.fechaaveria.setMinutes(ahora.getMinutes());

        this.gestionaveriasService.averia_.feresolucion.setDate(this.gestionaveriasService.averia_.feresolucion.getDate()+1);
        this.gestionaveriasService.averia_.feresolucion.setHours(ahora.getHours());
        this.gestionaveriasService.averia_.feresolucion.setMinutes(ahora.getMinutes());

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
     
        this.toastr.success('Operación Terminada','Averia Actualizado');
        this.gestionaveriasService.enviar = false;
    }

    pf.resetForm();
    this.gestionaveriasService.readonlyField = false;
    this.gestionaveriasService.averia_ = {} as Averia;  
    this.gestionaveriasService.matrisDetAveria = []; // vacia la instancia
    this.gestionaveriasService.txtBtnAccion = "Crear Averia"; 
    this.gestionaveriasService.mostrarForm2 = false;
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
        this.gestionaveriasService.txtBtnAccion = "Crear Averia"; 
        this.gestionaveriasService.enviar = false;
        this.gestionaveriasService.mostrarForm2 = false;
      }
    }else{
        if(pf != null) pf.reset();
        this.gestionaveriasService.matrisDetAveria = []; // vacia la instancia
        this.gestionaveriasService.elementoBorrados = []; // vacia la instancia
        this.gestionaveriasService.readonlyField = false;
        this.gestionaveriasService.averia_ = {} as Averia; 
        this.gestionaveriasService.txtBtnAccion = "Crear Averia"; 
        this.gestionaveriasService.enviar = false;
        this.gestionaveriasService.mostrarForm2 = false;
    }
  }//resetForm

  borrarSeleccion(){
    this.cantidadmaterial = 0;
    this.maxCant = 0
    this.preciomaterial = 0;
    this.totalpormaterial = 0;
    this.motivoAve = "";
  } 

  selectedFactDoc(txt){
    const value = txt.target.value.toString().trim();
    const text  = txt.target.options[txt.target.options.selectedIndex].text
    let i = value.indexOf( "<>" );
    const uidPed = value.substring(i+2, value.length);

    //Get Order detaills
    this.lpedidoS.getPedidosDet(uidPed).subscribe(pedidosDet=>{
      this.gestionaveriasService.averiaslistDet = pedidosDet;
    })
    
    this.nrodoc = text

    this.borrarSeleccion();
  }

  selectedchangeCodMat(val,pffield?){
    this.borrarSeleccion();
    const isLargeNumber = (element) => element.codigodematerial == val.target.value.toString().trim();
    const i = this.gestionaveriasService.averiaslistDet.findIndex(isLargeNumber);

    if (i != -1){
      this.descripcionmaterial = this.gestionaveriasService.averiaslistDet[i].descripcionmaterial;
      this.codigodematerial = this.gestionaveriasService.averiaslistDet[i].codigodematerial;

      this.maxCant =  this.gestionaveriasService.averiaslistDet[i].cantidadmaterial;
      this.preciomaterial =  this.gestionaveriasService.averiaslistDet[i].preciomaterial;
    }
    this.renderer.selectRootElement('#cantidadmaterial').focus();
  }// selectedchangeCodMat  

  txtctnchange(cnt){
    let tmat;
    if (cnt.target.value > this.maxCant){
      this.cantidadmaterial = 0;
      tmat = 0 * this.preciomaterial;
      this.totalpormaterial = parseFloat(tmat.toFixed(2));
    }else{
      if (this.preciomaterial != null){
        tmat = cnt.target.value * this.preciomaterial;
        this.totalpormaterial = parseFloat(tmat.toFixed(2));  //.toLocaleString("es-CO");
      }
    }   
  }//txtctnchange

  agregardetalles(){ 
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
  }//agregardetalles

  removeDetRow(i){
    this.gestionaveriasService.averia_.totalaveria = this.gestionaveriasService.averia_.totalaveria - this.gestionaveriasService.matrisDetAveria[i].totalpormaterial;
    this.gestionaveriasService.totalCnt = this.gestionaveriasService.totalCnt - this.gestionaveriasService.matrisDetAveria[i].cantidadmaterial;

    //Auxiliar de elementos a eliminar de la db
    this.gestionaveriasService.elementoBorrados.push(this.gestionaveriasService.matrisDetAveria[i]);

    //Eliminando el registro del vector
    i !== -1 && this.gestionaveriasService.matrisDetAveria.splice( i, 1 );

    if (this.gestionaveriasService.matrisDetAveria.length > 0){
      this.gestionaveriasService.mostrardesc = true;
    }else{
      this.gestionaveriasService.mostrardesc = false;
    }

    if (this.gestionaveriasService.averia_.totalaveria <= 0){
      this.gestionaveriasService.enviar = false;
      //this.gestionaveriasService.readonlyField = false;
    }
  }//removeDetRow













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

  timestamp2(fec){
    let dateObject;
    let d1a, m3s : string;

    if (fec){
      dateObject = new Date(fec.seconds*1000);

      d1a = dateObject.getDate().toString();
      if (dateObject.getDate()<10){
        d1a = "0"+dateObject.getDate().toString();
      }
      m3s = (dateObject.getMonth()+1).toString();
      if (dateObject.getMonth()+1<10){
        m3s = "0"+(dateObject.getMonth()+1).toString();
      }      

      return dateObject.getFullYear()+"-"+m3s+"-"+d1a;
    }else{
      dateObject = new Date();
      d1a = dateObject.getDate().toString();
      if (dateObject.getDate()<10){
        d1a = "0"+dateObject.getDate().toString();
      }
      m3s = (dateObject.getMonth()+1).toString();
      if (dateObject.getMonth()+1<10){
        m3s = "0"+(dateObject.getMonth()+1).toString();
      } 
    }

    return dateObject.getFullYear()+"-"+m3s+"-"+d1a;
  }//timestampConvert

  timestamp3(fec){
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

    this.gestionaveriasService.averia_.fechadocumento = dateObject;

    return (d1a+"/"+m3s+"/"+dateObject.getFullYear()).toString();
  }//timestampConvert

  mostrarOcultar(event,pedi){
    this.mostrardiv = true;
    this.pedIndex = pedi;
    this.idaveriaEli = this.averiaslist[this.pedIndex].idaveria;
    this.fechaaveriaEli = this.averiaslist[this.pedIndex].fechaaveria;
    this.clienteaveriaEli = this.averiaslist[this.pedIndex].nomcliente;
    this.gestionaveriasService.mostrarForm2=false;
  }
  
  onCancelar(pf?: NgForm){
    if(pf != null) pf.reset();
    this.idaveriaEli = "";
    this.clienteaveriaEli = "";
    this.mostrardiv = false;
  }

  onDelete(event){
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
    //this.checkboxState = false;

    if (ave.status.toUpperCase() == 'ABIERTA'){
        this.gestionaveriasService.mostrarForm2 = true;
        this.gestionaveriasService.txtBtnAccion = "Actualizar Averia";
        this.gestionaveriasService.readonlyField = true;

        this.gestionaveriasService.valorAutCli = ave.nomcliente;
        this.gestionaveriasService.start_time = this.timestamp2(ave.fechaaveria).toString();
        this.timeFR = this.timestamp2(ave.feresolucion).toString();

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
        this.gestionaveriasService.averia_.fechadocumento = ave.fechadocumento;

        this.timestampConvert(ave.fechaaveria);
        this.timeFD = this.timestamp3(ave.fechadocumento);

        this.gestionaveriasService.nomCli = this.gestionaveriasService.averia_.nomcliente;
        this.gestionaveriasService.rifCli = this.gestionaveriasService.averia_.idcliente;   
        this.gestionaveriasService.nomrifCli = this.gestionaveriasService.rifCli + " - "+ this.gestionaveriasService.nomCli;

        //Get Order detaills
        this.gestionaveriasService.getAveriasDet(ave.uid).subscribe(averiasDet=>{
            this.AvelistDet = averiasDet;
            this.gestionaveriasService.matrisDetAveria = this.AvelistDet;
            this.gestionaveriasService.totalCnt = 0;
            for (let i in this.gestionaveriasService.matrisDetAveria){
              this.gestionaveriasService.totalPri = this.gestionaveriasService.totalPri +  this.gestionaveriasService.matrisDetAveria[i].preciomaterial;
              this.gestionaveriasService.totalCnt = this.gestionaveriasService.totalCnt +  this.gestionaveriasService.matrisDetAveria[i].cantidadmaterial;
              this.gestionaveriasService.totalAve = this.gestionaveriasService.totalAve +  this.gestionaveriasService.matrisDetAveria[i].totalpormaterial;
            
              if (this.gestionaveriasService.matrisDetAveria[i].aprobado == true){
                //this.checkboxState[i] = true;
              }
              if (this.gestionaveriasService.matrisDetAveria[i].aprobado == false){
                //this.checkboxState[i] = false;
              }
            }

            this.gestionaveriasService.enviar=true;
        }) 
        
        // //Get Order detaills
        // const value = this.gestionaveriasService.averia_.nrodocUID.toString().trim();
        // this.lpedidoS.getPedidosDet(value).subscribe(pedidosDet=>{
        //   this.gestionaveriasService.averiaslistDet = pedidosDet;
        // })



    } //Si status es ABIERTA

  }//onEdit

  moForm(){
    if (this.gestionaveriasService.mostrarForm2){
      this.gestionaveriasService.mostrarForm2 = false;
    }else{
      this.gestionaveriasService.mostrarForm2 = true;
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
    this.timeFR = moment(new Date()).format('YYYY-MM-DD');

    this.gestionaveriasService.txtBtnAccion = "Crear Averia";
 
  }//moForm

  verdetalles(event, ave){
    const dialogConfig = new MatDialogConfig;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "100%"
    dialogConfig.width = "95%";
    dialogConfig.height = "95%"
    this.gestionaveriasService.pestana = "MA";
    this.averiaVer_ =  Object.assign({}, ave);
  
    dialogConfig.data = {
      averiaShow: Object.assign({}, this.averiaVer_)
    };
  
    this.dialogo.open(AveriaShowComponent,dialogConfig);
  }
}
