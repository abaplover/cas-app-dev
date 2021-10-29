import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
//  Service 
import { UmedidaService } from '../../../services/umedida.service';
// Class
import { Umedida } from '../../../models/umedida';
// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-umedida',
  templateUrl: './umedida.component.html',
  styleUrls: ['./umedida.component.css']
})
export class UmedidaComponent implements OnInit {
  public get umedidaService(): UmedidaService {
    return this._umedidaService;
  }
  public set umedidaService(value: UmedidaService) {
    this._umedidaService = value;
  }

  constructor(
    private _umedidaService: UmedidaService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.umedidaService.getUmedidas();
    this.umedidaService.mostrarForm = false;
    this.umedidaService.idFieldReadOnly = false;
    this.resetForm();
  }

  onSubmit(umedidaForm: NgForm)
  {
    if(umedidaForm.value.$key == null)
      this.umedidaService.insertUmedida(umedidaForm.value);
    else
      this.umedidaService.updateUmedida(umedidaForm.value);
    
    this.resetForm(umedidaForm);
    this.toastr.success('Operación Terminada', 'Unidad de Medida Registrada');

   //oculta el formulario
   this.umedidaService.mostrarForm = false;
   this.msj_enlace = 'Marcas';

  }

  resetForm(umedidaForm?: NgForm)
  {
    if(umedidaForm != null)
    umedidaForm.reset();
      this.umedidaService.selectedUmedida = new Umedida();
      this.umedidaService.idFieldReadOnly = false;
  }

   //mostrar: boolean = false;
   public msj_enlace: string = 'Marcas';

   moForm(){
       if (this.umedidaService.mostrarForm){
         this.umedidaService.mostrarForm = false;
         this.umedidaService.idFieldReadOnly = true;
         this.resetForm();
         this.msj_enlace = 'Marcas';
       }else{
         this.umedidaService.mostrarForm = true;
         this.umedidaService.idFieldReadOnly = false;
         this.msj_enlace = '';
       }
   }


}
