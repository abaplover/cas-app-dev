import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//  Service 
import { VpagoService } from '../../../services/vpago.service';

// Class
import { Vpago } from '../../../models/vpago';

// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vpago',
  templateUrl: './vpago.component.html',
  styleUrls: ['./vpago.component.css']
})
export class VpagoComponent implements OnInit {
  public get vpagoService(): VpagoService {
    return this._vpagoService;
  }
  public set vpagoService(value: VpagoService) {
    this._vpagoService = value;
  }

  constructor(
    private _vpagoService: VpagoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.vpagoService.getVpagos();
    this.vpagoService.mostrarForm = false;
    this.vpagoService.idFieldReadOnly = false;
    this.resetForm();
  }

  onSubmit(vpagoForm: NgForm)
  {
    if(vpagoForm.value.$key == null)
      this.vpagoService.insertVpago(vpagoForm.value);
    else
      this.vpagoService.updateVpago(vpagoForm.value);
    
    this.resetForm(vpagoForm);
    this.toastr.success('Operación Terminada', 'Vía de pago Registrada');

   //oculta el formulario
   this.vpagoService.mostrarForm = false;
   this.msj_enlace = 'Vías de pago';

  }

  resetForm(vpagoForm?: NgForm)
  {
    if(vpagoForm != null)
    vpagoForm.reset();
      this.vpagoService.selectedVpago = new Vpago();
      this.vpagoService.idFieldReadOnly = false;
  }

  //mostrar: boolean = false;
  public msj_enlace: string = 'Vías de pago';

  moForm(){
      if (this.vpagoService.mostrarForm){
        this.vpagoService.mostrarForm = false;
        this.vpagoService.idFieldReadOnly = true;
        this.resetForm();
        this.msj_enlace = 'Vías de pago';
      }else{
        this.vpagoService.mostrarForm = true;
        this.vpagoService.idFieldReadOnly = false;
        this.msj_enlace = '';
      }
  }

}