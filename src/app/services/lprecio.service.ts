import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
//import{AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
//import{observable} from 'rxjs';
//import{ map } from 'rxjs';
// Model

import { Lprecio } from '../models/lprecio';

@Injectable()
export class LprecioService {

  lprecioList: AngularFireList<any>;
  selectedLprecio: Lprecio = new Lprecio();
  mostrarForm: boolean = false;
  txtBtnAccion="Guardar Lista";
  idFieldReadOnly = false;

  constructor(private firebase: AngularFireDatabase) { }

  getLprecio()
  {
    return this.lprecioList = this.firebase.list('listaprecios');
  }

  insertLprecio(lprecio: Lprecio)
  {
    this.lprecioList.push({
      idlprecio: lprecio.idlprecio,
      descripcion: lprecio.descripcion,
      precio: lprecio.precio
    });
  }

  updateLprecio(lprecio: Lprecio)
  {
    this.lprecioList.update(lprecio.$key, {
      idlprecio: lprecio.idlprecio,
      descripcion: lprecio.descripcion,
      precio: lprecio.precio
    });
  }

  deleteLprecio($key: string)
  {
    this.lprecioList.remove($key);
  }
}
