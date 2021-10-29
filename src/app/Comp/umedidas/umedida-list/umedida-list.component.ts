import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Umedida } from '../../../models/umedida';
// service
import { UmedidaService } from '../../../services/umedida.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-umedida-list',
  templateUrl: './umedida-list.component.html',
  styleUrls: ['./umedida-list.component.css']
})
export class UmedidaListComponent implements OnInit {

  umedidaList: Umedida[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idumedida', 'descripcion', 'Opc'];

  
  constructor(
    public umedidaService: UmedidaService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.umedidaService.getUmedidas()
      .snapshotChanges().subscribe(item => {
        this.umedidaList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.umedidaList.push(x as Umedida);
        });
        
        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.umedidaList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.umedidaService.mostrarForm){
       this.umedidaService.mostrarForm = false;
       this.umedidaService.idFieldReadOnly = true;
    }else{
     this.umedidaService.idFieldReadOnly = false;
      this.umedidaService.mostrarForm = true;
    }
  }

  onEdit(umedida: Umedida) {
    this.umedidaService.selectedUmedida = Object.assign({}, umedida);
    this.umedidaService.mostrarForm = true;
    this.umedidaService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.umedidaService.deleteUmedida($key);
      this.toastr.warning('Operación Terminada', 'Unidad de Medida Eliminada');
    }
  }

}
