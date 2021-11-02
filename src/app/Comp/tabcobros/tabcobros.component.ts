import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CobrosService } from 'src/app/services/cobros.service'
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';
@Component({
  selector: 'app-tabcobros',
  templateUrl: './tabcobros.component.html',
  styleUrls: ['./tabcobros.component.css']
})
export class TabcobrosComponent implements OnInit {

  constructor(public tabRef: CobrosService,public FBlogs: FirebaseloginService,private router:Router) {
    this.tabRef.selectedIndex = 0;
   }

  ngOnInit(): void {
    if (!this.FBlogs.getcurrentusrtrueorfalse()){
      this.router.navigate(['login']);
    }
  }
  
  onTabChanged($event){
    this.tabRef.selectedIndex = $event.index;
    // this.tabRef.pedido_ = {} as Pedido;  
    // this.tabRef.matrisDetPedido = []; // vacia la instancia
    
  }
}
