import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//  Service 
import { MarcaService } from '../../../services/marca.service';

// Class
import { Marca } from '../../../models/marca';

// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.css']
})
export class MarcaComponent implements OnInit {
  public get marcaService(): MarcaService {
    return this._marcaService;
  }
  public set marcaService(value: MarcaService) {
    this._marcaService = value;
  }

  constructor(
    private _marcaService: MarcaService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.marcaService.getMarcas();
    this.marcaService.mostrarForm = false;
    this.marcaService.idFieldReadOnly = false;
    this.resetForm();
  }

  onSubmit(marcaForm: NgForm)
  {
    if(marcaForm.value.$key == null)
      this.marcaService.insertMarca(marcaForm.value);
    else
      this.marcaService.updateMarca(marcaForm.value);
    
    this.resetForm(marcaForm);
    this.toastr.success('Operación Terminada', 'Marca Registrada');

   //oculta el formulario
   this.marcaService.mostrarForm = false;
   this.msj_enlace = 'Marcas';
  }

  resetForm(marcaForm?: NgForm)
  {
    if(marcaForm != null)
    marcaForm.reset();
      this.marcaService.selectedMarca = new Marca();
      this.marcaService.idFieldReadOnly = false;
  }

  //mostrar: boolean = false;
  public msj_enlace: string = 'Marcas';

  moForm(){
      if (this.marcaService.mostrarForm){
        this.marcaService.mostrarForm = false;
        this.marcaService.idFieldReadOnly = true;
        this.resetForm();
        this.msj_enlace = 'Marcas';
      }else{
        this.marcaService.mostrarForm = true;
        this.marcaService.idFieldReadOnly = false;
        this.msj_enlace = '';
      }
  }

}
