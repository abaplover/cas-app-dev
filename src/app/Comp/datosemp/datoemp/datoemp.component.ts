import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//  Service 
import { DatoempService } from '../../../services/datoemp.service';

// Class
import { Datoemp } from '../../../models/datoemp';

// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-datoemp',
  templateUrl: './datoemp.component.html',
  styleUrls: ['./datoemp.component.css']
})
export class DatoempComponent implements OnInit {
  public get datoempService(): DatoempService {
    return this._datoempService;
  }
  public set datoempService(value: DatoempService) {
    this._datoempService = value;
  }

  constructor(
    private _datoempService: DatoempService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.datoempService.getDatoemps();
    this.resetForm();
  }

  onSubmit(datoempForm: NgForm)
  {
    if(datoempForm.value.$key == null)
      this.datoempService.insertDatoemp(datoempForm.value);
    else
      this.datoempService.updateDatoemp(datoempForm.value);
    
    this.resetForm(datoempForm);
    this.toastr.success('Operación Terminada', 'Datos Registrados');

   //oculta el formulario
   this.datoempService.mostrarForm = false;
   this.msj_enlace = 'Datos';
  }

  resetForm(datoempForm?: NgForm)
  {
    if(datoempForm != null)
      datoempForm.reset();
    this.datoempService.selectedDatoemp = new Datoemp();
  }

  //mostrar: boolean = false;
  public msj_enlace: string = 'Datos';

  moForm(){
      if (this.datoempService.mostrarForm){
        this.datoempService.mostrarForm = false;
        this.msj_enlace = 'Datos';
      }else{
        this.datoempService.mostrarForm = true;
        this.msj_enlace = '';
      }
  }

}

