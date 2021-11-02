import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Marca } from '../../../models/marca';
// service
import { MarcaService } from '../../../services/marca.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-marca-list',
  templateUrl: './marca-list.component.html',
  styleUrls: ['./marca-list.component.css']
})

export class MarcaListComponent implements OnInit {

  marcaList: Marca[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idmarca', 'descripcion', 'Opc'];
  
  constructor(
    public marcaService: MarcaService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.marcaService.getMarcas()
      .snapshotChanges().subscribe(item => {
        this.marcaList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.marcaList.push(x as Marca);
        });

        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.marcaList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.marcaService.mostrarForm){
       this.marcaService.mostrarForm = false;
       this.marcaService.idFieldReadOnly = true;
    }else{
     this.marcaService.idFieldReadOnly = false;
      this.marcaService.mostrarForm = true;
    }
  }

  onEdit(marca: Marca) {
    this.marcaService.selectedMarca = Object.assign({}, marca);
    this.marcaService.mostrarForm = true;
    this.marcaService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.marcaService.deleteMarca($key);
      this.toastr.warning('Operación Terminada', 'Marca Eliminada');
      
    }
  }

}
