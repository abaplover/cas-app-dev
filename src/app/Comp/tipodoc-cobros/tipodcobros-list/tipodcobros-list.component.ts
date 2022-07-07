import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { TipodocCobros } from '../../../models/tipodoc-cobros';
// service
import { TipodcobrosService } from '../../../services/tipodcobros.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-tipodcobros-list',
  templateUrl: './tipodcobros-list.component.html',
  styleUrls: ['./tipodcobros-list.component.css']
})
export class TipodcobrosListComponent implements OnInit {

  tipodList: TipodocCobros[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['id','nombre', 'descripcion', 'Opc'];
  
  constructor(
    public tipodcobrosService: TipodcobrosService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    
    return this.tipodcobrosService.getTipods()
      .snapshotChanges().subscribe(item => {
        this.tipodList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.tipodList.push(x as TipodocCobros);
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
    if (this.tipodcobrosService.mostrarForm){
       this.tipodcobrosService.mostrarForm = false;
       this.tipodcobrosService.idFieldReadOnly = true;
    }else{
     this.tipodcobrosService.idFieldReadOnly = false;
      this.tipodcobrosService.mostrarForm = true;
    }
  }

  onEdit(tipod: TipodocCobros) {
    this.tipodcobrosService.selectedTipod = Object.assign({}, tipod);
    this.tipodcobrosService.mostrarForm = true;
    this.tipodcobrosService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.tipodcobrosService.deleteTipod($key);
      this.toastr.warning('Operación Terminada', 'Tipo de documento eliminado');
    }
  }

}
