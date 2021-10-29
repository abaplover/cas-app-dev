import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
//import{AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
//import{observable} from 'rxjs';
//import{ map } from 'rxjs';
// Model

import { Product } from '../models/product';

@Injectable()
export class ProductService {

  productList: AngularFireList<any>;
  selectedProduct: Product = new Product();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;
  
  constructor(private firebase: AngularFireDatabase) { }

  getProducts():AngularFireList<any>
  {
      //anterior, retorna sin orden 
      this.productList = this.firebase.list('productos');

      //retorna la lista Ordenada 
      return this.firebase.list('/productos', ref=>ref.orderByChild('idmaterial'));
  }

  insertProduct(product: Product)
  {
    this.productList.push({
      idmaterial: product.idmaterial,
      descripcion: product.descripcion,
      marca: product.marca,
      unidadmedida: product.unidadmedida,
      grupodearticulos: product.grupodearticulos,
      multiplodeventas: product.multiplodeventas,
      status: product.status,
      clasificacion: product.clasificacion,
      existencia: product.existencia,
      detalles: product.detalles,
      preciousd1: product.preciousd1,
      preciousd2: product.preciousd2,
      preciovef1: product.preciovef1,
      preciovef2: product.preciovef2,
      fotourl: product.fotourl,
      path: product.path
    });
  }

  updateProduct(product: Product)
  {
    this.productList.update(product.$key, {
      idmaterial: product.idmaterial,
      descripcion: product.descripcion,
      marca: product.marca,
      unidadmedida: product.unidadmedida,
      grupodearticulos: product.grupodearticulos,
      multiplodeventas: product.multiplodeventas,
      status: product.status,
      clasificacion: product.clasificacion,
      existencia: product.existencia,
      detalles: product.detalles,
      preciousd1: product.preciousd1,
      preciousd2: product.preciousd2,
      preciovef1: product.preciovef1,
      preciovef2: product.preciovef2,
      fotourl: product.fotourl,
      path: product.path
    });
  }

  deleteProduct($key: string)
  {
    this.productList.remove($key);
  }
}