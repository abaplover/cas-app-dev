import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
//import{AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
//import{observable} from 'rxjs';
//import{ map } from 'rxjs';
// Model

import { Iretencion } from '../models/iretencion';

@Injectable()
export class IretencionService {

  iretencionList: AngularFireList<any>;
  selectedIretencion: Iretencion = new Iretencion();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getIretencions()
  {
    return this.iretencionList = this.firebase.list('indicadorretencion');
  }

  insertIretencion(iretencion: Iretencion)
  {
    this.iretencionList.push({
      idiretencion: iretencion.idiretencion,
      descripcion: iretencion.descripcion,
      porcentajer: iretencion.porcentajer
    });
  }

  updateIretencion(iretencion: Iretencion)
  {
    this.iretencionList.update(iretencion.$key, {
      idiretencion: iretencion.idiretencion,
      descripcion: iretencion.descripcion,
      porcentajer: iretencion.porcentajer
    });
  }

  deleteIretencion($key: string)
  {
    this.iretencionList.remove($key);
  }

}