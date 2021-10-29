import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';


import { Marca } from '../models/marca';

@Injectable()
export class MarcaService {

  marcaList: AngularFireList<any>;
  selectedMarca: Marca = new Marca();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getMarcas()
  {
    return this.marcaList = this.firebase.list('marcas');
  }

  insertMarca(marca: Marca)
  {
    this.marcaList.push({
      idmarca: marca.idmarca,
      descripcion: marca.descripcion,
    });
  }

  updateMarca(marca: Marca)
  {
    this.marcaList.update(marca.$key, {
      idmarca: marca.idmarca,
      descripcion: marca.descripcion
    });
  }

  deleteMarca($key: string)
  {
    this.marcaList.remove($key);
  }

}
