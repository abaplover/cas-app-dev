import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Cobro } from '../models/cobro';
import { CobroDet } from '../models/cobro-det';
import { PedidoDet } from '../models/pedidoDet';
import { Action } from 'rxjs/internal/scheduler/Action';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";

import { Pedido } from '../models/pedido';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { DatoempService } from './datoemp.service';


@Injectable({
  providedIn: 'root'
})
export class CobrosService {
  selectedIndex = 0;
  docAdd: number = -1; //id del elemento
  mostrarForm: boolean = false;
  today = moment().toDate();

  itemsCollection: AngularFirestoreCollection<CobroDet>;
  items: Observable<CobroDet[]>;
  itemDoc: AngularFirestoreDocument<CobroDet>;

  cobros: Observable<Cobro[]>;
  cobroDoc: AngularFirestoreDocument<Cobro>;
  cobrosColletion: AngularFirestoreCollection<Cobro>;

  cobrosPagados: Observable<Cobro[]>;
  cobrosPagadosDoc: AngularFirestoreDocument<Cobro>;
  cobrosPagadosColletion: AngularFirestoreCollection<Cobro>;

  cobrosP: Observable<Cobro[]>;
  cobroDocE: AngularFirestoreDocument<Cobro>;
  cobrosColletionE: AngularFirestoreCollection<Cobro>;

  cobrosC: Observable<Cobro[]>;
  cobroDocC: AngularFirestoreDocument<Cobro>;
  cobrosColletionC: AngularFirestoreCollection<Cobro>;

  cobrosV: Observable<Cobro[]>;
  cobroDocV: AngularFirestoreDocument<Cobro>;
  cobrosColletionV: AngularFirestoreCollection<Cobro>;

  cobrosDet: Observable<Cobro[]>;
  cobroDetDoc: AngularFirestoreDocument<Cobro>;
  cobrosDetColletion: AngularFirestoreCollection<Cobro>;

  cobrosrep: Observable<Cobro[]>;
  cobroDocrep: AngularFirestoreDocument<Cobro>;
  cobrosColletionrep: AngularFirestoreCollection<Cobro>;

  cobrosdetrep: Observable<Cobro[]>;
  cobrosdetDocrep: AngularFirestoreDocument<Cobro>;
  cobrosdetColletionrep: AngularFirestoreCollection<Cobro>;

  public URLPublica: any;

