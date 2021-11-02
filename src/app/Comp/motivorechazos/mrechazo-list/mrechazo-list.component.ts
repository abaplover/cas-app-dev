import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Mrechazo } from '../../../models/mrechazo';
// service
import { MrechazoService } from '../../../services/mrechazo.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-mrechazo-list',
  templateUrl: './mrechazo-list.component.html',
  styleUrls: ['./mrechazo-list.component.css']
})

export class MrechazoListComponent implements OnInit {

  mrechazoList: Mrechazo[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idmrechazo', 'descripcion', 'Opc'];


  constructor(
    public mrechazoService: MrechazoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.mrechazoService.getMrechazos()
      .snapshotChanges().subscribe(item => {
        this.mrechazoList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.mrechazoList.push(x as Mrechazo);
        });
        
        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.mrechazoList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.mrechazoService.mostrarForm){
       this.mrechazoService.mostrarForm = false;
       this.mrechazoService.idFieldReadOnly = true;
    }else{
     this.mrechazoService.idFieldReadOnly = false;
      this.mrechazoService.mostrarForm = true;
    }
  }

  onEdit(mrechazo: Mrechazo) {
    this.mrechazoService.selectedMrechazo = Object.assign({}, mrechazo);
    this.mrechazoService.mostrarForm = true;
    this.mrechazoService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.mrechazoService.deleteMrechazo($key);
      this.toastr.warning('Operación Terminada', 'Motivo de rechazo Eliminada');
    }
  }

}
