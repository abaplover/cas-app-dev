import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pedido } from '../models/pedido';
import { PedidoDet } from '../models/pedidoDet';
import { Action } from 'rxjs/internal/scheduler/Action';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  pdfUrl="";
  selectedIndex = 0;
  matrisDetPedido: PedidoDet[]=[];
  elementoBorrados: PedidoDet[]=[];
  docAdd:number = -1;
  readonlyField = false;
  disabledFieldVen = false;
  txtBtnAccion = "Crear Pedido";
  enviar = false;
  mostrarForm: boolean = false;
  mostrardesc: boolean = false;
  valorAutPed: string;
  valorAutCli: string;
  valorAutVen: string;
  presAscList: string ="";
  indicadorImpuesto: number;
  indicadorImpuestoDesc: string;
  

  totalPri: number = 0;
  totalCnt: number = 0;
  totalPed: number = 0;

  orden: number;

  tmontb: number=0;
  tmontd: number=0;
  tmonti: number=0;
  tmontn: number=0;
  start_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');


  pedido_ = {} as Pedido;
  pedidoDet_ = {} as PedidoDet;
  

  itemsCollection: AngularFirestoreCollection<PedidoDet>;
  items: Observable<PedidoDet[]>;
  itemDoc: AngularFirestoreDocument<PedidoDet>;

  itemsCollection2: AngularFirestoreCollection<Pedido>;
  items2: Observable<Pedido[]>;
  itemDoc2: AngularFirestoreDocument<Pedido>;

  pedidosrep: Observable<Pedido[]>;
  pedidoDocrep: AngularFirestoreDocument<Pedido>;
  pedidosColletionrep: AngularFirestoreCollection<Pedido>;

  pedidos: Observable<Pedido[]>;
  pedidoDoc: AngularFirestoreDocument<Pedido>;
  pedidosColletion: AngularFirestoreCollection<Pedido>;

  pedFac: Observable<Pedido[]>;
  pedFacDoc: AngularFirestoreDocument<Pedido>;
  pedFacColletion: AngularFirestoreCollection<Pedido>;

  pedidosA: Observable<Pedido[]>;
  pedidoDocA: AngularFirestoreDocument<Pedido>;
  pedidosColletionA: AngularFirestoreCollection<Pedido>;

  pedidosF: Observable<Pedido[]>;
  pedidoDocF: AngularFirestoreDocument<Pedido>;
  pedidosColletionF: AngularFirestoreCollection<Pedido>;

  pedidosPrep: Observable<Pedido[]>;
  pedidoDocPrep: AngularFirestoreDocument<Pedido>;
  pedidosColletionPrep: AngularFirestoreCollection<Pedido>;

  pedidosD: Observable<Pedido[]>;
  pedidoDocD: AngularFirestoreDocument<Pedido>;
  pedidosColletionD: AngularFirestoreCollection<Pedido>;

  pedidosE: Observable<Pedido[]>;
  pedidoDocE: AngularFirestoreDocument<Pedido>;
  pedidosColletionE: AngularFirestoreCollection<Pedido>;

  pedidosStat: Observable<Pedido[]>;
  pedidoDocStat: AngularFirestoreDocument<Pedido>;
  pedidosColletionStat: AngularFirestoreCollection<Pedido>;

  pedidosDet: Observable<PedidoDet[]>;
  pedidoDetDoc: AngularFirestoreDocument<PedidoDet>;
  pedidosDetColletion: AngularFirestoreCollection<PedidoDet>;
  db2 = firebase.firestore();

  constructor(public db: AngularFirestore) 
  { 
    //Busca todos los pedidos
    this.pedidosColletion = this.db.collection('pedidos', ref => ref.where("status", 'in', ['ACTIVO', 'FACTURADO', 'DESPACHADO','ENTREGADO','ELIMINADO']).orderBy("creado", "desc").limit(150));
    this.pedidos = this.pedidosColletion.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Pedido; 
        return data;
      })
    }));

    //Busca todos los pedidos con estatus ACTIVO
    this.pedidosColletionA = this.db.collection('pedidos', ref => ref.where("status", 'in', ['ACTIVO']).orderBy("creado", "desc").limit(50));
    this.pedidosA = this.pedidosColletionA.snapshotChanges().pipe(map(changes => {
     return changes.map(a => {
        const data = a.payload.doc.data() as Pedido;
        //data.uid = a.payload.doc.id;
        return data;
      })
    }));

    //Busca todos los pedidos con estatus FACTURADO
    this.pedidosColletionF = this.db.collection('pedidos', ref => ref.where("status", 'in', ['FACTURADO']).orderBy("creado", "desc").limit(50));
    this.pedidosF = this.pedidosColletionF.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Pedido;
        //data.uid = a.payload.doc.id;
        return data;
      })
    }));

    //Busca todos los pedidos con estatus PREPARADO
    this.pedidosColletionPrep = this.db.collection('pedidos', ref => ref.where("status", 'in', ['PREPARADO']).orderBy("creado", "desc").limit(50));
    this.pedidosPrep = this.pedidosColletionPrep.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Pedido;
        //data.uid = a.payload.doc.id;
        return data;
      })
    }));

    //Busca todos los pedidos con estatus DESPACHADO
    this.pedidosColletionD = this.db.collection('pedidos', ref => ref.where("status", 'in', ['DESPACHADO']).orderBy("creado", "desc").limit(50));
    this.pedidosD = this.pedidosColletionD.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Pedido;
       //data.uid = a.payload.doc.id;
        return data;
      })
    }));

    //Busca todos los pedidos con estatus ENTREGADO
    this.pedidosColletionE = this.db.collection('pedidos', ref => ref.where("status", 'in', ['ENTREGADO']).orderBy("creado", "desc").limit(50));
    this.pedidosE = this.pedidosColletionE.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Pedido;
        //data.uid = a.payload.doc.id;
        return data;
      })
    }));

    // //Busca todos los detalles de pedidos
     this.pedidosDetColletion = this.db.collection('pedidosDet');

  }//constructor


  getPedidosRep01(strq)
  {
    //this.pedidosColletionrep = this.db.collection("pedidos", ref => ref.where("fechapedido", ">=", desde).where("fechapedido", "<=", hasta).where("idcliente", "==", codCliente).where("status", "==", status).where("nomvendedor", "==", vendedor).where("condiciondepago", "in", conPago).orderBy("fechapedido", "desc").orderBy("creado", "desc").limit(5000));
  
    this.pedidosColletionrep = this.db.collection("pedidos", strq);
    this.pedidosrep = this.pedidosColletionrep.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Pedido;
        return data;
      })
    }));
    return this.pedidosrep;
  }//getPedidosRep

  getPedidosRep02(strq)
  {
    this.pedidosColletionrep = this.db.collection('pedidos', strq);
    this.pedidosrep = this.pedidosColletionrep.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Pedido;
        return data;
      })
    }));

    return this.pedidosrep;
  }//getPedidosRep02

  getPedidosRep03(strq)
  {
    this.pedidosColletionrep = this.db.collection('pedidos', strq);
    this.pedidosrep = this.pedidosColletionrep.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Pedido;
        return data;
      })
    }));

    return this.pedidosrep;
  }//getPedidosRep03

  getPedidosRep04(strq)
  {
    this.pedidosColletionrep = this.db.collection('pedidos', strq);
    this.pedidosrep = this.pedidosColletionrep.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Pedido;
        return data;
      })
    }));

    return this.pedidosrep;
  }//getPedidosRep04

  getPedidos()
  {
    return this.pedidos;
  }

  getpedFact(cli?:string)
  {

    //Busca Pedidos Facturados en periodo ejemplo 60 meses a tras o 5 Anos
    let aux = new Date();
    const ahora = new Date(aux.setMonth(aux.getMonth()-60));
    this.pedFacColletion = this.db.collection('pedidos', ref => ref.where("status", 'in', ['ENTREGADO']).where("fentrega", ">=", ahora).where("idcliente", "==", cli));
    this.pedFac = this.pedFacColletion.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Pedido; 
        return data;
      })
    }));

    return this.pedFac;
  }
  getPedidosA()
  {
    return this.pedidosA;
  }
  getPedidosF()
  {
    return this.pedidosF;
  }
  getPedidosD()
  {
    return this.pedidosD;
  }
  getPedidosE()
  {
    return this.pedidosE;
  }

  getPedidosPreparados() {
    return this.pedidosPrep;
  }

  getOrderStat2() //Obtiene el id del pedido (Cantidad de pedidos actuales + 1)
  {
    return new Promise((resolve, reject) => {
      var docRef = this.db.collection("pedidos").doc("--stats--");
      docRef.get().toPromise()
        .then(doc => {
          const ordern = doc.data().order+1; //Numero de pedidos + 1
          //console.log(ordern);
          resolve(ordern);
        }).catch(function (err) {
          //console.log("Error getting document:", err);
          reject(err);
        });
    })
  }
  
  addPedidos(ped: Pedido,pedNro?:number)
  {  
    //ID del documento geerado por firebase, es diferente al uid del pedido correlativo
    ped.idpedido = pedNro;
    //ped.uid=pedNro; /*ID Correlativo para el pedido */
    const db = firebase.firestore();
    const ref = db.collection('pedidos').doc(); /*Referencia de la coleccion*/
    const id = ref.id; /*ID Autogenerado*/
    this.docAdd = pedNro; /*Guardamos el Id Para los detalles del pedido*/
    ped.uid=id;
    ref.set(ped) /* Guardamos el documento en la coleccion */
    .then(docRef =>{
      //console.log("Document written: ",this.docAdd);
    }).catch(function(error) {
      console.error("Error adding document: ", error);
    });


    var washingtonRef = db.collection('pedidos').doc('--stats--');
    // Atomically increment the population of the city by 50.
    washingtonRef.update({
        order: firebase.firestore.FieldValue.increment(1)
    });

    //   //Anterior donde se crea el documento con un id personalizado y el id del documento es el id del pedido
    //   this.docAdd = pedNro;
    //   this.pedidosColletion.doc(this.docAdd).set(ped)
    //   .then(docRef =>{
    //     console.log("Document written: ",this.docAdd);
    //   }).catch(function(error) {
    //     console.error("Error adding document: ", error);
    //   });  
  }

  deletePedidos(pedido: Pedido)
  {
    this.pedidoDoc = this.db.doc(`pedidos/${pedido.uid}`);
    //this.pedidoDoc.delete();
    this.pedidoDoc.update(pedido);
  }

  updatePedidos(pedido: Pedido,anularN?:number)
  {
    this.pedidoDoc = this.db.doc(`pedidos/${pedido.uid}`);
    this.pedidoDoc.update(pedido);

    if (anularN==9001)
    { 
      var cityRef = this.db.collection('pedidos').doc(pedido.uid.toString());
      var removeCapital = cityRef.update({
          ffactura: firebase.firestore.FieldValue.delete(),
          tipodoc: firebase.firestore.FieldValue.delete(),
          nrofactura: firebase.firestore.FieldValue.delete()
      });
    }
    if (anularN==9002)
    { 
      var cityRef = this.db.collection('pedidos').doc(pedido.uid.toString());
      var removeCapital = cityRef.update({
          ftentrega: firebase.firestore.FieldValue.delete(),
          fdespacho: firebase.firestore.FieldValue.delete(),
          transporte: firebase.firestore.FieldValue.delete()
      });
    }
  }

  //detalles pedido
  getPedidosDet(uid)
  {
    //Busca todos los detalles de pedidos
    this.itemsCollection = this.db.collection('pedidosDet', ref => ref.where("idpedido", "==", uid).orderBy("indice", "asc"));
    this.pedidosDet = this.itemsCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as PedidoDet;
        data.uid = a.payload.doc.id;
        return data;
      })
    }));
    return this.pedidosDet;
  }//getPedidosDet
  
  getPedidosDetAUX()
  {
    //Busca todos los detalles de pedidos
    this.itemsCollection = this.db.collection('pedidosDet', ref => ref.orderBy("preciomaterial", "asc"));
    this.pedidosDet = this.itemsCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as PedidoDet;
        data.uid = a.payload.doc.id;
        return data;
      })
    }));
    return this.pedidosDet;
  }//getPedidosDet

  addPedidosDet(ped: PedidoDet)
  {
    this.pedidosDetColletion.add(ped)
    .then(function(docRef) {
      //console.log("Document written ");
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  deletePedidosDet(ped: PedidoDet)
  {
    this.pedidoDetDoc = this.db.doc(`pedidosDet/${ped.uid}`);
    this.pedidoDetDoc.delete();
  }

  updatePedidosDet(ped: PedidoDet)
  {
    this.pedidoDetDoc = this.db.doc(`pedidosDet/${ped.uid}`);
    this.pedidoDetDoc.update(ped);
  }

  


}
