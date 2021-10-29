import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//  Service 
import { MrechazoService } from '../../../services/mrechazo.service';

// Class
import { Mrechazo } from '../../../models/mrechazo';

// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mrechazo',
  templateUrl: './mrechazo.component.html',
  styleUrls: ['./mrechazo.component.css']
})
export class MrechazoComponent implements OnInit {
  public get mrechazoService(): MrechazoService {
    return this._mrechazoService;
  }
  public set mrechazoService(value: MrechazoService) {
    this._mrechazoService = value;
  }

  constructor(
    private _mrechazoService: MrechazoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.mrechazoService.getMrechazos();
    this.mrechazoService.mostrarForm = false;
    this.mrechazoService.idFieldReadOnly = false;
    this.resetForm();
  }

  onSubmit(mrechazoForm: NgForm)
  {
    if(mrechazoForm.value.$key == null)
      this.mrechazoService.insertMrechazo(mrechazoForm.value);
    else
      this.mrechazoService.updateMrechazo(mrechazoForm.value);
    
    this.resetForm(mrechazoForm);
    this.toastr.success('Operación Terminada', 'Motivo de rechazo Registrado');
    //oculta el formulario
    this.mrechazoService.mostrarForm = false;
    this.msj_enlace = 'Motivos de Rechazo';
  }

  resetForm(mrechazoForm?: NgForm)
  {
    if(mrechazoForm != null)
    mrechazoForm.reset();
      this.mrechazoService.selectedMrechazo = new Mrechazo();
      this.mrechazoService.idFieldReadOnly = false;
  }

//mostrar: boolean = false;
public msj_enlace: string = 'Motivos de Rechazo';

moForm(){
    if (this.mrechazoService.mostrarForm){
      this.mrechazoService.mostrarForm = false;
      this.mrechazoService.idFieldReadOnly = true;
      this.resetForm();
      this.msj_enlace = 'Motivos de Rechazo';
    }else{
      this.mrechazoService.mostrarForm = true;
      this.mrechazoService.idFieldReadOnly = false;
      this.msj_enlace = '';
    }
}

}

