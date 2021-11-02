import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';


//  Service 
import { ClientService } from '../../../services/client.service';
import { IimpuestoService } from '../../../services/iimpuesto.service';
import { IretencionService } from '../../../services/iretencion.service';
import { ZventaService } from '../../../services/zventa.service';
import { LprecioService } from '../../../services/lprecio.service';

// Class
import { Client } from '../../../models/client';
import { Iimpuesto } from '../../../models/iimpuesto';
import { Iretencion } from '../../../models/iretencion';
import { Zventa } from '../../../models/zventa';
import { Lprecio } from '../../../models/lprecio';

// toastr
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})



export class ClientComponent implements OnInit {
  public get clientService(): ClientService {
    return this._clientService;
  }
  public set clientService(value: ClientService) {
    this._clientService = value;
  }
  
  zonasList: Zventa[]; //arreglo vacio
  iimpuestosList: Iimpuesto[]; //arreglo vacio
  iretencionesList: Iretencion[]; //arreglo vacio
  lpreciosList: Lprecio[]; //arreglo vacio

  constructor(
    private _clientService: ClientService,
    private toastr: ToastrService,
    public zonavS : ZventaService,
    public iimpuestoS : IimpuestoService,
    public iretencionS : IretencionService,
    public lprecioS: LprecioService
  ) {}

  ngOnInit() {

    //console.log('aca3 ', this.clientService.selectedClient.$key);

    this.clientService.getClients();
    this.clientService.mostrarForm = false;
    this.clientService.idFieldReadOnly = true;
    this.resetForm();

    this.zonavS.getZventas().valueChanges().subscribe(zv =>{
      this.zonasList = zv;
    })

    this.iimpuestoS.getIimpuestos().valueChanges().subscribe(ii =>{
      this.iimpuestosList = ii;
    })

    this.iretencionS.getIretencions().valueChanges().subscribe(ir =>{
      this.iretencionesList = ir;
    })

    this.lprecioS.getLprecio().valueChanges().subscribe(lp =>{
      this.lpreciosList = lp;
    })
}

  onSubmit(clientForm: NgForm)
  {
    if(clientForm.value.$key == null)
      this.clientService.insertClient(clientForm.value);
    else
      this.clientService.updateClient(clientForm.value);
    
    this.resetForm(clientForm);
    this.toastr.success('Operación Terminada', 'Cliente Registrado');
    //oculta el formulario
    this.clientService.mostrarForm = false;
    this.msj_enlace = 'Clientes';
  }

  resetForm(clientForm?: NgForm)
  {
    if(clientForm != null)
    clientForm.reset();
    this.clientService.selectedClient = new Client();
    this.clientService.idFieldReadOnly = false;
  }

  //mostrar: boolean = false;
  public msj_enlace: string = 'Clientes';

   moForm(){
      if (this.clientService.mostrarForm){
        this.clientService.mostrarForm = false;
        this.clientService.idFieldReadOnly = true;
        this.resetForm();
        this.msj_enlace = 'Clientes';
      }else{
        this.clientService.mostrarForm = true;
        this.clientService.idFieldReadOnly = false;
        this.msj_enlace = '';
      }
  }

  

 

}
