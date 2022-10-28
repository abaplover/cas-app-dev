import { Pedido} from './pedido'

export class TransportePedidos{
	id?			: string;
	fecha?		: string;
	compania?	: string;
	chofer?		: string;
	vehiculo?    : string;
	placa?       : string;
	tasa?		: number;
	estatus?		: string;
	fechaCierre?	: string;
	totalPedidos?: number;
	totalUSD?	: number;
	totalBsF?	: number;	
	comisionUSD? : number;
	comisionBsF?: number;	
	pedido?		: any;
}