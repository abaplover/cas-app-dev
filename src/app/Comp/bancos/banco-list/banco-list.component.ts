import { Component, OnInit, ViewChild } from '@angular/core';
// model
import { Banco } from '../../../models/banco';
// service
import { BancoService } from '../../../services/banco.service';
// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-banco-list',
  templateUrl: './banco-list.component.html',
  styleUrls: ['./banco-list.component.css']
})

export class BancoListComponent implements OnInit {

  bancoList: Banco[];
  dataSource: MatTableDataSource<Banco>;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idbanco', 'descripcion', 'Opc'];

  constructor(
    public bancoService: BancoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.bancoService.getBancos()
      .snapshotChanges().subscribe(item => {
        this.bancoList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.bancoList.push(x as Banco);
        });

        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.bancoList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.bancoService.mostrarForm){
       this.bancoService.mostrarForm = false;
       this.bancoService.idFieldReadOnly = true;
    }else{
     this.bancoService.idFieldReadOnly = false;
      this.bancoService.mostrarForm = true;
    }
  }

  onEdit(banco: Banco) {
    this.bancoService.selectedBanco = Object.assign({}, banco);
    this.bancoService.mostrarForm = true;
    this.bancoService.idFieldReadOnly = true;
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.bancoService.deleteBanco($key);
      this.toastr.warning('Operación Terminada', 'Banco Eliminado');
      
    }
  }

}
