import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import { RippleRef } from '@angular/material/core';
//import{AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
//import{observable} from 'rxjs';
//import{ map } from 'rxjs';
// Model

import { Client } from '../models/client';

@Injectable()
export class ClientService {

  clientList: AngularFireList<any>;
  selectedClient: Client = new Client();
  mostrarForm: boolean = false;
  idFieldReadOnly = false;

  constructor(private firebase: AngularFireDatabase) { }


  getClients()
  {
    return this.clientList = this.firebase.list('clients');
  }

  insertClient(client: Client)
  {
    this.clientList.push({
      idcliente  : client.idcliente,
      descripcion: client.descripcion,
      idesc      : client.idcliente +' - '+ client.descripcion, 
      direccion  : client.direccion,
      telefonom  : client.telefonom,
      telefonof  : client.telefonof,
      email      : client.email,
      iimpuesto  : client.iimpuesto,
      iretencion : client.iretencion,
      zona       : client.zona,
      listaprecio: client.listaprecio,
      rif        : client.idcliente //Anterior mente era client.rif, pero se deinio que ID=RIF
    });
  }

  updateClient(client: Client)
  {
    this.clientList.update(client.$key, {
      idcliente  : client.idcliente,
      descripcion: client.descripcion,
      idesc      : client.idcliente +' - '+ client.descripcion, 
      direccion  : client.direccion,
      telefonom  : client.telefonom,
      telefonof  : client.telefonof,
      email      : client.email,
      iimpuesto  : client.iimpuesto,
      iretencion : client.iretencion,
      zona       : client.zona,
      listaprecio: client.listaprecio,
      rif        : client.idcliente //Anterior mente era client.rif, pero se deinio que ID=RIF
    });
  }

  deleteClient($key: string)
  {
    this.clientList.remove($key);
  }

}
