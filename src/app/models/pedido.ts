//export class Pedido {
export interface Pedido {
  uid?: string;
  cantidadmaterial?: number;
  clientedir?: string;
  codeBlock?: string;
  codigodematerial?: string;
  companyblk?: string;
  companycod?: string;
  companydir?: string;
  condiciondepago?: string;
  creado?: Date;
  creadopor?: string;
  descripcionmaterial?: string;
  descuentoporc?: number;
  descuentovalor?: number;
  email?: string;
  fdespacho?: Date;
  fechapedido?: Date;
  fentrega?: Date;
  ffactura?: Date;
  fpago?: Date;
  fpreparacion?:Date;
  ftentrega?: Date;
  idcliente?: string;
  idpedido?: number; //
  idvendedor?: string;
  indicadorImpuestodesc?  : string;
  indicadorImpuestoporc?  : number;
  lastaction?             : string;
  listaprecio?            : string;
  modificado?             : Date;
  modificadopor?          : string;
  montodepago?            :number; //Monto pagado (cobros)
  motivorechazo?          : string;
  nombrealmacenista?      :string;
  nomcliente?             : string;
  nomvendedor?            : string;
  nrobultos?              :number;
  nrofactura?: string;
  observacion?: string;
  pdfb64?: string;
  pdfname?: string;
  pdfurl?: string;
  platform?: string;
  precioasociado?: string;
  preciomaterial?: number;
  status?: string;
  statuscobro?    : string;
  ticketurl?: string;
  tipodoc?: string;
  totalCnt?: number;
  totalmontobruto?: number;
  totalmontodescuento?: number;
  totalmontoimpuesto?: number;
  totalmontoneto?: number;
  totalPed?: number;
  totalpormaterial?: number;
  totalPri?: number;
  transporte?: string;
  unidaddemedida?: string;
}
