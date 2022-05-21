import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Pedido } from 'src/app/models/pedido';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-ids-list',
  templateUrl: './ids-list.component.html',
  styleUrls: ['./ids-list.component.css']
})
export class IdsListComponent implements OnInit {

  
  pedidoList: Pedido[];
  dataSource: MatTableDataSource<Pedido>;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idpedido'];

  constructor(
    public pedidoService: PedidoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.pedidoService.getPedidosE().subscribe(pedidos => {
      this.pedidoList = pedidos;

      //

    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.pedidoService.mostrarForm){
       this.pedidoService.mostrarForm = false;
    }else{
      this.pedidoService.mostrarForm = true;
    }
  }

  onEdit(banco: Pedido) {
    this.pedidoService.mostrarForm = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.toastr.warning('Operación Terminada', 'Pedido Eliminado');
      
    }
  }

}
