import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
//import{AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
//import{observable} from 'rxjs';
//import{ map } from 'rxjs';
// Model

import { Vpago } from '../models/vpago';

@Injectable()
export class VpagoService {

  vpagoList: AngularFireList<any>;
  selectedVpago: Vpago = new Vpago();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getVpagos()
  {
    return this.vpagoList = this.firebase.list('vpagos');
  }

  insertVpago(vpago: Vpago)
  {
    this.vpagoList.push({
      idvpago: vpago.idvpago,
      nombre: vpago.nombre,
      descripcion: vpago.descripcion,
    });
  }

  updateVpago(vpago: Vpago)
  {
    this.vpagoList.update(vpago.$key, {
      idvpago: vpago.idvpago,
      nombre: vpago.nombre,
      descripcion: vpago.descripcion
    });
  }

  deleteVpago($key: string)
  {
    this.vpagoList.remove($key);
  }

}