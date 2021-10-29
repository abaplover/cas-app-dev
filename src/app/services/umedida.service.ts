import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
//import{AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
//import{observable} from 'rxjs';
//import{ map } from 'rxjs';
// Model

import { Umedida } from '../models/umedida';

@Injectable()
export class UmedidaService {
  umedidaList: AngularFireList<any>;
  selectedUmedida: Umedida = new Umedida();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getUmedidas()
  {
    return this.umedidaList = this.firebase.list('unidadmedidas');
  }

  insertUmedida(umedida: Umedida)
  {
    this.umedidaList.push({
      idumedida: umedida.idumedida,
      descripcion: umedida.descripcion,
    });
  }

  updateUmedida(umedida: Umedida)
  {
    this.umedidaList.update(umedida.$key, {
      idumedida: umedida.idumedida,
      descripcion: umedida.descripcion
    });
  }

  deleteUmedida($key: string)
  {
    this.umedidaList.remove($key);
  }
}
