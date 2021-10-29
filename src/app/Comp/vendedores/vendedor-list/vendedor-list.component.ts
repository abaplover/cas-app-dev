import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Vendedor } from '../../../models/vendedor';
// service
import { VendedorService } from '../../../services/vendedor.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-vendedor-list',
  templateUrl: './vendedor-list.component.html',
  styleUrls: ['./vendedor-list.component.css']
})

export class VendedorListComponent implements OnInit {

  vendedorList: Vendedor[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idvendedor', 'descripcion', 'vemail', 'vusr', 'vzona','Opc'];

  constructor(
    public vendedorService: VendedorService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.vendedorService.getVendedors().snapshotChanges().subscribe(item => {
        this.vendedorList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.vendedorList.push(x as Vendedor);
        });

        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.vendedorList);
        this.dataSource.sort = this.sort;  
        this.dataSource.paginator = this.paginator;

      });    
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.vendedorService.mostrarForm){
       this.vendedorService.mostrarForm = false;
       this.vendedorService.idFieldReadOnly = true;
    }else{
     this.vendedorService.idFieldReadOnly = false;
      this.vendedorService.mostrarForm = true;
    }
  }

  onEdit(vendedor: Vendedor) {
    this.vendedorService.selectedVendedor = Object.assign({}, vendedor);
    this.vendedorService.mostrarForm = true;
    this.vendedorService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.vendedorService.deleteVendedor($key);
      this.toastr.warning('Operación Terminada', 'Vendedor Eliminado');
    }
  }

}