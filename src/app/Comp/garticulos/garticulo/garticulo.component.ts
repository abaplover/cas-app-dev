import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
//  Service 
import { GarticuloService } from '../../../services/garticulo.service';
// Class
import { Garticulo } from '../../../models/garticulo';
// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-garticulo',
  templateUrl: './garticulo.component.html',
  styleUrls: ['./garticulo.component.css']
})
export class GarticuloComponent implements OnInit {
  public get garticuloService(): GarticuloService {
    return this._garticuloService;
  }
  public set garticuloService(value: GarticuloService) {
    this._garticuloService = value;
  }

  constructor(
    private _garticuloService: GarticuloService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.garticuloService.getGarticulo();
    this.garticuloService.mostrarForm = false;
    this.garticuloService.idFieldReadOnly = false;
    this.resetForm();
  }

  onSubmit(garticuloForm: NgForm)
  {
    if(garticuloForm.value.$key == null)
      this.garticuloService.insertGarticulo(garticuloForm.value);
    else
      this.garticuloService.updateGarticulo(garticuloForm.value);
    
    this.resetForm(garticuloForm);
    this.toastr.success('Operación Terminada', 'Grupo de Articulos Registrada');
   //oculta el formulario
   this.garticuloService.mostrarForm = false;
   this.msj_enlace = 'Grupo Artículos';

  }

  resetForm(garticuloForm?: NgForm)
  {
    if(garticuloForm != null)
    garticuloForm.reset();
    this.garticuloService.selectedGarticulo = new Garticulo();
    this.garticuloService.idFieldReadOnly = false;
  }

  //mostrar: boolean = false;
  public msj_enlace: string = 'Grupo Artículos';

  moForm(){
      if (this.garticuloService.mostrarForm){
        this.garticuloService.mostrarForm = false;
        this.garticuloService.idFieldReadOnly = true;
        this.resetForm();
        this.msj_enlace = 'Grupo Artículos';
      }else{
        this.garticuloService.mostrarForm = true;
        this.garticuloService.idFieldReadOnly = false;
        this.msj_enlace = '';
      }
  }

}

