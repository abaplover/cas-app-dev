import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject, snapshotChanges} from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirestoreDocument } from '@angular/fire/firestore/document/document';
import { RippleRef } from '@angular/material/core';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

//import{AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
//import{observable} from 'rxjs';
//import{ map } from 'rxjs';
// Model

import { Client } from '../models/client';

@Injectable()
export class ClientService {

  clientList: AngularFireList<any>;
  //list2: AngularFireList<any>;
  clientRef: AngularFireObject<any>;
  selectedClient: Client = new Client();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;

  phoneClient: string;

  clienterep: Observable<Client[]>;
  clienteDocrep: AngularFirestoreDocument<Client>;
  clienteColletionrep: AngularFirestoreCollection<Client>;

  client: AngularFireList<any>;

  
  clientData:any; //Variable que se llena al solicitar los datos de un cliente

  constructor(
    private firebase: AngularFireDatabase,
    private afs: AngularFirestore) { }


  getClients()
  {
    return this.clientList = this.firebase.list('clients');
  }

  getClientsRep(strq){
    this.clienteColletionrep = this.afs.collection("clients");
    this.clienterep = this.clienteColletionrep.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        console.log(a);
        const data = a.payload.doc.data() as Client;
        return data;
      })
    }));
    return this.clienterep;
  }

  getSpecificClient(idClient){
    /* this.clientRef = this.firebase.object('clients/' + idClient);
    return this.clientRef; */
    this.client = this.firebase.list("/clients",ref => ref.orderByChild('idcliente').equalTo(idClient));
    console.log(this.client)
    return this.client;
    
    /* var f = this.afs.collection('clients');
    var query = f.ref.where('idcliente','==', `${idClient}`)
    console.log("query ", query)
    return query; */
  }

   /*  let f = this.db.doc<Client>('clients/' + clientId).valueChanges();
    f.toPromise().then(doc => {
      console.log("doc ", doc)
    })
    this.clientList2 = this.firebase.list('clients', ref => ref.orderByChild('idcliente').equalTo(clientId));
    console.log(this.clientList2.valueChanges().toPromise().then( doc => console.log(doc))) */
    // return new Promise((resolve, reject) => {
    //   let c = this.db.collection('clients', ref => ref.where("idcliente", "==", clientId));
    //   /* let c = this.db.collection("clients").doc(`${clientId}`).get().toPromise()
    //   .then(doc => {
    //     console.log("=====CLIENT ",doc.data());
    //     resolve(doc);
    //   }).catch(function (err) {
    //     console.log("Error getting document:", err);
    //     reject(err);
    //   }); */
    //     console.log("=====CLIENT ",c);
    // })


  insertClient(client: Client)
  {
    this.clientList.push({
      idcliente  : client.idcliente,
      descripcion: client.descripcion,
      idesc      : client.idcliente +' - '+ client.descripcion, 
      direccion  : client.direccion,
      telefonom  : client.telefonom,
      telefonof  : client.telefonof,
      email      : client.email,
      iimpuesto  : client.iimpuesto,
      iretencion : client.iretencion,
      zona       : client.zona,
      listaprecio: client.listaprecio,
      rif        : client.idcliente //Anterior mente era client.rif, pero se deinio que ID=RIF
    });
  }

  updateClient(client: Client)
  {
    this.clientList.update(client.$key, {
      idcliente  : client.idcliente,
      descripcion: client.descripcion,
      idesc      : client.idcliente +' - '+ client.descripcion, 
      direccion  : client.direccion,
      telefonom  : client.telefonom,
      telefonof  : client.telefonof,
      email      : client.email,
      iimpuesto  : client.iimpuesto,
      iretencion : client.iretencion,
      zona       : client.zona,
      listaprecio: client.listaprecio,
      rif        : client.idcliente //Anterior mente era client.rif, pero se deinio que ID=RIF
    });
  }

  deleteClient($key: string)
  {
    this.clientList.remove($key);
  }

}
