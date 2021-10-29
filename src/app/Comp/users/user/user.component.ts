import { Component, OnInit } from '@angular/core';
import { ConexionService } from 'src/app/services/conexion.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  item: any ={
    name:''
  }

  constructor(private servicio: ConexionService) { }

  ngOnInit(): void {
  }

  guardarData(){
    console.log(this.item.id);
    var a=99;
    if(this.item.id == null){
      this.servicio.agregarElementos(this.item);
     a=0;
    }
    else{
      this.servicio.editarEle(this.item);
      a=1;
    }
    console.log(a);
     this.item.name = '';
  }

}
