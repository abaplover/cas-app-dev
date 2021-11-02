import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//  Service 
import { TransporteService } from '../../../services/transporte.service';

// Class
import { Transporte } from '../../../models/transporte';

// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transporte',
  templateUrl: './transporte.component.html',
  styleUrls: ['./transporte.component.css']
})
export class TransporteComponent implements OnInit {
  public get transporteService(): TransporteService {
    return this._transporteService;
  }
  public set transporteService(value: TransporteService) {
    this._transporteService = value;
  }

  constructor(
    private _transporteService: TransporteService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.transporteService.getTransportes();
    this.transporteService.mostrarForm = false;
    this.transporteService.idFieldReadOnly = false;
    this.resetForm();
  }

  onSubmit(transporteForm: NgForm)
  {
    if(transporteForm.value.$key == null)
      this.transporteService.insertTransporte(transporteForm.value);
    else
      this.transporteService.updateTransporte(transporteForm.value);
    
    this.resetForm(transporteForm);
    this.toastr.success('Operación Terminada', 'Transporte Registrado');

   //oculta el formulario
   this.transporteService.mostrarForm = false;
   this.msj_enlace = 'Transportes';
  }

  resetForm(transporteForm?: NgForm)
  {
    if(transporteForm != null)
    transporteForm.reset();
      this.transporteService.selectedTransporte = new Transporte();
      this.transporteService.idFieldReadOnly = false;
  }

  //mostrar: boolean = false;
  public msj_enlace: string = 'Transportes';

  moForm(){
      if (this.transporteService.mostrarForm){
        this.transporteService.mostrarForm = false;
        this.transporteService.idFieldReadOnly = true;
        this.resetForm();
        this.msj_enlace = 'Transportes';
      }else{
        this.transporteService.mostrarForm = true;
        this.transporteService.idFieldReadOnly = false;
        this.msj_enlace = '';
      }
  }

}

