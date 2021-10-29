import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service'
import { Pedido } from 'src/app/models/pedido';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabpedidos',
  templateUrl: './tabpedidos.component.html',
  styleUrls: ['./tabpedidos.component.css']
})
export class TabpedidosComponent implements OnInit {

  constructor(public tabRef: PedidoService, public FBlogs: FirebaseloginService,private router:Router) {
    this.tabRef.selectedIndex = 0;
   }
  
  ngOnInit(): void {
    //this.tabRef.selectedIndex = 0;
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
