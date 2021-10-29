import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';


import { Transporte } from '../models/transporte';

@Injectable()
export class TransporteService {

  transporteList: AngularFireList<any>;
  selectedTransporte: Transporte = new Transporte();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getTransportes()
  {
    return this.transporteList = this.firebase.list('transportes');
  }

  insertTransporte(transporte: Transporte)
  {
    this.transporteList.push({
      idtransporte: transporte.idtransporte,
      descripcion: transporte.descripcion,
    });
  }

  updateTransporte(transporte: Transporte)
  {
    this.transporteList.update(transporte.$key, {
      idtransporte: transporte.idtransporte,
      descripcion: transporte.descripcion
    });
  }

  deleteTransporte($key: string)
  {
    this.transporteList.remove($key);
  }

}
