import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import * as firebase from 'firebase';
import { filter } from 'rxjs/operators';


import { Zventa } from '../models/zventa';

@Injectable()
export class ZventaService {

  zventaList: AngularFireList<any>;
  selectedZventa: Zventa = new Zventa();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getZventas()
  {
    

var topUserPostsRef = firebase.database().ref('zonaventas/').orderByChild('idzventa');

    console.log ('Uno: ',topUserPostsRef);
    console.log('Dos: ',this.firebase.list('zonaventas'));
    return this.zventaList = this.firebase.list('zonaventas');
    

    //var database = this.firebase.database.ref("idzventa").orderByChild('idzventa');
    //  database.once('value', function(sn){
    //    console.log(sn.val());
    //  })
  }

  insertZventa(zventa: Zventa)
  {
    this.zventaList.push({
      idzventa: zventa.idzventa,
      descripcion: zventa.descripcion,
    });
  }

  updateZventa(zventa: Zventa)
  {
    this.zventaList.update(zventa.$key, {
      idzventa: zventa.idzventa,
      descripcion: zventa.descripcion
    });
  }

  deleteZventa($key: string)
  {
    this.zventaList.remove($key);
  }

}

