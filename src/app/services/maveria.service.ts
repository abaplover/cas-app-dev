import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
//import{AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
//import{observable} from 'rxjs';
//import{ map } from 'rxjs';
// Model

import { Maveria } from '../models/maveria';

@Injectable()
export class MaveriaService {

  maveriaList: AngularFireList<any>;
  selectedMaveria: Maveria = new Maveria();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;

  constructor(private firebase: AngularFireDatabase) { }

  getMaverias()
  {
    return this.maveriaList = this.firebase.list('maverias');
  }

  insertMaveria(maveria: Maveria)
  {
    this.maveriaList.push({
      idmaveria: maveria.idmaveria,
      descripcion: maveria.descripcion,
    });
  }

  updateMaveria(maveria: Maveria)
  {
    this.maveriaList.update(maveria.$key, {
      idmaveria: maveria.idmaveria,
      descripcion: maveria.descripcion
    });
  }

  deleteMaveria($key: string)
  {
    this.maveriaList.remove($key);
  }

}