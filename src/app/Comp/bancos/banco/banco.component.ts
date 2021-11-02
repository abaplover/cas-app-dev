import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//  Service 
import { BancoService } from '../../../services/banco.service';

// Class
import { Banco } from '../../../models/banco';

// toastr
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-banco',
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.css']
})
export class BancoComponent implements OnInit {
  public get bancoService(): BancoService {
    return this._bancoService;
  }
  public set bancoService(value: BancoService) {
    this._bancoService = value;
  }

  constructor(
    private _bancoService: BancoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.bancoService.getBancos();
    this.bancoService.mostrarForm = false;
    this.bancoService.idFieldReadOnly = false;
    this.resetForm();
  }

  onSubmit(bancoForm: NgForm)
  {
    if(bancoForm.value.$key == null)
      this.bancoService.insertBanco(bancoForm.value);
    else
      this.bancoService.updateBanco(bancoForm.value);
    
    this.resetForm(bancoForm);
    this.toastr.success('Operación Terminada', 'Banco Registrado');

   //oculta el formulario
   this.bancoService.mostrarForm = false;
   this.msj_enlace = 'Bancos';
  }

  resetForm(bancoForm?: NgForm)
  {
    if(bancoForm != null)
    bancoForm.reset();
      this.bancoService.selectedBanco = new Banco();
      this.bancoService.idFieldReadOnly = false;
  }

  //mostrar: boolean = false;
  public msj_enlace: string = 'Bancos';

  moForm(){
      if (this.bancoService.mostrarForm){
        this.bancoService.mostrarForm = false;
        this.bancoService.idFieldReadOnly = true;
        this.resetForm();
        this.msj_enlace = 'Bancos';
      }else{
        this.bancoService.mostrarForm = true;
        this.bancoService.idFieldReadOnly = false;
        this.msj_enlace = '';
      }
  }

}
