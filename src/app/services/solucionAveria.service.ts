import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
//import{AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
//import{observable} from 'rxjs';
//import{ map } from 'rxjs';
// Model

import { SolucionAveria } from '../models/solucionaveria';

@Injectable()
export class solucionAveriaService {

  listaSolucionesA: AngularFireList<any>;
  mostrarForm: boolean = false;
  idFieldReadOnly = false;

  constructor(private firebase: AngularFireDatabase) { }

  getSoluaverias()
  {
    return this.listaSolucionesA = this.firebase.list('solucionaveria');
  }

  insertSolaveria(soluaveria: SolucionAveria)
  //insertSolaveria()
  {
    this.listaSolucionesA.push({
      idsolucionAv: soluaveria.idsolucionav,
      descripcion: soluaveria.descripcion,
    });
    /* this.listaSolucionesA.push({
      idsolucionAv: "SOLU03",
      descripcion: "No aplica",
    }); */    
  }

  updateSolaveria(soluaveria: SolucionAveria)
  {
    this.listaSolucionesA.update(soluaveria.$key, {
		idsolucionAv: soluaveria.idsolucionav,
        descripcion: soluaveria.descripcion
    });
  }

  deleteSolaveria($key: string)
  {
    this.listaSolucionesA.remove($key);
  }

}