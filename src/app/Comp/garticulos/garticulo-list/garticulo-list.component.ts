import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Garticulo } from '../../../models/garticulo';
// service
import { GarticuloService } from '../../../services/garticulo.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-garticulo-list',
  templateUrl: './garticulo-list.component.html',
  styleUrls: ['./garticulo-list.component.css']
})
export class GarticuloListComponent implements OnInit {

  garticuloList: Garticulo[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idgarticulo', 'descripcion', 'Opc'];
  
  constructor(
    public garticuloService: GarticuloService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.garticuloService.getGarticulo()
      .snapshotChanges().subscribe(item => {
        this.garticuloList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.garticuloList.push(x as Garticulo);
        });
        
        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.garticuloList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.garticuloService.mostrarForm){
       this.garticuloService.mostrarForm = false;
       this.garticuloService.idFieldReadOnly = true;
    }else{
     this.garticuloService.idFieldReadOnly = false;
      this.garticuloService.mostrarForm = true;
    }
  }

  onEdit(garticulo: Garticulo) {
    this.garticuloService.selectedGarticulo = Object.assign({}, garticulo);
    this.garticuloService.mostrarForm = true;
    this.garticuloService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.garticuloService.deleteGarticulo($key);
      this.toastr.warning('Operación Terminada', 'Grupo de Articulos Eliminado');
    }
  }

}
