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
	nomcliente			   :string;
	nomvendedor			   :string;
	nrofacturapedido	   :string;
	pdfb64?                :string;
	tipodoc?			   :string; //Tipo de documento de cobro 
	tipopago?              :string;
	viadepago?             :string;
	lastnotifsend?         :Date;
	sendmail?              :boolean;
	status?				   :string;
	tipodocpedido		   :string; //Tipo de documento de pedido

}
