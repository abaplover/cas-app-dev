import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service'
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-transporte-pedidos',
  templateUrl: './tab-transporte-pedidos.component.html',
  styleUrls: ['./tab-transporte-pedidos.component.css']
})
export class TabTransportePedidosComponent implements OnInit {

  constructor(public tabRef: PedidoService, public FBlogs: FirebaseloginService,private router:Router) {
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
