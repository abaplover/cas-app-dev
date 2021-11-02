import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
//import{AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
//import{observable} from 'rxjs';
//import{ map } from 'rxjs';
// Model

import { Vendedor } from '../models/vendedor';

@Injectable()
export class VendedorService {

  vendedorList: AngularFireList<any>;
  selectedVendedor: Vendedor = new Vendedor();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getVendedors()
  {
    return this.vendedorList = this.firebase.list('vendedores');
  }

  insertVendedor(vendedor: Vendedor)
  {
    this.vendedorList.push({
      idvendedor: vendedor.idvendedor.toString(),
      descripcion: vendedor.descripcion,
      vusr: vendedor.vusr,
      vpasswd: vendedor.vpasswd,
      vemail: vendedor.vemail,
      vzona: vendedor.vzona
    });
  }

  updateVendedor(vendedor: Vendedor)
  {
    this.vendedorList.update(vendedor.$key, {
      idvendedor: vendedor.idvendedor,
      descripcion: vendedor.descripcion,
      vusr: vendedor.vusr,
      vpasswd: vendedor.vpasswd,
      vemail: vendedor.vemail,
      vzona: vendedor.vzona
    });
  }

  deleteVendedor($key: string)
  {
    this.vendedorList.remove($key);
  }

}