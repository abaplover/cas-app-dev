import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

//  Service 
import { VendedorService } from '../../../services/vendedor.service';
import { ZventaService } from '../../../services/zventa.service';

// Class
import { Vendedor } from '../../../models/vendedor';
import { Zventa } from '../../../models/zventa';

// toastr
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-vendedor',
  templateUrl: './vendedor.component.html',
  styleUrls: ['./vendedor.component.css']
})
export class VendedorComponent implements OnInit {

  //ZventaService: any;
  
  public get vendedorService(): VendedorService {
    return this._vendedorService;
  }
  public set vendedorService(value: VendedorService) {
    this._vendedorService = value;
  }

  zonasList: Zventa[]; //arreglo vacio
 


  constructor(
    private _vendedorService: VendedorService,
    private toastr: ToastrService,
    public ZventaService : ZventaService
  ) { }

  ngOnInit() {
    this.vendedorService.getVendedors();
    this.vendedorService.mostrarForm = false;
    this.vendedorService.idFieldReadOnly = false;
    //this.zventa.getZventas;
    this.resetForm();
    //this.zonasList = this.zventa.getZventas();

    this.ZventaService.getZventas().valueChanges().subscribe(zv =>{
      this.zonasList =zv;
    })


  }

  onSubmit(vendedorForm: NgForm)
  {
    if(vendedorForm.value.$key == null)
      this.vendedorService.insertVendedor(vendedorForm.value);
    else
      this.vendedorService.updateVendedor(vendedorForm.value);
    
    this.resetForm(vendedorForm);
    this.toastr.success('Operación Terminada', 'Vendedor/a Registrado/a');
    //oculta el formulario
    this.vendedorService.mostrarForm = false;
    this.msj_enlace = 'Vendedores';
  }

  resetForm(vendedorForm?: NgForm)
  {
    if(vendedorForm != null)
    vendedorForm.reset();
    this.vendedorService.selectedVendedor = new Vendedor();
    this.vendedorService.idFieldReadOnly = false;
  }
    //mostrar: boolean = false;
    public msj_enlace: string = 'Vendedores';

    moForm(){
       if (this.vendedorService.mostrarForm){
         this.vendedorService.mostrarForm = false;
         this.vendedorService.idFieldReadOnly = true;
         this.resetForm();
         this.msj_enlace = 'Vendedores';
       }else{
         this.vendedorService.mostrarForm = true;
         this.vendedorService.idFieldReadOnly = false;
         this.msj_enlace = '';
       }
   }

}

