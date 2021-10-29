import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Datoemp } from '../../../models/datoemp';
// service
import { DatoempService } from '../../../services/datoemp.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-datoemp-list',
  templateUrl: './datoemp-list.component.html',
  styleUrls: ['./datoemp-list.component.css']
})

export class DatoempListComponent implements OnInit {

  datoempList: Datoemp[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idempresa', 'descripcion', 'rif', 'telefonoFijo', 'telefonocel1', 'telefonocel2','email','Opc'];

  constructor(
    public datoempService: DatoempService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.datoempService.getDatoemps()
      .snapshotChanges().subscribe(item => {
        this.datoempList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.datoempList.push(x as Datoemp);
        });
        
        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.datoempList);
        this.dataSource.sort = this.sort; 
        this.dataSource.paginator = this.paginator;
        
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.datoempService.mostrarForm){
       this.datoempService.mostrarForm = false;
       //this.datoempService.idFieldReadOnly = true;
    }else{
     //this.datoempService.idFieldReadOnly = false;
      this.datoempService.mostrarForm = true;
    }
  }

  onEdit(datoemp: Datoemp) {
    this.datoempService.selectedDatoemp = Object.assign({}, datoemp);
    this.datoempService.mostrarForm = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.datoempService.deleteDatoemp($key);
      this.toastr.warning('Operación Terminada', 'Datoemp Eliminada');
    }
  }

}

