export interface Cobro {
	uid?				   :string;
	banco?                 :string;
	creado?				   :Date;
	creadopor?			   :string;
	fechadepago?           :Date;
	idpedido?	           :number; 
	modificado?			   :Date;
	modificadopor?         :string;
	moneda?				   :string;
	montodepago?           :number;
	montobsf?			   :number;
	pdfb64?                :string;
	tipodoc?			   :string; //Tipo de documento de pedido
	tipopago?              :string;
	viadepago?             :string;
	lastnotifsend?         :Date;
	sendmail?              :boolean;
	status?				   :string;

}
