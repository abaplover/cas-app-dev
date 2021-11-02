import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
//  Service 
import { LprecioService } from '../../../services/lprecio.service';
// Class
import { Lprecio } from '../../../models/lprecio';
// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lprecio',
  templateUrl: './lprecio.component.html',
  styleUrls: ['./lprecio.component.css']
})
export class LprecioComponent implements OnInit {
  public get lprecioService(): LprecioService {
    return this._lprecioService;
  }
  public set lprecioService(value: LprecioService) {
    this._lprecioService = value;
  }

  constructor(
    private _lprecioService: LprecioService,
    private toastr: ToastrService
  ) { }

  

  ngOnInit() {
    this.lprecioService.getLprecio();
    this.lprecioService.mostrarForm = false;
    this.lprecioService.idFieldReadOnly = false;
    this.resetForm();
  }

  onSubmit(lprecioForm: NgForm)
  {
    if(lprecioForm.value.$key == null)
      this.lprecioService.insertLprecio(lprecioForm.value);
    else
      this.lprecioService.updateLprecio(lprecioForm.value);
    
    this.resetForm(lprecioForm);
    this.toastr.success('Operación Terminada', 'Lista de precios Guardada');

   //oculta el formulario
   this.lprecioService.mostrarForm = false;
   this.msj_enlace = 'Lista de Precios';
  }

  resetForm(lprecioForm?: NgForm)
  {
    if(lprecioForm != null)
    lprecioForm.reset();
    this.lprecioService.selectedLprecio = new Lprecio();
    this.lprecioService.idFieldReadOnly = false;
  }

  //mostrar: boolean = false;
  public msj_enlace: string = 'Lista de Precios';

  moForm(){
      if (this.lprecioService.mostrarForm){
        this.lprecioService.mostrarForm = false;
        this.lprecioService.idFieldReadOnly = true;
        this.resetForm();
        this.msj_enlace = 'Lista de Precios';
      }else{
        this.lprecioService.mostrarForm = true;
        this.lprecioService.idFieldReadOnly = false;
        this.msj_enlace = '';
      }
  }

}
