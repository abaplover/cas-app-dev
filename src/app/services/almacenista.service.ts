import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject, snapshotChanges} from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreDocument } from '@angular/fire/firestore/document/document';
import { RippleRef } from '@angular/material/core';
import { firestore } from 'firebase';
import { Almacenista } from '../models/almacenistas';


@Injectable()
export class AlmacenistaService {

  almacenistList: AngularFireList<any>;
  //list2: AngularFireList<any>;
  almacenistRef: AngularFireObject<any>;
  selectedAlmacenista: Almacenista = new Almacenista();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;

  phoneAlmacenist: string;


  almacenista: AngularFireList<any>;

  
  almacenistaData:any; //Variable que se llena al solicitar los datos de un almacenista

  constructor(
    private firebase: AngularFireDatabase,
    private afs: AngularFirestore) { }


  getAlmacenistas()
  {
    return this.almacenistList = this.firebase.list('almacenista');
  }

  //Obtiene los datos de un almacenista a partir del email que se encuentra en el localStorage
  getSpecificAlmacenista(email){
    this.almacenista = this.firebase.list("/almacenista",ref => ref.orderByChild('email').equalTo(email));
    console.log(this.almacenista)
    return this.almacenista;
  }

  insertAlmacenista(almacenista: Almacenista)
  {
    this.almacenistList.push({
      rif  : almacenista.rif,
      direccion  : almacenista.direccion,
      tlfmovil   : almacenista.tlfmovil,
      tlffijo  : almacenista.tlffijo,
      email      : almacenista.email
    });
  }

  updateAlmacenista(almacenista: Almacenista)
  {
    this.almacenistList.update(almacenista.$key, {
		rif  : almacenista.rif,
		direccion  : almacenista.direccion,
		tlfmovil   : almacenista.tlfmovil,
		tlffijo  : almacenista.tlffijo,
		email      : almacenista.email
    });
  }

  deleteAlmacenista($key: string)
  {
    this.almacenistList.remove($key);
  }

}