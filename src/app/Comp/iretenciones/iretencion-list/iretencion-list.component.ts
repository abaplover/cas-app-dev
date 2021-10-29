import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Iretencion } from '../../../models/iretencion';
// service
import { IretencionService } from '../../../services/iretencion.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-iretencion-list',
  templateUrl: './iretencion-list.component.html',
  styleUrls: ['./iretencion-list.component.css']
})

export class IretencionListComponent implements OnInit {

  iretencionList: Iretencion[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['idiretencion', 'descripcion', 'porcentajer', 'Opc'];
  
  constructor(
    public iretencionService: IretencionService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.iretencionService.getIretencions()
      .snapshotChanges().subscribe(item => {
        this.iretencionList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.iretencionList.push(x as Iretencion);
        });
        
        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.iretencionList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.iretencionService.mostrarForm){
       this.iretencionService.mostrarForm = false;
       this.iretencionService.idFieldReadOnly = true;
    }else{
     this.iretencionService.idFieldReadOnly = false;
      this.iretencionService.mostrarForm = true;
    }
  }

  onEdit(iretencion: Iretencion) {
    this.iretencionService.selectedIretencion = Object.assign({}, iretencion);
    this.iretencionService.mostrarForm = true;
    this.iretencionService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.iretencionService.deleteIretencion($key);
      this.toastr.warning('Operación Terminada', 'Indicaor de retención Eliminada');
    }
  }

}
