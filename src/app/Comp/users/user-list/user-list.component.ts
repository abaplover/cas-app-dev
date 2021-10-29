import { Component, OnInit } from '@angular/core';
import { ConexionService } from 'src/app/services/conexion.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  
  items: any;

  editaritems: any = {
    name: ''
  }


  constructor(private conexion: ConexionService) { 
    this.conexion.obtenerElementos().subscribe(item=>{
      this.items = item;
      //console.log(this.items);
    })
  }

  ngOnInit(): void {
  }

  editar(ele){
    this.editaritems = ele;
  }

  eliminar(ele){
    this.conexion.eliminarEle(ele);
  }


}
