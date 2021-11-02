import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//  Service 
import { IimpuestoService } from '../../../services/iimpuesto.service';

// Class
import { Iimpuesto } from '../../../models/iimpuesto';

// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-iimpuesto',
  templateUrl: './iimpuesto.component.html',
  styleUrls: ['./iimpuesto.component.css']
})
export class IimpuestoComponent implements OnInit {
  public get iimpuestoService(): IimpuestoService {
    return this._iimpuestoService;
  }
  public set iimpuestoService(value: IimpuestoService) {
    this._iimpuestoService = value;
  }

  constructor(
    private _iimpuestoService: IimpuestoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.iimpuestoService.getIimpuestos();
    this.iimpuestoService.mostrarForm = false;
    this.iimpuestoService.idFieldReadOnly = false;
    this.resetForm();
  }

  onSubmit(iimpuestoForm: NgForm)
  {
    if(iimpuestoForm.value.$key == null)
      this.iimpuestoService.insertIimpuesto(iimpuestoForm.value);
    else
      this.iimpuestoService.updateIimpuesto(iimpuestoForm.value);
    
    this.resetForm(iimpuestoForm);
    this.toastr.success('Operación Terminada', 'Condiciones de pago Registrada');
   //oculta el formulario
   this.iimpuestoService.mostrarForm = false;
   this.msj_enlace = 'Indicador de Impuesto';
  }

  resetForm(iimpuestoForm?: NgForm)
  {
    if(iimpuestoForm != null)
    iimpuestoForm.reset();
      this.iimpuestoService.selectedIimpuesto = new Iimpuesto();
      this.iimpuestoService.idFieldReadOnly = false;
  }

//mostrar: boolean = false;
public msj_enlace: string = 'Indicador de Impuesto';

moForm(){
    if (this.iimpuestoService.mostrarForm){
      this.iimpuestoService.mostrarForm = false;
      this.iimpuestoService.idFieldReadOnly = true;
      this.resetForm();
      this.msj_enlace = 'Indicador de Impuesto';
    }else{
      this.iimpuestoService.mostrarForm = true;
      this.iimpuestoService.idFieldReadOnly = false;
      this.msj_enlace = '';
    }
}

}