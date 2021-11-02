import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
//import{AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
//import{observable} from 'rxjs';
//import{ map } from 'rxjs';
// Model

import { Cpago } from '../models/cpago';

@Injectable()
export class CpagoService {

  cpagoList: AngularFireList<any>;
  selectedCpago: Cpago = new Cpago();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getCpagos()
  {
    return this.cpagoList = this.firebase.list('cpagos');
  }

  insertCpago(cpago: Cpago)
  {
    this.cpagoList.push({
      idcpago: cpago.idcpago,
      descripcion: cpago.descripcion,
      diascredito: cpago.diascredito
    });
  }

  updateCpago(cpago: Cpago)
  {
    this.cpagoList.update(cpago.$key, {
      idcpago: cpago.idcpago,
      descripcion: cpago.descripcion,
      diascredito: cpago.diascredito
    });
  }

  deleteCpago($key: string)
  {
    this.cpagoList.remove($key);
  }

}
