import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { TransportePedidos } from '../models/transporte-pedidos';
import { PedidoService } from './pedido.service';
import * as firebase from 'firebase';
import { Observable, BehaviorSubject, forkJoin, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pedido } from '../models/pedido';
import * as pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"; // fonts provided for pdfmake
import { AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';

//Services
import { DatoempService } from './datoemp.service';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class TransportePedidosService {
  private dbPath = "transportePedidos";
  private countPath = "--stats--";
  totalBultos = 0;
  mostrarForm: boolean = false;
  txtBtnAccion: string = "";

  transportePedidosRef: AngularFirestoreCollection<TransportePedidos>;
  tranportePedidosCountRef: AngularFirestoreCollection<any>;
  transportesActivosRef: AngularFirestoreCollection<TransportePedidos>;
  transportesCerradosRef: AngularFirestoreCollection<TransportePedidos>;

  dataList: AngularFireList<TransportePedidos>;
  transportePedidosActivos: Observable<TransportePedidos[]>;
  transportePedidosCerrados: Observable<TransportePedidos[]>;

  constructor(
    private db: AngularFirestore,
    private PedidoS: PedidoService,
    private datoEmpresaS: DatoempService,
    private clienteS: ClientService
  ) {
    this.transportePedidosRef = db.collection(this.dbPath);
    this.tranportePedidosCountRef = db.collection(this.countPath);
    this.transportesActivosRef = db.collection(this.dbPath, ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      query = query.where('estatus', '==', 'ACTIVO');
      return query;
    });
    this.transportesCerradosRef = db.collection(this.dbPath, ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      query = query.where('estatus', '==', 'CERRADO');
      return query;
    });

    this.transportePedidosActivos = this.transportesActivosRef.snapshotChanges().pipe(map(changes => {
      return changes.map(results => {
        const data = results.payload.doc.data() as TransportePedidos;
        return data;
      })
    }))

    this.transportePedidosCerrados = this.transportesCerradosRef.snapshotChanges().pipe(map(changes => {
      return changes.map(results => {
        const data = results.payload.doc.data() as TransportePedidos;
        return data;
      })
    }))

  }

  getAll() {
    return this.transportePedidosActivos;
  }

  getOne(id) {
    return new Promise<any>((resolve) => {
      this.transportesActivosRef.doc(`${id}`).valueChanges().subscribe(transporte => resolve(transporte))
    });
  }

  getClosed() {
    return this.transportePedidosCerrados;
  }

  create(transportePedidos: TransportePedidos, pedidos): any {

    const key = transportePedidos.id;
    this.transportePedidosRef.doc(`${transportePedidos.id}`).set({ ...transportePedidos });
    this.transportePedidosRef.doc(this.countPath).update({
      order: firebase.firestore.FieldValue.increment(1)
    });
    this.UpdatePedidos(pedidos, transportePedidos.id);
  }

  update(id: string, transportePedidos: TransportePedidos): Promise<void> {
    return this.transportePedidosRef.doc(`${id}`).update(transportePedidos);
  }

  delete(id: string, transportePedidos): Promise<void> {
    this.UpdatePedidos(transportePedidos, '');
    return this.transportePedidosRef.doc(`${id}`).delete();
  }
  getNextId() {
    return new Promise<any>((resolve) => {
      this.transportePedidosRef.doc(this.countPath).valueChanges().subscribe(count => resolve(count))
    });
  }

  UpdatePedidos(Pedidos, transporteId) {
    if (Pedidos.length > 0)
      Pedidos.map((pedido) => {

        this.UpdatePedido(pedido, transporteId);
      });
  }
  UpdatePedido(Pedido, transporteId) {
    Pedido.transporteId = transporteId;
    this.PedidoS.updatePedidos(Pedido);
  }

  async CheckPedidoRef(pedido, transporte) {

    let pedido_ = await this.PedidoS.getPedidoById(pedido.idpedido);
    if (!pedido_[0].transporteId || pedido_[0].transporteId != transporte.id)
      return false; //Pedido no esta referenciado al transporte

    if (pedido_[0].transporteId == transporte.id)
      return true;
  }

  async updatePedidoTransporte(pedido: Pedido, transporteId) {
    let transporte = await this.getOne(transporteId);
    const PedidoIndex = transporte.pedido.findIndex(ped => ped.idpedido == pedido.idpedido);
    transporte[PedidoIndex] = pedido;
    this.update(transporteId, transporte);

  }

  async generarImpresionPdf(transportePedido: TransportePedidos, pedidoDetails) {

    //['FACT. N', 'MONTO', 'CLIENTE', 'R.I.F', 'FLETE DESTINO', 'FLETE ORIGEN', 'CIUDAD DESTINO', 'BULTOS'],
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BsF',
    
      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    const fechaTransporte = new Date(transportePedido.fecha);
    const bultos = await pedidoDetails.reduce((prev, curr) => prev + curr.nrobultos, 0);

    let datosEmpresa = await new Promise<any>((resolve) => {
      this.datoEmpresaS.getDatoemps().valueChanges().subscribe(datos => resolve(datos));
    });

    let clienteInfo = await new Promise<any>((resolve) => {
      this.clienteS.getClients().valueChanges().subscribe(cliente => resolve(cliente));
    })

    var ticketDefinition = {
      pageOrientation: 'landscape',
      footer: function(currentPage, pageCount) {
        if(currentPage == pageCount)
        return {columns: [
          // 'Left part',
          { text: 'Por el Cliente:____________________________________________', alignment: 'center', bold: true },
          { text: 'Por IMPORTADORA RICAMAR, C.A.:________________________', alignment: 'justify', bold: true },
        ]}

      },
      content: [
        {
          columns: [
            {
              width: 150,
              image: datosEmpresa[0].imglogob64,
              height: 25,
              margin: [0, 10, 0, 0]
            },
            {
              table: {
                style: {
                  fontSize: 5,
                  margin: [50, 0, 0, 0],
                },
                body: [
                  [
                    {
                      text: datosEmpresa[0].direccion, fontSize: 8, alignment: 'center'
                    }
                  ]
                ]
              },
              margin: [50, 0, 0, 0],
              width: 300,
            },
            { stack: [
              {text: 'GUIA DE CARGA', alignment: 'center', bold: true, fontSize: 12},
              {text: `N° ${transportePedido.id}`,alignment:'center', bold: true, fontSize: 11} 
            ]},

          ], columnGap: 10
        },
        { margin: [0, 0, 0, 5], 
          padding: [10, 20], 
          text: `${datosEmpresa[0].rif[0]}-${datosEmpresa[0].rif.substring(1, datosEmpresa[0].rif.length)}`, 
          fontSize: 10, 
          bold: true },
        {
          width: 900,
          table: {
            fontSize: 10,
            style: {
              fontSize: 10
            },
            body: [
              [{ text: `Ciudad: ${datosEmpresa[0].ciudad}`, fontSize: 10, colSpan: 2, bold:true },
              { text: '' },
              { text: `Fecha: ${fechaTransporte.toLocaleDateString('en-GB')}`, fontSize: 10, colSpan: 2, bold:true },
              { text: '' },
              { text: 'Representante: ' + datosEmpresa[0].representante, fontSize: 10, colSpan: 2, bold:true },
              { text: '' },
              { text: 'C.I. ' + datosEmpresa[0].cedula, fontSize: 10, colSpan: 2, bold:true },
              { text: 'C.I', },
              ],
              [
                { text: 'Nombre de la empresa: ' + datosEmpresa[0].descripcion, fontSize: 10, colSpan: 8, bold: true }
              ],
              [
                { text: 'Vehiculo: ' + transportePedido.vehiculo, fontSize: 10, colSpan: 2, bold:true }, { text: 'Disappear' },
                { text: 'Placa N°: ' + transportePedido.placa, fontSize: 10, colSpan: 2, bold:true }, { text: 'Disappear' },
                { text: 'Chofer: ' + transportePedido.chofer, fontSize: 10, colSpan: 2, bold:true }, { text: 'Disappear' },
                { text: `C.I. ${transportePedido.cedula}`, colSpan: 2 }, { text: 'Disappear' }
              ],
              [
                {
                  table: {
                    style: {
                      fontSize: 10
                    },
                    widths: [50, '*', 180, '*', 50, 40, 100, 40],
                    body: [
                      [{ text: 'FACT. N°', style: { fontSize: 11, bold: true } },
                      { text: 'MONTO', style: { fontSize: 11, bold: true } },
                      { text: 'CLIENTE', style: { fontSize: 11, bold: true, width: 200 } },
                      { text: 'R.I.F', style: { fontSize: 11, bold: true } },
                      { text: 'FLETE DESTINO', style: { fontSize: 8, bold: true } },
                      { text: 'FLETE ORIGEN', style: { fontSize: 8, bold: true } },
                      { text: 'CIUDAD DESTINO', style: { fontSize: 11, bold: true } },
                      { text: 'BULTOS', style: { fontSize: 11, bold: true } }]
                    ]
                  },
                  colSpan: 8
                }
              ]
            ]
          }
        },
      ],
    };
    let spaceBottom = 260;
    // let totalBultos = 0;

    pedidoDetails.forEach(pedido => {
      this.totalBultos = this.totalBultos + pedido.nrobultos;

      let clienteDetalle = clienteInfo.find(cliente => cliente.idcliente == pedido.idcliente);
      
      ticketDefinition.content[2].table.body[3][0]['table'].body.push([
        pedido.nrofactura,
        formatter.format((pedido.totalmontobrutoBsf)),
        pedido.nomcliente,
        `${clienteDetalle.rif[0]}-${clienteDetalle.rif.substring(1, clienteDetalle.rif.length)}`,
        '',
        '',
        clienteDetalle.zona,
        pedido.nrobultos
      ])

    });
    ticketDefinition.content[2].table.body[3][0]['table'].body.push([
      {
        margin:[0,0,25,0],text: 'TOTAL: ' + bultos, alignment: 'right', colSpan: 8, bold: true,
        decoration:'underline'
      }
    ]);

    const pdfDocGenerator0 = pdfMake.createPdf(ticketDefinition).open();

    // pdfDocGenerator0.getBase64((data) => {
    //   var file = data;

    //const id = 'Order-'+ Math.random().toString(36).substring(2)+Date.now()+'.pdf';

    //  const fileName = `Etiquetas pedido N° ${docAdd}`;




    //  });//pdfDocGenerator
  }
}
