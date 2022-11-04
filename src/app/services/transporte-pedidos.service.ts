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

@Injectable({
  providedIn: 'root'
})
export class TransportePedidosService {
  private dbPath = "transportePedidos";
  private countPath = "--stats--";
  mostrarForm: boolean = false;
  txtBtnAccion: string = "";

  transportePedidosRef: AngularFirestoreCollection<TransportePedidos>;
  tranportePedidosCountRef: AngularFirestoreCollection<any>;
  transportesActivosRef: AngularFirestoreCollection<TransportePedidos>;
  transportesCerradosRef: AngularFirestoreCollection<TransportePedidos>;

  dataList: AngularFireList<TransportePedidos>;
  transportePedidosActivos: Observable<TransportePedidos[]>;
  transportePedidosCerrados: Observable<TransportePedidos[]>;

  constructor(private db: AngularFirestore, private PedidoS: PedidoService) {
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

  async generarEtiquetas(transportePedido, pedidoDetails) {

  
    var ticketDefinition;
    let spaceBottom=260;
  
    //for (let i = 1; i<=numeroBultos;i++) {
      ticketDefinition = {
        pageSize: {
          width: 460, //Pixeles 
          height: 288
        },
        pageMargins: [ 20, 15, 20, 10 ],
    
        footer: {
    
              columns:
              [
                { //columna 0
                  width: 25,
                  text:''
                },
              ],
    
        },
        content: [],
        defaultStyle: {
          fontSize: 10
        },
        styles:{
          'linecentertitle': {
              margin:[190,30,0,30] //change number 6 to increase nspace
          },
          'centerText': {
            margin:[0,0,0,0],
            alignment: "justify"
          },
          'lineSpacing': {
            margin:[0,0,0,0] //change number 6 to increase nspace
          },
          'minSpacing': {
            margin:[0,0,0,0.5] //change number 6 to increase nspace
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
          },
          'numerosEtiquetas':{
            bold: true,
            fontSize: 34        
          },
          'righttxt':{
            alignment:'right',
            fontSize: 10
          }
        }
      };
    //}
  
    // for (let i = 1; i<=numeroBultos; i++) {
    //   ticketDefinition.content.push(
    //     {
    //       columns: [
    //         {
    //           width: 100,
    //           image: this.dempresaList[0].imglogob64,
    //           height: 15,
    //         },
    //         {
    //           width: 360,
    //           text: this.today,style: "boldtxt", alignment: 'left', fontSize: 10,margin:[268,0,0,0],
    //         }
    //       ],
    //     },
    //     //Datos de la empresa
    //     {text: this.dempresaList[0].descripcion,style: "boldtxt", alignment: 'left', fontSize: 12,border: [false, false, false, false]},
    //     {text: this.dempresaList[0].rif,style: "boldtxt", alignment: 'left', fontSize: 12,border: [false, false, false, false]},
  
    //     {
    //       columns:
    //       [
    //         { //Columna en blanco para alinear texto
    //           width: 165,
    //           text: '',
    //           height: 5,
    //         },
    //         //Datos del cliente
    //         {
    //             width: 245,
    //             table:
    //             {
    //                 widths: [245, 135],
    //                 body: [
    //                   [
    //                     {text: 'Cliente: '+nombreCliente, style:"righttxt", border: [false, false, false, false]},
    //                   ],
    //                   [
    //                     {text: 'Dirección: '+dirCliente, style:"righttxt", border: [false, false, false, false]},
    //                   ],
    //                 ]
    //               }
    //         }
    //       ],
    //       // optional space between columns
    //       columnGap: 5
    //     },
  
    //     //Esta es la linea superior
    //     {
    //       table : {
    //           headerRows : 1,
    //           widths: [420],
    //           body : [
    //                   [''],
    //                   ['']
    //                   ]
    //       },
    //       layout : 'headerLineOnly'
    //     },
  
    //     //Detalle de pedido y numero de eqitueta
    //     {
    //       columns:
    //       [
    //         {
    //           width: 200,
    //           table:
    //           {
    //               widths: [200, 135],       
    //               body: [
    //                 [
    //                   {text: 'N° Pedido: '+docAdd, fontSize: 10,border: [false, false, false, false],margin:[-6,0,0,0]},
    //                 ],
    //                 [
    //                   {text: 'N° Factura/Not: '+pedidoNrofactura, fontSize: 10, border: [false, false, false, false],margin:[-6,0,0,0]},
    //                 ],
    //               ]
    //             }
    //         },
    //         //Datos del cliente
    //         {
    //             width: 200,          
    //             table:
    //             {
    //                 widths: [190, 135],
    //                 body: [
    //                   [
    //                     {text: i+' / '+ numeroBultos, style:"numerosEtiquetas", border: [false, false, false, false]},
    //                   ],
    //                 ]
    //               }
    //         }
    //       ],
    //       // optional space between columns
    //       columnGap: 5
    //     },
  
    //     { text:'Esta etiqueta representa un precinto de seguridad. No recibir si se encuentra violentado y contactar a su asesor comercial o directamente a la empresa.',style: "centerText",fontSize: 10,border: [true, false, true, false]},
  
    //     //Esta es la linea inferior
    //     {
    //       table : {
    //           headerRows : 1,
    //           widths: [420],
    //           body : [
    //                   [''],
    //                   ['']
    //                   ],
    //       },
    //       layout : 'headerLineOnly'
    //     },
  
    //     //Codigo de barras
    //     {
    //       // image : this.textToBase64Barcode(docAdd),alignment: "center"
    //     },
    //     { 
    //       text: '',
    //       pageBreak: 'before',
    //     },
    //   )
    // }
    //Elimina el ultimo salto de pagina porque deja una pagina en blanco al final
    ticketDefinition.content.splice(ticketDefinition.content.length-1,1);
  
      /* const pdfDocGenerator1 = pdfMake.createPdf(ticketDefinition);
      pdfDocGenerator1.getBlob((blob) => {
        var file = blob; */
     //si se va a generar en string base64
     const pdfDocGenerator0 = pdfMake.createPdf(ticketDefinition);
      pdfDocGenerator0.getBase64((data) => {
        var file = data;
  
       //const id = 'Order-'+ Math.random().toString(36).substring(2)+Date.now()+'.pdf';
     
      //  const fileName = `Etiquetas pedido N° ${docAdd}`;
  
      //  const idfile = fileName +'.pdf';
      /*  this.pedido_.pdfname = idfile;
       this.pedido_.pdfb64 = file; */
      //  const fileRef:AngularFireStorageReference=this.afStorage.ref("Tickets").child(idfile);
      //  const task: AngularFireUploadTask = fileRef.putString(file, 'base64') //Para guardar desde un string base64  
       //const task: AngularFireUploadTask = fileRef.put(file); //Para guardar desde un archivo .Blob
  
    //   task.snapshotChanges().pipe(
    //      finalize(() => {
    //        this.URLPublica = this.afStorage.ref("Tickets").child(idfile).getDownloadURL();
    //          fileRef.getDownloadURL().subscribe(downloadURL => {
    //            this.pedido_.ticketurl=downloadURL;
    //            this.URLPublica = downloadURL;
    //            this.onSubmitAlmacen(pf,this.URLPublica);
    //          });
  
    //    })
    //  ).subscribe();
  
  
   });//pdfDocGenerator
  }
}
