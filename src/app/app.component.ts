import { Component } from '@angular/core';
import { RouteReuseStrategy, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cas-app';

  items: Observable<any[]>;
  constructor(private router:Router,firestore: AngularFirestore) {
    this.items = firestore.collection('Marcas').valueChanges();
  }
  
  //constructor(private router:Router,firestore: AngularFirestore){}


}
