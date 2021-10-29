import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Vpago } from '../../../models/vpago';
// service
import { VpagoService } from '../../../services/vpago.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-vpago-list',
  templateUrl: './vpago-list.component.html',
  styleUrls: ['./vpago-list.component.css']
})

export class VpagoListComponent implements OnInit {

  vpagoList: Vpago[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idvpago', 'descripcion', 'Opc'];
  
  constructor(
    public vpagoService: VpagoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.vpagoService.getVpagos()
      .snapshotChanges().subscribe(item => {
        this.vpagoList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.vpagoList.push(x as Vpago);
        });
        
        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.vpagoList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.vpagoService.mostrarForm){
       this.vpagoService.mostrarForm = false;
       this.vpagoService.idFieldReadOnly = true;
    }else{
     this.vpagoService.idFieldReadOnly = false;
      this.vpagoService.mostrarForm = true;
    }
  }

  onEdit(vpago: Vpago) {
    this.vpagoService.selectedVpago = Object.assign({}, vpago);
    this.vpagoService.mostrarForm = true;
    this.vpagoService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.vpagoService.deleteVpago($key);
      this.toastr.warning('Operación Terminada', 'Vpago Eliminada');
    }
  }

}
