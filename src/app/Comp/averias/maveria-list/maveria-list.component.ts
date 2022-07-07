import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Maveria } from '../../../models/maveria';
// service
import { MaveriaService } from '../../../services/maveria.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-maveria-list',
  templateUrl: './maveria-list.component.html',
  styleUrls: ['./maveria-list.component.css']
})

export class MaveriaListComponent implements OnInit {

  maveriaList: Maveria[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idmaveria', 'descripcion', 'Opc'];

  
  constructor(
    public maveriaService: MaveriaService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.maveriaService.getMaverias()
      .snapshotChanges().subscribe(item => {
        this.maveriaList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.maveriaList.push(x as Maveria);
        });

        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.maveriaList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.dataSource.sortingDataAccessor = (item, property) => {
          if (property === 'Cliente') {
            return item.nomcliente;
          } else if (property === 'Vendedor') {
            return item.nomvendedor;
          }
          else {
            return item[property];
          }
        };

      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.maveriaService.mostrarForm){
       this.maveriaService.mostrarForm = false;
       this.maveriaService.idFieldReadOnly = true;
    }else{
     this.maveriaService.idFieldReadOnly = false;
      this.maveriaService.mostrarForm = true;
    }
  }

  onEdit(maveria: Maveria) {
    this.maveriaService.selectedMaveria = Object.assign({}, maveria);
    this.maveriaService.mostrarForm = true;
    this.maveriaService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.maveriaService.deleteMaveria($key);
      this.toastr.warning('Operación Terminada', 'Motivos de averías Eliminada');
    }
  }

}
