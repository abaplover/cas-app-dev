import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';


import { Banco } from '../models/banco';

@Injectable()
export class BancoService {

  bancoList: AngularFireList<any>;
  selectedBanco: Banco = new Banco();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getBancos()
  {
    return this.bancoList = this.firebase.list('bancos');
  }

  insertBanco(banco: Banco)
  {
    this.bancoList.push({
      idbanco: banco.idbanco,
      nombre: banco.nombre,
      descripcion: banco.descripcion,
      moneda: banco.moneda,
    });
  }

  updateBanco(banco: Banco)
  {
    this.bancoList.update(banco.$key, {
      idbanco: banco.idbanco,
      nombre: banco.nombre,
      descripcion: banco.descripcion,
      moneda: banco.moneda,
    });
  }

  deleteBanco($key: string)
  {
    this.bancoList.remove($key);
  }

}
