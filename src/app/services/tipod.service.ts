import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';


import { Tipod } from '../models/tipod';

@Injectable()
export class TipodService {

  tipodList: AngularFireList<any>;
  selectedTipod: Tipod = new Tipod();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getTipods()
  {
    return this.tipodList = this.firebase.list('tipods');
  }

  insertTipod(tipod: Tipod)
  {
    this.tipodList.push({
      idtipod: tipod.idtipod,
      descripcion: tipod.descripcion,
    });
  }

  updateTipod(tipod: Tipod)
  {
    this.tipodList.update(tipod.$key, {
      idtipod: tipod.idtipod,
      descripcion: tipod.descripcion
    });
  }

  deleteTipod($key: string)
  {
    this.tipodList.remove($key);
  }

}
