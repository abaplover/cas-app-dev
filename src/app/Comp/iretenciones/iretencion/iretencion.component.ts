import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//  Service 
import { IretencionService } from '../../../services/iretencion.service';

// Class
import { Iretencion } from '../../../models/iretencion';

// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-iretencion',
  templateUrl: './iretencion.component.html',
  styleUrls: ['./iretencion.component.css']
})
export class IretencionComponent implements OnInit {
  public get iretencionService(): IretencionService {
    return this._iretencionService;
  }
  public set iretencionService(value: IretencionService) {
    this._iretencionService = value;
  }

  constructor(
    private _iretencionService: IretencionService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.iretencionService.getIretencions();
    this.iretencionService.mostrarForm = false;
    this.iretencionService.idFieldReadOnly = false;
    this.resetForm();
  }

  onSubmit(iretencionForm: NgForm)
  {
    if(iretencionForm.value.$key == null)
      this.iretencionService.insertIretencion(iretencionForm.value);
    else
      this.iretencionService.updateIretencion(iretencionForm.value);
    
    this.resetForm(iretencionForm);
    this.toastr.success('Operación Terminada', 'Indicador de retención Registrada');
   //oculta el formulario
   this.iretencionService.mostrarForm = false;
   this.msj_enlace = 'Indicador de retención';
  }

  resetForm(iretencionForm?: NgForm)
  {
    if(iretencionForm != null)
    iretencionForm.reset();
      this.iretencionService.selectedIretencion = new Iretencion();
      this.iretencionService.idFieldReadOnly = false;
  }
//mostrar: boolean = false;
public msj_enlace: string = 'Indicador de retención';

moForm(){
    if (this.iretencionService.mostrarForm){
      this.iretencionService.mostrarForm = false;
      this.iretencionService.idFieldReadOnly = true;
      this.resetForm();
      this.msj_enlace = 'Indicador de retención';
    }else{
      this.iretencionService.mostrarForm = true;
      this.iretencionService.idFieldReadOnly = false;
      this.msj_enlace = '';
    }
}

}
