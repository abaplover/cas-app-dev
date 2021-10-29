import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Cpago } from '../../../models/cpago';
// service
import { CpagoService } from '../../../services/cpago.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-cpago-list',
  templateUrl: './cpago-list.component.html',
  styleUrls: ['./cpago-list.component.css']
})

export class CpagoListComponent implements OnInit {

  cpagoList: Cpago[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idcpago', 'descripcion', 'diascredito', 'Opc'];
  
  constructor(
    public cpagoService: CpagoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.cpagoService.getCpagos()
      .snapshotChanges().subscribe(item => {
        this.cpagoList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.cpagoList.push(x as Cpago);
        });
        
        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.cpagoList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.cpagoService.mostrarForm){
       this.cpagoService.mostrarForm = false;
       this.cpagoService.idFieldReadOnly = true;
    }else{
     this.cpagoService.idFieldReadOnly = false;
      this.cpagoService.mostrarForm = true;
    }
  }

  onEdit(cpago: Cpago) {
    this.cpagoService.selectedCpago = Object.assign({}, cpago);
    this.cpagoService.mostrarForm =true;
    this.cpagoService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.cpagoService.deleteCpago($key);
      this.toastr.warning('Operación Terminada', 'Condicion de pago Eliminada');
    }
  }

}