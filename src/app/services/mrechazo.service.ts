import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
//import{AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
//import{observable} from 'rxjs';
//import{ map } from 'rxjs';
// Model

import { Mrechazo } from '../models/mrechazo';

@Injectable()
export class MrechazoService {

  mrechazoList: AngularFireList<any>;
  selectedMrechazo: Mrechazo = new Mrechazo();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getMrechazos()
  {
    return this.mrechazoList = this.firebase.list('mrechazos');
  }

  insertMrechazo(mrechazo: Mrechazo)
  {
    this.mrechazoList.push({
      idmrechazo: mrechazo.idmrechazo,
      descripcion: mrechazo.descripcion,
    });
  }

  updateMrechazo(mrechazo: Mrechazo)
  {
    this.mrechazoList.update(mrechazo.$key, {
      idmrechazo: mrechazo.idmrechazo,
      descripcion: mrechazo.descripcion
    });
  }

  deleteMrechazo($key: string)
  {
    this.mrechazoList.remove($key);
  }

}