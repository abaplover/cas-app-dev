import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
//import{AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
//import{observable} from 'rxjs';
//import{ map } from 'rxjs';
// Model

import { Garticulo } from '../models/garticulo';

@Injectable()
export class GarticuloService {

  garticuloList: AngularFireList<any>;
  selectedGarticulo: Garticulo = new Garticulo();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getGarticulo()
  {
    return this.garticuloList = this.firebase.list('grupoarticulos');
  }

  insertGarticulo(garticulo: Garticulo)
  {
    this.garticuloList.push({
      idgarticulo: garticulo.idgarticulo,
      descripcion: garticulo.descripcion,
    });
  }

  updateGarticulo(garticulo: Garticulo)
  {
    this.garticuloList.update(garticulo.$key, {
      idgarticulo: garticulo.idgarticulo,
      descripcion: garticulo.descripcion
    });
  }

  deleteGarticulo($key: string)
  {
    this.garticuloList.remove($key);
  }
}