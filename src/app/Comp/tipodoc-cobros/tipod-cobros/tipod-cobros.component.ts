import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//  Service 
import { TipodcobrosService } from '../../../services/tipodcobros.service';

// Class
import { TipodocCobros } from '../../../models/tipodoc-cobros';

// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tipod-cobros',
  templateUrl: './tipod-cobros.component.html',
  styleUrls: ['./tipod-cobros.component.css']
})

export class TipodCobrosComponent implements OnInit {

  public get tipodcobroService(): TipodcobrosService {
    return this._tipodcobroService;
  }
  public set tipodcobroService(value: TipodcobrosService) {
    this._tipodcobroService = value;
  }

  constructor(
    private _tipodcobroService: TipodcobrosService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.tipodcobroService.getTipods();
    this.tipodcobroService.mostrarForm = false;
    this.tipodcobroService.idFieldReadOnly = false;
    this.resetForm();
  }

  onSubmit(tipodcobroForm: NgForm)
  {
    if(tipodcobroForm.value.$key == null)
      this.tipodcobroService.insertTipod(tipodcobroForm.value);
    else
      this.tipodcobroService.updateTipod(tipodcobroForm.value);
    
    this.resetForm(tipodcobroForm);
    this.toastr.success('Operación Terminada', 'Tipo de documento de cobro registrado');

   //oculta el formulario
   this.tipodcobroService.mostrarForm = false;
   this.msj_enlace = 'Tipos de documentos de cobros';
  }

  resetForm(tipodcobroForm?: NgForm)
  {
    if(tipodcobroForm != null)
    tipodcobroForm.reset();
      this.tipodcobroService.selectedTipod = new TipodocCobros();
      this.tipodcobroService.idFieldReadOnly = false;
  }

  //mostrar: boolean = false;
  public msj_enlace: string = 'Tipos de documentos';

  moForm(){
      if (this.tipodcobroService.mostrarForm){
        this.tipodcobroService.mostrarForm = false;
        this.tipodcobroService.idFieldReadOnly = true;
        this.resetForm();
        this.msj_enlace = 'Tipos de documentos de cobros';
      }else{
        this.tipodcobroService.mostrarForm = true;
        this.tipodcobroService.idFieldReadOnly = false;
        this.msj_enlace = '';
      }
  }

}
