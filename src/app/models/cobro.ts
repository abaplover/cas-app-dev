export interface Cobro {
	uid?				   :string;
	idpedido?	           :number; 
	nrofactura?            :string;
	condiciondepago?       :string;
	fpvencimiento?         :Date;
	idcliente?	           :string;
	nomcliente?	           :string;
	emailcliente?          :string;
	companyhead?            :string;
	idvendedor?	           :string;
	nomvendedor?	       :string;
	totalmontobruto?	   :number;
	totalmontodescuento?   :number;
	totalmontoimpuesto?    :number;
	totalmontoneto?		   :number;
	creado?				   :Date;
	creadopor?			   :string;
	modificado?			   :Date;
	modificadopor?         :string;
	pdfb64?                :string;
	tipopago?              :string;
	fechadepago?           :Date;
	viadepago?             :string;
    banco?                 :string;
	nroreferencia?         :string;
	montodepago?           :number;
    demora?                :string; /* Si fecha de vencimiento es mayor a fecha de pago = S, si no = vacio*/
	observacion?           :string;
	status?				   :string;
	statuscobro?		   :string;
	lastnotifsend?         :Date;
	sendmail?              :boolean;
}
