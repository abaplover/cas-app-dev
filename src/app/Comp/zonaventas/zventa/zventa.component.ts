import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//  Service 
import { ZventaService } from '../../../services/zventa.service';

// Class
import { Zventa } from '../../../models/zventa';

// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-zventa',
  templateUrl: './zventa.component.html',
  styleUrls: ['./zventa.component.css']
})
export class ZventaComponent implements OnInit {
  public get zventaService(): ZventaService {
    return this._zventaService;
  }
  public set zventaService(value: ZventaService) {
    this._zventaService = value;
  }

  constructor(
    private _zventaService: ZventaService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.zventaService.getZventas();
    this.zventaService.mostrarForm = false;
    this.zventaService.idFieldReadOnly = false;
    this.resetForm();
  }

  onSubmit(zventaForm: NgForm)
  {
    if(zventaForm.value.$key == null)
      this.zventaService.insertZventa(zventaForm.value);
    else
      this.zventaService.updateZventa(zventaForm.value);
    
    this.resetForm(zventaForm);
    this.toastr.success('Operación Terminada', 'Zventa Registrada');
   //oculta el formulario
   this.zventaService.mostrarForm = false;
   this.msj_enlace = 'Zona de Ventas';
  }

  resetForm(zventaForm?: NgForm)
  {
    if(zventaForm != null)
    zventaForm.reset();
    this.zventaService.selectedZventa = new Zventa();
    this.zventaService.idFieldReadOnly = false;
  }

 //mostrar: boolean = false;
 public msj_enlace: string = 'Zona de Ventas';

 moForm(){
     if (this.zventaService.mostrarForm){
        this.zventaService.mostrarForm = false;
        this.zventaService.idFieldReadOnly = true;
        this.resetForm();
        this.msj_enlace = 'Zona de Ventas';

     }else{
      this.zventaService.idFieldReadOnly = false;
       this.zventaService.mostrarForm = true;
       this.msj_enlace = '';
     }
 }

}

