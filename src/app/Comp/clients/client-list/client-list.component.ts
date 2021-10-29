import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Client } from '../../../models/client';
// service
import { ClientService } from '../../../services/client.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
//Data Table
//import {MatTableDataSource} from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})

export class ClientListComponent implements OnInit {
  clientList: Client[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idcliente','descripcion','direccion','telefonom','telefonof','email','iimpuesto','iretencion','zona','listaprecio','Opc'];
  
  constructor(
    public clientService: ClientService,
    private toastr: ToastrService
  ) { }

  ngOnInit(){
    return this.clientService.getClients()
      .snapshotChanges().subscribe(item => {
        this.clientList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.clientList.push(x as Client);
        });

        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.clientList);
        this.dataSource.sort = this.sort;  
        this.dataSource.paginator = this.paginator;

      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.clientService.mostrarForm){
       this.clientService.mostrarForm = false;
       this.clientService.idFieldReadOnly = true;
    }else{
     this.clientService.idFieldReadOnly = false;
      this.clientService.mostrarForm = true;
    }
  }

  onEdit(client: Client) {
    this.clientService.selectedClient = Object.assign({}, client);
    this.clientService.mostrarForm = true;
    this.clientService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.clientService.deleteClient($key);
      this.toastr.warning('Operación Terminada', 'Cliente Eliminado');
    }
  }

}
