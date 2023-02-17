import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cobro } from '../models/cobro';
import { CobroDet } from '../models/cobro-det';
import { PedidoDet } from '../models/pedidoDet';
import { Action } from 'rxjs/internal/scheduler/Action';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class CobrosService {
  selectedIndex = 0;
  docAdd:number = -1; //id del elemento
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

  constructor(public db: AngularFirestore) { 

    //Busca todos los cobros
    this.cobrosColletion = this.db.collection('cobros', ref => ref.where("status", 'in', ['ACTIVO', 'FACTURADO', 'DESPACHADO','ENTREGADO','ELIMINADO']).orderBy("creado", "desc").limit(50));
    this.cobros = this.cobrosColletion.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Cobro;
        //data.uid = a.payload.doc.id;
        return data;
      })
    }));

    //Busca todos los cobros pagados en los ultimos 14 dias
    let dateFrom = new Date(moment().subtract(14,'d').format('YYYY-MM-DD'));
    
    this.cobrosPagadosColletion = this.db.collection('cobros', ref => ref.where("tipopago", 'in', ['PARCIAL','TOTAL']).where("status",'==',"ACTIVO").where("fechadepago",'>=',dateFrom).orderBy("fechadepago","desc").limit(5000));
    this.cobrosPagados = this.cobrosPagadosColletion.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Cobro;
        return data;
      })
    }));

    //Busca todos los cobros con estatus - PENDIENTE ypedido ENTREGADO
    this.cobrosColletionE = this.db.collection('cobros', ref => 
      ref.where("statuscobro", 'in', ['PENDIENTE', 'PARCIAL'])
      .where("fpvencimiento",">",this.today)
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
    this.cobrosColletionV = this.db.collection('cobros', ref => ref.where("fpvencimiento", "<", hoy).where("status", "==", "ENTREGADO").where("condiciondepago", "in", ["Crédito 7 días","Crédito 15 días","Crédito 10 días","Contado"]).orderBy("fpvencimiento", "desc").orderBy("creado", "desc").limit(50));
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

  getCobrosP(){
    return this.cobrosP;
  }
  getCobrosC(){
    return this.cobrosC;
  }
  getCobrosV(){
    return this.cobrosV;
  }

  addCobros(cob: Cobro,cobNro?:number){  
    //ID del documento geerado por firebase, es diferente al uid del pedido correlativo
    //cob.idpedido = cobNro;

    //ped.uid=pedNro; /*ID Correlativo para el pedido */
    const db = firebase.firestore();
    const ref = db.collection('cobros').doc(); /*Referencia de la coleccion*/
    const id = ref.id; /*ID Autogenerado*/
    this.docAdd = cobNro; /*Guardamos el Id Para los detalles del pedido*/
    cob.uid=id;
    /* Guardamos el documento en la coleccion */

    ref.set(cob).then(docRef =>{
      console.log("Elemento Creado: ",this.docAdd);
    }).catch(function(error) {
      console.error("Error al crear elemento: ", error);
    });
  }//addCobros

  updatecobros(cobro: Cobro){
    console.log('uid: ',cobro.uid,cobro);
    this.cobroDoc = this.db.doc(`cobros/${cobro.uid}`);
    this.cobroDoc.update(cobro);
  }

  addCobrosDet(cod: CobroDet){


    const db = firebase.firestore();
    const ref = db.collection('cobrosDet').doc(); /*Referencia de la coleccion*/
    const id = ref.id; /*ID Autogenerado*/

    cod.docid=id;
    /* Guardamos el documento en la coleccion */

    ref.set(cod).then(docRef =>{
      console.log("Elemento Creado: ",id);
    }).catch(function(error) {
      console.error("Error al crear elemento: ", error);
    });

  }


  deleteCobrosDet(docid: string){
    this.db.collection("cobrosDet").doc(docid).delete().then(function() {
      console.log("Document successfully deleted!");
  }).catch(function(error) {
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
    this.itemsCollection = this.db.collection('cobros', ref => ref.where("idpedido", "==", idpedido).orderBy("fechadepago","asc"));
    this.cobrosDet = this.itemsCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Cobro;
        return data;
      })
    }));
    return this.cobrosDet;
  }//getPedidosDet

  getCobrosRep01(strq){
    console.log("cobrosS ",strq);
    this.cobrosColletionrep = this.db.collection("cobros", strq);
    this.cobrosrep = this.cobrosColletionrep.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Cobro;
        return data;
      })
    }));
    return this.cobrosrep;
  }//getCobrosRep

  getCobrosRep02(queryCobrosDet){
    this.cobrosdetColletionrep = this.db.collection('cobros');
    this.cobrosdetrep = this.cobrosdetColletionrep.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Cobro;
        return data;
      })
    }));  

    return this.cobrosdetrep;
  }//getAveriasRep02

}
