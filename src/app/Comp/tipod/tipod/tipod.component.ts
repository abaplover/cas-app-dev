import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//  Service 
import { TipodService } from '../../../services/tipod.service';

// Class
import { Tipod } from '../../../models/tipod';

// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tipod',
  templateUrl: './tipod.component.html',
  styleUrls: ['./tipod.component.css']
})
export class TipodComponent implements OnInit {
  public get tipodService(): TipodService {
    return this._tipodService;
  }
  public set tipodService(value: TipodService) {
    this._tipodService = value;
  }

  constructor(
    private _tipodService: TipodService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.tipodService.getTipods();
    this.tipodService.mostrarForm = false;
    this.tipodService.idFieldReadOnly = false;
    this.resetForm();
  }

  onSubmit(tipodForm: NgForm)
  {
    if(tipodForm.value.$key == null)
      this.tipodService.insertTipod(tipodForm.value);
    else
      this.tipodService.updateTipod(tipodForm.value);
    
    this.resetForm(tipodForm);
    this.toastr.success('Operación Terminada', 'Tipo de documento registrado');

   //oculta el formulario
   this.tipodService.mostrarForm = false;
   this.msj_enlace = 'Tipos de documentos';
  }

  resetForm(tipodForm?: NgForm)
  {
    if(tipodForm != null)
    tipodForm.reset();
      this.tipodService.selectedTipod = new Tipod();
      this.tipodService.idFieldReadOnly = false;
  }

  //mostrar: boolean = false;
  public msj_enlace: string = 'Tipos de documentos';

  moForm(){
      if (this.tipodService.mostrarForm){
        this.tipodService.mostrarForm = false;
        this.tipodService.idFieldReadOnly = true;
        this.resetForm();
        this.msj_enlace = 'Tipos de documentos';
      }else{
        this.tipodService.mostrarForm = true;
        this.tipodService.idFieldReadOnly = false;
        this.msj_enlace = '';
      }
  }

}
