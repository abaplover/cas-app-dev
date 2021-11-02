import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Transporte } from '../../../models/transporte';
// service
import { TransporteService } from '../../../services/transporte.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-transporte-list',
  templateUrl: './transporte-list.component.html',
  styleUrls: ['./transporte-list.component.css']
})

export class TransporteListComponent implements OnInit {

  transporteList: Transporte[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idtransporte', 'descripcion', 'Opc'];
  
  constructor(
    public transporteService: TransporteService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.transporteService.getTransportes()
      .snapshotChanges().subscribe(item => {
        this.transporteList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.transporteList.push(x as Transporte);
        });
        
        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.transporteList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.transporteService.mostrarForm){
       this.transporteService.mostrarForm = false;
       this.transporteService.idFieldReadOnly = true;
    }else{
     this.transporteService.idFieldReadOnly = false;
      this.transporteService.mostrarForm = true;
    }
  }

  onEdit(transporte: Transporte) {
    this.transporteService.selectedTransporte = Object.assign({}, transporte);
    this.transporteService.mostrarForm = true;
    this.transporteService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.transporteService.deleteTransporte($key);
      this.toastr.warning('Operación Terminada', 'Transporte Eliminado');
      
    }
  }

}

