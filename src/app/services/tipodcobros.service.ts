import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { TipodocCobros } from '../models/tipodoc-cobros';



@Injectable({
  providedIn: 'root'
})
export class TipodcobrosService {

  tipodList: AngularFireList<any>;
  selectedTipod: TipodocCobros = new TipodocCobros();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getTipods()
  {
    return this.tipodList = this.firebase.list('tipodcobros');
  }

  insertTipod(tipodcobro: TipodocCobros)
  {
    this.tipodList.push({
      id: tipodcobro.id,
      nombre: tipodcobro.nombre,
      descripcion: tipodcobro.descripcion,
    });
  }

  updateTipod(tipodcobro: TipodocCobros)
  {
    this.tipodList.update(tipodcobro.$key, {
      id: tipodcobro.id,
      nombre: tipodcobro.nombre,
      descripcion: tipodcobro.descripcion
    });
  }

  deleteTipod($key: string)
  {
    this.tipodList.remove($key);
  }
}
