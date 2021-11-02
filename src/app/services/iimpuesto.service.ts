import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
//import{AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
//import{observable} from 'rxjs';
//import{ map } from 'rxjs';
// Model

import { Iimpuesto } from '../models/iimpuesto';

@Injectable()
export class IimpuestoService {

  iimpuestoList: AngularFireList<any>;
  selectedIimpuesto: Iimpuesto = new Iimpuesto();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getIimpuestos()
  {
    return this.iimpuestoList = this.firebase.list('indicadorimpuestos');
  }

  insertIimpuesto(iimpuesto: Iimpuesto)
  {
    this.iimpuestoList.push({
      idiimpuesto: iimpuesto.idiimpuesto,
      descripcion: iimpuesto.descripcion,
      porcentajei: iimpuesto.porcentajei
    });
  }

  updateIimpuesto(iimpuesto: Iimpuesto)
  {
    this.iimpuestoList.update(iimpuesto.$key, {
      idiimpuesto: iimpuesto.idiimpuesto,
      descripcion: iimpuesto.descripcion,
      porcentajei: iimpuesto.porcentajei
    });
  }

  deleteIimpuesto($key: string)
  {
    this.iimpuestoList.remove($key);
  }

}
