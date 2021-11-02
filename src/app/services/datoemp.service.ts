import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
//import{AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
//import{observable} from 'rxjs';
//import{ map } from 'rxjs';
// Model

import { Datoemp } from '../models/datoemp';

@Injectable()
export class DatoempService {

  datoempList: AngularFireList<any>;
  selectedDatoemp: Datoemp = new Datoemp();
  mostrarForm: boolean = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getDatoemps()
  {
    return this.datoempList = this.firebase.list('datosemp');
  }

  insertDatoemp(datoemp: Datoemp)
  {
    this.datoempList.push({
      idempresa: datoemp.idempresa,
      descripcion: datoemp.descripcion,
      rif: datoemp.rif,
      direccion: datoemp.direccion,
      telefonoFijo: datoemp.telefonoFijo,
      telefonocel1: datoemp.telefonocel1,
      telefonocel2: datoemp.telefonocel2,
      email: datoemp.email,
      imglogob64: '',
      status: "Activo"
    });
  }

  updateDatoemp(datoemp: Datoemp)
  {
    this.datoempList.update(datoemp.$key, {
      idempresa: datoemp.idempresa,
      descripcion: datoemp.descripcion,
      rif: datoemp.rif,
      direccion: datoemp.direccion,
      telefonoFijo: datoemp.telefonoFijo,
      telefonocel1: datoemp.telefonocel1,
      telefonocel2: datoemp.telefonocel2,
      email: datoemp.email,
      status: "Activo"

    });
  }

  deleteDatoemp($key: string)
  {
    this.datoempList.remove($key);
  }

}

