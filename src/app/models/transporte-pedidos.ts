import { Pedido } from './pedido'

export class TransportePedidos {
	id?: string;
	fecha?: string;
	compania?: string;
	chofer?: string;
	vehiculo?: string;
	placa?: string;
	cedula?:string;
	tasa?: number;
	estatus?: string;
	fechaCierre?: string;
	totalPedidos?: number;
	totalBultos?: number;
	totalUSD?: number;
	totalBsF?: number;
	comisionUSD?: number;
	comisionBsF?: number;
	pedido?: any;
	creadorPor?: string;
	creadoEn?: string;
	ModificadoPor?: string;
	ModificadoEn?: string
}