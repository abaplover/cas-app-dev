import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Iimpuesto } from '../../../models/iimpuesto';
// service
import { IimpuestoService } from '../../../services/iimpuesto.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-iimpuesto-list',
  templateUrl: './iimpuesto-list.component.html',
  styleUrls: ['./iimpuesto-list.component.css']
})

export class IimpuestoListComponent implements OnInit {

  iimpuestoList: Iimpuesto[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idiimpuesto', 'descripcion', 'porcentajei', 'Opc'];
  
  constructor(
    public iimpuestoService: IimpuestoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.iimpuestoService.getIimpuestos()
      .snapshotChanges().subscribe(item => {
        this.iimpuestoList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.iimpuestoList.push(x as Iimpuesto);
        });
        
        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.iimpuestoList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.iimpuestoService.mostrarForm){
       this.iimpuestoService.mostrarForm = false;
       this.iimpuestoService.idFieldReadOnly = true;
    }else{
     this.iimpuestoService.idFieldReadOnly = false;
      this.iimpuestoService.mostrarForm = true;
    }
  }

  onEdit(iimpuesto: Iimpuesto) {
    this.iimpuestoService.selectedIimpuesto = Object.assign({}, iimpuesto);
    this.iimpuestoService.mostrarForm = true;
    this.iimpuestoService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.iimpuestoService.deleteIimpuesto($key);
      this.toastr.warning('Operación Terminada', 'Indicador de impuesto Eliminado');
    }
  }

}
