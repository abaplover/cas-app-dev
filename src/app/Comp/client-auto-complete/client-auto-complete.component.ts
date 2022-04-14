import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Client } from 'src/app/models/client';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-client-auto-complete',
  templateUrl: './client-auto-complete.component.html',
  styleUrls: ['./client-auto-complete.component.css']
})
export class ClientAutoCompleteComponent implements OnInit {
  public clienteList: Client[]; //arreglo vacio
  public keywordCli = "descripcion";
  constructor(
    public clienteS     : ClientService,
  ) { }

  @Output() SelectedValue = new EventEmitter<string>();
  ngOnInit(): void {
    this.clienteS.getClients().valueChanges().subscribe(cs =>{
      this.clienteList = cs;
    })
  }

  onChangeSearch(val: string) {
    //console.log('aqui: ',val);
    // this.pedidoService.pedido_.idcliente = val;


  }//onChangeSearch
  selectEvent(elemento){
    const val = elemento.idcliente;
    this.SelectedValue.emit(val);

    }
  }//selectEvent

