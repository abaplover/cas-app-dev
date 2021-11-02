import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Tipod } from '../../../models/tipod';
// service
import { TipodService } from '../../../services/tipod.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-tipod-list',
  templateUrl: './tipod-list.component.html',
  styleUrls: ['./tipod-list.component.css']
})

export class TipodListComponent implements OnInit {

  tipodList: Tipod[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idtipod', 'descripcion', 'Opc'];
  
  constructor(
    public tipodService: TipodService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.tipodService.getTipods()
      .snapshotChanges().subscribe(item => {
        this.tipodList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.tipodList.push(x as Tipod);
        });

        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.tipodList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
                
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.tipodService.mostrarForm){
       this.tipodService.mostrarForm = false;
       this.tipodService.idFieldReadOnly = true;
    }else{
     this.tipodService.idFieldReadOnly = false;
      this.tipodService.mostrarForm = true;
    }
  }

  onEdit(tipod: Tipod) {
    this.tipodService.selectedTipod = Object.assign({}, tipod);
    this.tipodService.mostrarForm = true;
    this.tipodService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.tipodService.deleteTipod($key);
      this.toastr.warning('Operación Terminada', 'Tipo de documento eliminado');
    }
  }

}
