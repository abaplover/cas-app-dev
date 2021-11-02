import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//  Service 
import { CpagoService } from '../../../services/cpago.service';

// Class
import { Cpago } from '../../../models/cpago';

// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cpago',
  templateUrl: './cpago.component.html',
  styleUrls: ['./cpago.component.css']
})
export class CpagoComponent implements OnInit {
  public get cpagoService(): CpagoService {
    return this._cpagoService;
  }
  public set cpagoService(value: CpagoService) {
    this._cpagoService = value;
  }

  constructor(
    private _cpagoService: CpagoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.cpagoService.getCpagos();
    this.cpagoService.mostrarForm = false;
    this.cpagoService.idFieldReadOnly = false;
    this.resetForm();
  }

  onSubmit(cpagoForm: NgForm)
  {
    if(cpagoForm.value.$key == null)
      this.cpagoService.insertCpago(cpagoForm.value);
    else
      this.cpagoService.updateCpago(cpagoForm.value);
    
    this.resetForm(cpagoForm);
    this.toastr.success('Operación Terminada', 'Condiciones de pago Registrada');
   //oculta el formulario
   this.cpagoService.mostrarForm = false;
   this.msj_enlace = 'Condiciones de Pago';
  }

  resetForm(cpagoForm?: NgForm)
  {
    if(cpagoForm != null)
    cpagoForm.reset();
      this.cpagoService.selectedCpago = new Cpago();
      this.cpagoService.idFieldReadOnly = false;
  }
 //mostrar: boolean = false;
 public msj_enlace: string = 'Condiciones de Pago';

 moForm(){
     if (this.cpagoService.mostrarForm){
       this.cpagoService.mostrarForm = false;
       this.cpagoService.idFieldReadOnly = true;
       this.resetForm();
       this.msj_enlace = 'Condiciones de Pago';
     }else{
       this.cpagoService.mostrarForm = true;
       this.cpagoService.idFieldReadOnly = false;
       this.msj_enlace = '';
     }
 }
}

