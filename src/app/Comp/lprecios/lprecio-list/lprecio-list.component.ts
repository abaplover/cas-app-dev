import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Lprecio } from '../../../models/lprecio';
// service
import { LprecioService } from '../../../services/lprecio.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-lprecio-list',
  templateUrl: './lprecio-list.component.html',
  styleUrls: ['./lprecio-list.component.css']
})
export class LprecioListComponent implements OnInit {

  lprecioList: Lprecio[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idlprecio', 'descripcion', 'precio', 'Opc'];

  constructor(
    public lprecioService: LprecioService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.lprecioService.getLprecio()
      .snapshotChanges().subscribe(item => {
        this.lprecioList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.lprecioList.push(x as Lprecio);
        });

        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.lprecioList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.lprecioService.mostrarForm){
       this.lprecioService.mostrarForm = false;
       this.lprecioService.idFieldReadOnly = true;
    }else{
     this.lprecioService.idFieldReadOnly = false;
      this.lprecioService.mostrarForm = true;
    }
  }

  onEdit(lprecio: Lprecio) {
    this.lprecioService.selectedLprecio = Object.assign({}, lprecio);
    this.lprecioService.mostrarForm = true;
    this.lprecioService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.lprecioService.deleteLprecio($key);
      this.toastr.warning('Operación Terminada', 'Lista de precios Eliminada');
    }
  }

}