  constructor(public db: AngularFirestore,
    private afStorage: AngularFireStorage,
    private datoEmpresaS: DatoempService,) {

    //Busca todos los cobros
    this.cobrosColletion = this.db.collection('cobros', ref => ref.where("status", 'in', ['ACTIVO', 'FACTURADO', 'DESPACHADO', 'ENTREGADO', 'ELIMINADO']).orderBy("creado", "desc").limit(50));
    this.cobros = this.cobrosColletion.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Cobro;
        //data.uid = a.payload.doc.id;
        return data;
      })
    }));

    //Busca todos los cobros pagados en los ultimos 14 dias
    let dateFrom = new Date(moment().subtract(14, 'd').format('YYYY-MM-DD'));

    this.cobrosPagadosColletion = this.db.collection('cobros', ref => ref.where("tipopago", 'in', ['PARCIAL', 'TOTAL']).where("status", '==', "ACTIVO").where("fechadepago", '>=', dateFrom).orderBy("fechadepago", "desc").limit(5000));
    this.cobrosPagados = this.cobrosPagadosColletion.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Cobro;
        return data;
      })
    }));

    //Busca todos los cobros con estatus - PENDIENTE ypedido ENTREGADO
    this.cobrosColletionE = this.db.collection('cobros', ref =>
      ref.where("statuscobro", 'in', ['PENDIENTE', 'PARCIAL'])
        .where("fpvencimiento", ">", this.today)
        .orderBy("fpvencimiento", "desc")
    );
    this.cobrosP = this.cobrosColletionE.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Cobro;
        //data.uid = a.payload.doc.id;
        return data;
      })
    }));


    //Busca todos los cobros con estatus - CERRADO
    this.cobrosColletionC = this.db.collection('cobros', ref => ref.where("statuscobro", 'in', ['CERRADA']).orderBy("creado", "desc").limit(50));
    this.cobrosC = this.cobrosColletionC.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Cobro;
        //data.uid = a.payload.doc.id;
        return data;
      })
    }));

    //Busca todos los cobros con estatus - VENCIDO
    let hoy = new Date();
    this.cobrosColletionV = this.db.collection('cobros', ref => ref.where("fpvencimiento", "<", hoy).where("status", "==", "ENTREGADO").where("condiciondepago", "in", ["Crédito 7 días", "Crédito 15 días", "Crédito 10 días", "Contado"]).orderBy("fpvencimiento", "desc").orderBy("creado", "desc").limit(50));
    this.cobrosV = this.cobrosColletionV.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Cobro;
        //data.uid = a.payload.doc.id;
        return data;
      })
    }));


    this.cobrosDetColletion = this.db.collection('cobros');
    this.cobrosDet = this.cobrosDetColletion.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Cobro;
        //data.uid = a.payload.doc.id;
        return data;
      })
    }));

  } //Constructor

  getCobrosP() {
    return this.cobrosP;
  }
  getCobrosC() {
    return this.cobrosC;
  }
  getCobrosV() {
    return this.cobrosV;
  }

  addCobros(cob: Cobro, cobNro?: number) {
    //ID del documento geerado por firebase, es diferente al uid del pedido correlativo
    //cob.idpedido = cobNro;

    //ped.uid=pedNro; /*ID Correlativo para el pedido */
    const db = firebase.firestore();
    const ref = db.collection('cobros').doc(); /*Referencia de la coleccion*/
    const id = ref.id; /*ID Autogenerado*/
    this.docAdd = cobNro; /*Guardamos el Id Para los detalles del pedido*/
    cob.uid = id;
    /* Guardamos el documento en la coleccion */

    ref.set(cob).then(docRef => {
      console.log("Elemento Creado: ", this.docAdd);
    }).catch(function (error) {
      console.error("Error al crear elemento: ", error);
    });
  }//addCobros

  updatecobros(cobro: Cobro) {
    console.log('uid: ', cobro.uid, cobro);
    this.cobroDoc = this.db.doc(`cobros/${cobro.uid}`);
    this.cobroDoc.update(cobro);
  }

  addCobrosDet(cod: CobroDet) {


    const db = firebase.firestore();
    const ref = db.collection('cobrosDet').doc(); /*Referencia de la coleccion*/
    const id = ref.id; /*ID Autogenerado*/

    cod.docid = id;
    /* Guardamos el documento en la coleccion */

    ref.set(cod).then(docRef => {
      console.log("Elemento Creado: ", id);
    }).catch(function (error) {
      console.error("Error al crear elemento: ", error);
    });

  }


  deleteCobrosDet(docid: string) {
    this.db.collection("cobrosDet").doc(docid).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  /* getCobrosDet(uid){
    //Busca todos los detalles de cobros (cobros registrados)
    this.itemsCollection = this.db.collection('cobrosDet', ref => ref.where("uid", "==", uid));
    this.cobrosDet = this.itemsCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as CobroDet;
        //data.uid = a.payload.doc.id;
        return data;
      })
    }));
    return this.cobrosDet;
  }//getPedidosDet */

  getCobrosDet(idpedido) {
    //Busca todos los detalles de cobros (cobros registrados)
    this.itemsCollection = this.db.collection('cobros', ref => ref.where("idpedido", "==", idpedido).orderBy("fechadepago", "asc"));
    this.cobrosDet = this.itemsCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Cobro;
        return data;
      })
    }));
    return this.cobrosDet;
  }//getPedidosDet

  getCobrosRep01(strq) {
    console.log("cobrosS ", strq);
    this.cobrosColletionrep = this.db.collection("cobros", strq);
    this.cobrosrep = this.cobrosColletionrep.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Cobro;
        return data;
      })
    }));
    return this.cobrosrep;
  }//getCobrosRep

  getCobrosRep02(queryCobrosDet) {
    this.cobrosdetColletionrep = this.db.collection('cobros');
    this.cobrosdetrep = this.cobrosdetColletionrep.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Cobro;
        return data;
      })
    }));

    return this.cobrosdetrep;
  }//getAveriasRep02


  async generarReciboCobro(pedido: Pedido, pedidoDet: PedidoDet[], cobro: any) {

    console.log(cobro);
    var bodyData = [];
    let observacion = '';
    // let datosEmpresa;
    let totalArticulos = 0;
    let spaceBottom = 260;

    bodyData = pedidoDet;
    //console.log(bodyData);
    var algo = "";
    var rows = [];
    rows.push(['', '', '', '', '']);

    let datosEmpresa = await new Promise<any>((resolve) => {
      this.datoEmpresaS.getDatoemps().valueChanges().subscribe(datos => resolve(datos));
    });

    for (let i in pedidoDet) {
      let indice: number = parseInt(i);
      rows.push([pedidoDet[i].codigodematerial.toString(), pedidoDet[i].descripcionmaterial.toString(), pedidoDet[i].cantidadmaterial.toLocaleString('de-DE', { maximumFractionDigits: 0 }), pedidoDet[i].preciomaterial.toLocaleString('de-DE', { maximumFractionDigits: 2, minimumFractionDigits: 2 }), pedidoDet[i].totalpormaterial.toLocaleString('de-DE', { maximumFractionDigits: 2, minimumFractionDigits: 2 })]);
      totalArticulos = indice + 1;
      if (totalArticulos > 1) {
        spaceBottom = spaceBottom - 20;
      }
    }
    let totalMonto = pedidoDet.reduce((prev, curr) => prev + curr.totalpormaterial, 0)
    let totalCantidad = pedidoDet.reduce((prev, curr) => prev + curr.cantidadmaterial, 0);
    // let totalArticulos = pedidoDet.length;

    const monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    let dateObj = moment(pedido.fechapedido).toDate(); //Toma la fecha del formulario
    let min_ = new Date().getMinutes();

    var horas_ = new Array();
    horas_[0] = "12:" + min_ + " AM";
    horas_[23] = "11:" + min_ + " PM";
    horas_[22] = "10:" + min_ + " PM";
    horas_[21] = "09:" + min_ + " PM";
    horas_[20] = "08:" + min_ + " PM";
    horas_[19] = "07:" + min_ + " PM";
    horas_[18] = "06:" + min_ + " PM";
    horas_[17] = "05:" + min_ + " PM";
    horas_[16] = "04:" + min_ + " PM";
    horas_[15] = "03:" + min_ + " PM";
    horas_[14] = "02:" + min_ + " PM";
    horas_[13] = "01:" + min_ + " PM";
    horas_[12] = "12:" + min_ + " PM";
    horas_[11] = "11:" + min_ + " AM";
    horas_[10] = "10:" + min_ + " AM";
    horas_[9] = "09:" + min_ + " AM";
    horas_[8] = "08:" + min_ + " AM";
    horas_[7] = "07:" + min_ + " AM";
    horas_[6] = "06:" + min_ + " AM";
    horas_[5] = "05:" + min_ + " AM";
    horas_[4] = "04:" + min_ + " AM";
    horas_[3] = "03:" + min_ + " AM";
    horas_[2] = "02:" + min_ + " AM";
    horas_[1] = "01:" + min_ + " AM";

    let month = monthNames[dateObj.getMonth()];
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let momento = horas_[new Date().getHours()];
    let output = day + '/' + month + '/' + year + ' ' + momento;
    let margin_bottom = 50;
    let y1 = 600;
    let y2 = 630;
    let y3 = 640;

    if (rows.length - 1 > 17) {
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
      pageMargins: [25, 30, 25, margin_bottom],

      content: [

        {
          columns: [
            {
              width: 150,
              image: datosEmpresa[0].imglogob64,
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
                      { text: datosEmpresa[0].descripcion, style: "boldtxt", alignment: 'center', fontSize: 12, border: [false, false, false, false] },
                    ],
                    [
                      { text: datosEmpresa[0].direccion, fontSize: 10, border: [false, false, false, false] },
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
                widths: [40, '*'],
                body:
                  [
                    [
                      { text: 'Teléfono', style: "boldtxt", fontSize: 10, border: [false, false, false, false] },
                      { text: datosEmpresa[0].telefonoFijo, fontSize: 10, border: [false, false, false, false] },
                    ],
                    [
                      { text: 'Celular', style: "boldtxt", fontSize: 10, border: [false, false, false, false] },
                      { text: datosEmpresa[0].telefonocel1, fontSize: 10, border: [false, false, false, false] },
                    ],
                    [
                      { text: 'Email:', style: "boldtxt", fontSize: 10, border: [false, false, false, false] },
                      { text: datosEmpresa[0].email, fontSize: 9, border: [false, false, false, false] },
                    ]
                  ]
              }

            }
          ],
        },

        { text: 'Recibo de Cobro ', style: "linecentertitle", fontSize: 16 },
        { text: `Estimado cliente ${pedido.nomcliente}), le informamos que hemos recibido el día ${cobro.fechadepago} un pago que se detalla con la siguiente información:`, fontSize: 12 },
        { text: ' ', style: "SpacingFull", fontSize: 1 },
        { //dos columnas, en cada se define una tabla
          columns:
            [
              {
                width: 285,
                table:
                {
                  widths: [100, 175],
                  body: [
                    [
                      { text: 'N° Documento:', style: "boldtxt", border: [true, true, false, false] },
                      { text: pedido.nrofactura, border: [false, true, true, false] }
                    ],
                    [
                      { text: 'Vendedor:', style: "boldtxt", border: [true, false, false, false] },
                      { text: pedido.nomvendedor, border: [false, false, true, false] }
                    ],
                    [
                      { text: 'Monto del pago:', style: "boldtxt", border: [true, false, false, false] },
                      { text: cobro.moneda == 'USD' ? cobro.montodepago : cobro.montobsf, border: [false, false, true, false] }
                    ],
                    [
                      { text: 'Moneda:', style: "boldtxt", border: [true, false, false, false] },
                      { text: cobro.moneda, border: [false, false, true, false] }
                    ],
                    [
                      { text: 'Vía de Pago:', style: "boldtxt", border: [true, false, false, true] },
                      { text: cobro.viadepago, border: [false, false, true, true] }
                    ]
                  ]
                }
              }
            ],
          // optional space between columns
          columnGap: 10
        },

        //solo espaciado
        { text: ' ', style: "SpacingFull", fontSize: 16 },

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
                            { text: 'ARTÍCULO', style: "boldtxt", border: [true, true, false, true] },
                            { text: 'DESCRIPCIÓN', style: "boldtxt", border: [false, true, false, true] },
                            { text: 'CTD', style: "boldtxt", border: [false, true, false, true] },
                            { text: 'PRECIO U', style: "boldtxt", border: [false, true, false, true] },
                            { text: 'TOTAL', style: "boldtxt", border: [false, true, true, true] },
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


        {
          text: observacion,
          id: "observacion",
          style: "lineSpacing",
          fontSize: 10,
          dontBreakRows: true,
          absolutePosition: { x: 25, y: y1 }
        },

        

        { text: ' ', style: "lineSpacing", fontSize: 10, absolutePosition: { x: 25, y: y2 } },
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
                        {text: totalCantidad.toLocaleString('de-DE', {maximumFractionDigits: 0}), border: [false, false, true, true]}
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
                          {text: totalMonto.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2}), alignment: 'left' , border: [false, true, true, false]}
                      ],
                      [
                          {text: 'Descuento:',style: "boldtxt", border: [true, false, false, false]},
                          {text: '0.00', alignment: 'left', border: [false, false, true, false]}
                      ],
                      [
                          {text: 'Total a pagar:',style: "boldtxt", border: [true, false, false, true]},
                          {text: totalMonto.toLocaleString('de-DE', {maximumFractionDigits: 2,minimumFractionDigits:2}), alignment: 'left', border: [false, false, true, true]}
                      ]
                    ]
                }
            }
          ],absolutePosition:{x:25, y:y3}
        }

        //va en el pie de la pagina pero no como footer

      ],
      defaultStyle: {
        fontSize: 10
      },
      pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        //check if signature part is completely on the last page, add pagebreak if not
        // if (currentNode.id === 'observacion' && rows.length-1 > 17 && rows.length-1 < 24) {
        //   return true;
        // }
        return false;
      }
      ,

      styles: {
        'linecentertitle': {
          margin: [190, 30, 0, 30] //change number 6 to increase nspace
        },
        'lineSpacing': {
          margin: [0, 0, 0, 10] //change number 6 to increase nspace
        },
        'SpacingFull': {
          margin: [0, 0, 0, 30] //change number 6 to increase nspace
        },
        'SpacingFull2': {
          margin: [0, 0, 0, 60] //change number 6 to increase nspace
        },
        'SpacingFullxl': {
          margin: [0, 0, 0, spaceBottom] //change number 6 to increase nspace
        },
        'boldtxt': {
          bold: true
        }
      }
    }; //documentDefinition

    //si se va a generar en string base64
   

    
    return documentDefinition;

    //>



    //pdfMake.createPdf(documentDefinition).open();


  }//pdf make


}
