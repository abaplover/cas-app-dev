import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Zventa } from '../../../models/zventa';
// service
import { ZventaService } from '../../../services/zventa.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-zventa-list',
  templateUrl: './zventa-list.component.html',
  styleUrls: ['./zventa-list.component.css']
})

export class ZventaListComponent implements OnInit {

  zventaList: Zventa[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idzventa', 'descripcion', 'Opc'];

  constructor(
    public zventaService: ZventaService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.zventaService.getZventas()
      .snapshotChanges().subscribe(item => {
        this.zventaList = [];

        item.forEach(element => {
          console.log(element)
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.zventaList.push(x as Zventa);
        });

        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.zventaList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      
      });


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.zventaService.mostrarForm){
       this.zventaService.mostrarForm = false;
       this.zventaService.idFieldReadOnly = true;
    }else{
     this.zventaService.idFieldReadOnly = false;
      this.zventaService.mostrarForm = true;
    }
  }

  onEdit(zventa: Zventa) {
    this.zventaService.selectedZventa = Object.assign({}, zventa);
    this.zventaService.mostrarForm = true;
    this.zventaService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.zventaService.deleteZventa($key);
      this.toastr.warning('Operación Terminada', 'Zona de Ventas Eliminada');
    }
  }

}

