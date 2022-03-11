export interface PedidoDet{
	uid?				: string;
	idpedido?	        : string; 
	codigodematerial?   : string;
	descripcionmaterial?: string;
	cantidadmaterial?   : number;
	unidaddemedida?     : string;
	preciomaterial?	    : number;
	totalpormaterial?   : number;
	indice?             :number;
	materialpreparado?	:boolean;
}