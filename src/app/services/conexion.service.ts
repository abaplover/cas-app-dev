import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Item { name: string; }



@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  Selectedelemento: any ={
    name:''
  }

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;

  private itemdoc: AngularFirestoreDocument<any>;

  constructor(private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Item>('products');
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
   }

  obtenerElementos(){
    return this.items;
  }
  agregarElementos(item: Item) {
    this.itemsCollection.add(item);
  }

  editarEle(ele) {
    this.itemdoc = this.afs.doc<Item>(`CloudAS/${ele.id}`);
    this.itemdoc.update(ele);
  }

  eliminarEle(ele){
    this.itemdoc = this.afs.doc<Item>(`CloudAS/${ele.id}`);
    this.itemdoc.delete();
  }
}
