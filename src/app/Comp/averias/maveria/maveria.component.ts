import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//  Service 
import { MaveriaService } from '../../../services/maveria.service';

// Class
import { Maveria } from '../../../models/maveria';

// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-maveria',
  templateUrl: './maveria.component.html',
  styleUrls: ['./maveria.component.css']
})
export class MaveriaComponent implements OnInit {
  public get maveriaService(): MaveriaService {
    return this._maveriaService;
  }
  public set maveriaService(value: MaveriaService) {
    this._maveriaService = value;
  }

  constructor(
    private _maveriaService: MaveriaService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.maveriaService.getMaverias();
    this.maveriaService.idFieldReadOnly = false;
    this.resetForm();
  }

  onSubmit(maveriaForm: NgForm)
  {
    if(maveriaForm.value.$key == null)
      this.maveriaService.insertMaveria(maveriaForm.value);
    else
      this.maveriaService.updateMaveria(maveriaForm.value);
    
    this.resetForm(maveriaForm);
    this.toastr.success('Operación Terminada', 'Motivos de averías Registrada');

    //oculta el formulario
    this.maveriaService.mostrarForm = false;
    this.msj_enlace = 'Motivos de Avería';
  }

  resetForm(maveriaForm?: NgForm)
  {
    if(maveriaForm != null)
      maveriaForm.reset();
    this.maveriaService.selectedMaveria = new Maveria();
    this.maveriaService.idFieldReadOnly = false;
  }

   //mostrar: boolean = false;
   public msj_enlace: string = 'Motivos de Avería';

   moForm(){
      if (this.maveriaService.mostrarForm){
        this.maveriaService.mostrarForm = false;
        this.maveriaService.idFieldReadOnly = true;
        this.resetForm();
        this.msj_enlace = 'Motivos de Avería';
      }else{
        this.maveriaService.mostrarForm = true;
        this.maveriaService.idFieldReadOnly = false;
        this.msj_enlace = '';
      }
  }

}
