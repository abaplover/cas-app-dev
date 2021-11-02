import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Fproduct } from '../models/fproduct';

@Injectable({
  providedIn: 'root'
})
export class FprodutService {

  productsCollection;
  products: Observable<Fproduct[]>;
  productDoc;

  constructor(public productdb: AngularFirestore) { 
    this.products = this.productdb.collection('products').valueChanges();
  }

  getProducts(){
    return this.products;
  }


}
