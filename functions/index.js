const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// db.collection('pedidosDet').doc('0Yh7jsdS8o608pJe5Eb5').then(doc => {
//     if (!doc.exists) {
//         console.log("Error leyendo documento de documento");
//     } else {
//         // Aquí puedes leer los documentos
//     }
// })


//user: "CasRicamar@gmail.com",
//pass: "Ricamarcas123*"

const transport = nodemailer.createTransport({

	//==========================1============================
	host: 'smtp.office365.com',
    port: 465,
    secure: false,
	auth: {
		user: "cas@ricamar.com.ve",
		pass: "CasRicamar228094#*"
	},
        tls: {
            ciphers: 'SSLv3'
        }
	//==========================1============================

	//==========================2============================
		//Usuario Email           : ricamarcloud@gmail.com
		//Contrasena Email        : wswgubuyeffbqasd
		//Contrasena de Aplicacion: ouqffxswjaulvywz

		// host: 'smtp.gmail.com',
		// port: 465,
		// secure: true,
		// auth: {
		// 	user: "ricamarcloud@gmail.com",
		// 	pass: "ouqffxswjaulvywz"
		// }
	//==========================2============================

	//==========================3============================
	// host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
	// auth: {
	// 	user: "yhonatandcarruido@gmail.com",
	// 	pass: "wswgubuyeffbqasd"
	// }
	//==========================3============================
})

//CUANDO SE CREA UN PEDIDO
exports.Pedmail = functions.firestore.document("pedidos/{id}").onCreate((snap,context)=>{
	let saludo_ = "Gracias por su compra.";
	const email = snap.data().email;
	const name = snap.data().nomcliente;
	const pedUid =  context.params.id;
	const tmn = snap.data().totalmontoneto;
	const codc = snap.data().idcliente;
	const nomc = snap.data().nomcliente;
	const codv = snap.data().idvendedor;
	const nomv = snap.data().nomvendedor;
	const cond = snap.data().condiciondepago;
	const codeBlock_ = snap.data().codeBlock;
	const companyBkl_ = snap.data().companyblk;
	const clientedir_ = snap.data().clientedir;
	const totalmontobruto_ = snap.data().totalmontobruto;
	const totalmontodescuento_ = snap.data().totalmontodescuento;
	const totalmontoimpuesto_ = snap.data().totalmontoimpuesto;
	const totalmontoneto_ = snap.data().totalmontoneto;
	const pdfurl_ = snap.data().pdfurl;
	const pdfname_ = snap.data().pdfname;
	const pdfb64_ = snap.data().pdfb64;
	const asunto = "Nuevo Pedido, Nro ";
	const bodytxt = "Confirmación de pedido";
	let fechapago = '';
	const idpedido_ = snap.data().idpedido;
	let bodyFecha_="";

	let observ_ = snap.data().observacion;

	if (typeof observ_ === "undefined"){
		observ_ = "";
	}


	let dateObjectT = new Date(snap.data().fechapedido.seconds*1000);
	// set getTime=milisegundos - (diferencia horarioa = 240 min) * 60 * 1000 para convertirlo en milisegundos
	dateObjectT.setTime(dateObjectT.getTime() - 240 * 60 * 1000);

	var month 	 = new Array();
		month[0] = "01";
		month[1] = "02";
		month[2] = "03";
		month[3] = "04";
		month[4] = "05";
		month[5] = "06";
		month[6] = "07";
		month[7] = "08";
		month[8] = "09";
		month[9] = "10";
		month[10] = "11";
		month[11] = "12";

	let min_ = dateObjectT.getMinutes();
	var horas = new Array();
		horas [0]  = "12:" + min_ + " PM";
		horas [23] = "11:" + min_ + " PM";
		horas [22] = "10:" + min_ + " PM";
		horas [21] = "09:" + min_ + " PM";
		horas [20] = "08:" + min_ + " PM";
		horas [19] = "07:" + min_ + " PM";
		horas [18] = "06:" + min_ + " PM";
		horas [17] = "05:" + min_ + " PM";
		horas [16] = "04:" + min_ + " PM";
		horas [15] = "03:" + min_ + " PM";
		horas [14] = "02:" + min_ + " PM";
		horas [13] = "01:" + min_ + " PM";
		horas [12] = "12:" + min_ + " AM";
		horas [11] = "11:" + min_ + " AM";
		horas [10] = "10:" + min_ + " AM";
		horas [9] = "09:" + min_ + " AM";
		horas [8] = "08:" + min_ + " AM";
		horas [7] = "07:" + min_ + " AM";
		horas [6] = "06;" + min_ + " AM";
		horas [5] = "05:" + min_ + " AM";
		horas [4] = "04:" + min_ + " AM";
		horas [3] = "03:" + min_ + " AM";
		horas [2] = "02:" + min_ + " AM";
		horas [1] = "01:" + min_ + " AM";
	//getTimezoneOffset
	let mes_ = month[dateObjectT.getMonth()];
    let ano_ = dateObjectT.getFullYear();
	let dia_ = dateObjectT.getDate();
	let hor_ = horas[dateObjectT.getHours()];

	let seg_ = dateObjectT.toUTCString();

	//const fped = new Date(dateObjectT).toLocaleString('es-VE');
	const fped = dia_+'/'+mes_+'/'+ano_+' '+hor_;

	var mailOptions = {
		html: 'Embedded image: <img src="cid:apollcasapp1550raf"/>',
		attachments: [
			{
				filename: 'noimage.png',
				path: '/img/',
				cid: 'apollcasapp1550raf' //same cid value as in the html img src
			}
		]
	}

	return sendpedidomail(email,name,pedUid,tmn,fped,mailOptions,codc,nomc,codv,nomv,cond,codeBlock_,companyBkl_,clientedir_,totalmontobruto_,totalmontodescuento_,totalmontoimpuesto_,totalmontoneto_,observ_,pdfurl_,pdfname_,pdfb64_,asunto,bodytxt,fechapago,saludo_,idpedido_,bodyFecha_);
});//Pedmail

//CUANDO SE MODIFICA UN PEDIDO
exports.PedmailUp = functions.firestore.document("pedidos/{id}").onUpdate((change,context)=>{

	let saludo_ = "Gracias por su compra.";
	const newValue = change.after.data();
	const email = newValue.email;
	const name = newValue.nomcliente;
	const pedUid =  context.params.id;
	const tmn = newValue.totalmontoneto;
	const codc = newValue.idcliente;
	const nomc = newValue.nomcliente;
	const codv = newValue.idvendedor;
	const nomv = newValue.nomvendedor;
	const cond = newValue.condiciondepago;
	const codeBlock_ = newValue.codeBlock;
	const companyBkl_ = newValue.companyblk;
	const clientedir_ = newValue.clientedir;
	const totalmontobruto_ = newValue.totalmontobruto;
	const totalmontodescuento_ = newValue.totalmontodescuento;
	const totalmontoimpuesto_ = newValue.totalmontoimpuesto;
	const totalmontoneto_ = newValue.totalmontoneto;
	const pdfurl_ = newValue.pdfurl;
	const pdfname_ = newValue.pdfname;
	const pdfb64_ = newValue.pdfb64;
	const ffactura_ = newValue.ffactura;
	const nrofactura_ = newValue.nrofactura;
	const fentrega_ = newValue.fentrega;
	const lastaction_ = newValue.lastaction;
	const idpedido_ = newValue.idpedido;
	const status_ = newValue.status;
	const tipodoc_ = newValue.tipodoc;

	let asunto = "Modificación de pedido, Nro ";
	let bodytxt = "Modificación de pedido";
	let bodyFecha_ = "";

	let observ_ = newValue.observacion;

	if (typeof observ_ === "undefined"){
		observ_ = "";
	}

	let fpago_;
	if (typeof newValue.fpago !== "undefined"){
		fpago_ = new Date(newValue.fpago.seconds*1000);
		fpago_.setTime(fpago_.getTime() - 240 * 60 * 1000);
	}

	// set getTime=milisegundos - (diferencia horarioa = 240 min) * 60 * 1000 para convertirlo en milisegundos
	let dateObjectT = new Date(newValue.fechapedido.seconds*1000);
	dateObjectT.setTime(dateObjectT.getTime() - 240 * 60 * 1000);

	var month 	 = new Array();
		// month[0] = "Enero";
		// month[1] = "Febrero";
		// month[2] = "Marzo";
		// month[3] = "Abril";
		// month[4] = "Mayo";
		// month[5] = "Junio";
		// month[6] = "Julio";
		// month[7] = "Agosto";
		// month[8] = "Septiembre";
		// month[9] = "Octubre";
		// month[10] = "Noviembre";
		// month[11] = "Diciembre";
		month[0]  = "01";
		month[1]  = "02";
		month[2]  = "03";
		month[3]  = "04";
		month[4]  = "05";
		month[5]  = "06";
		month[6]  = "07";
		month[7]  = "08";
		month[8]  = "09";
		month[9]  = "10";
		month[10] = "11";
		month[11] = "12";

	let min_ = dateObjectT.getMinutes();
	var horas = new Array();
		horas [0]  = "12:" + min_ + " PM";
		horas [23] = "11:" + min_ + " PM";
		horas [22] = "10:" + min_ + " PM";
		horas [21] = "09:" + min_ + " PM";
		horas [20] = "08:" + min_ + " PM";
		horas [19] = "07:" + min_ + " PM";
		horas [18] = "06:" + min_ + " PM";
		horas [17] = "05:" + min_ + " PM";
		horas [16] = "04:" + min_ + " PM";
		horas [15] = "03:" + min_ + " PM";
		horas [14] = "02:" + min_ + " PM";
		horas [13] = "01:" + min_ + " PM";
		horas [12] = "12:" + min_ + " AM";
		horas [11] = "11:" + min_ + " AM";
		horas [10] = "10:" + min_ + " AM";
		horas [9]  = "09:" + min_ + " AM";
		horas [8]  = "08:" + min_ + " AM";
		horas [7]  = "07:" + min_ + " AM";
		horas [6]  = "06;" + min_ + " AM";
		horas [5]  = "05:" + min_ + " AM";
		horas [4]  = "04:" + min_ + " AM";
		horas [3]  = "03:" + min_ + " AM";
		horas [2]  = "02:" + min_ + " AM";
		horas [1]  = "01:" + min_ + " AM";
	//getTimezoneOffset
	let mes_ = month[dateObjectT.getMonth()];
    let ano_ = dateObjectT.getFullYear();
	let dia_ = dateObjectT.getDate();
	let hor_ = horas[dateObjectT.getHours()];
	let seg_ = dateObjectT.toUTCString();
	const fped = dia_+'/'+mes_+'/'+ano_+' '+hor_;

	let fpmes_;
	let fpano_;
	let fpdia_;
	let fechapago = '';
	let fechapago2 = '';
	if (typeof newValue.fpago !== "undefined"){
		fpmes_ = month[fpago_.getMonth()];
    	fpano_ = fpago_.getFullYear();
		fpdia_ = fpago_.getDate();
		fechapago = 'Recuerde pagar antes del ' + fpdia_+'/'+fpmes_+'/'+fpano_;
		fechapago2 = fpdia_+'/'+fpmes_+'/'+fpano_;
	}

	let fdespachomes_;
	let fdespachoano_;
	let fdespachodia_;
	let fecDespacho_ = '';
	let fdespacho_;
	if (typeof newValue.fdespacho !== "undefined"){
		fdespacho_ = new Date(newValue.fdespacho.seconds*1000);
		fdespacho_.setTime(fdespacho_.getTime() - 240 * 60 * 1000);

		fdespachomes_ = month[fdespacho_.getMonth()];
    	fdespachoano_ = fdespacho_.getFullYear();
		fdespachodia_ = fdespacho_.getDate();
		fecDespacho_ = fdespachodia_+'/'+fdespachomes_+'/'+fdespachoano_;
	}

	let ftentregames_;
	let ftentregaano_;
	let ftentregadia_;
	let fectentrega_ = '';
	let ftentrega_;
	if (typeof newValue.ftentrega !== "undefined"){
		ftentrega_ = new Date(newValue.ftentrega.seconds*1000);
		ftentrega_.setTime(ftentrega_.getTime() - 240 * 60 * 1000);

		ftentregames_ = month[ftentrega_.getMonth()];
    	ftentregaano_ = ftentrega_.getFullYear();
		ftentregadia_ = ftentrega_.getDate();
		fectentrega_ = ftentregadia_+'/'+ftentregames_+'/'+ftentregaano_;
	}

	var mailOptions = {
		html: 'Embedded image: <img src="cid:apollcasapp1550raf"/>',
		attachments: [
			{
				filename: 'noimage.png',
				path: '/img/',
				cid: 'apollcasapp1550raf' //same cid value as in the html img src
			}
		]
	}
	let enviar = false;
	if (typeof fped !== "undefined"){
		enviar = true;
	}

	if (typeof ffactura_ !== "undefined" && typeof nrofactura_ !== "undefined" && lastaction_ === "Crear NF"){
		asunto = "Confirmación de Factura, Nro ";
		bodytxt = "Confirmación de Factura";
		bodyFecha_ = "Documento: " + tipodoc_ + "N°: " +nrofactura_;
		enviar = true;
	}

	if (typeof fdespacho_ !== "undefined" && typeof fdespacho_ !== "undefined"  && lastaction_ === "Crear ND"){
		asunto = "Confirmación de Despacho, Nro ";
		bodytxt = "Confirmación de Despacho";
		bodyFecha_ = "Fecha de despacho: " + fecDespacho_ + "<br />Fecha tentativa de entrega: " + fectentrega_;
		enviar = true;
	}

	if (typeof fentrega_ !== "undefined" && typeof fentrega_ !== "undefined" && lastaction_ === "Crear NE"){
		asunto = "Confirmación de Entrega, Nro ";
		bodytxt = "Confirmación de Entrega";
		bodyFecha_ = "Fecha de entrega:  " + fectentrega_ + "<br />Fecha de Vencimiento: " + fechapago2;
		enviar = true;
	}

	if (status_ === "ELIMINADO"){
		asunto = "Pedido Eliminado. Nro ";
		bodytxt = newValue.motivorechazo;
		saludo_ = "Pedido Eliminado.";
		enviar = true;
	}

	if (enviar){
		enviar = false;
		return sendpedidomail(email,name,pedUid,tmn,fped,mailOptions,codc,nomc,codv,nomv,cond,codeBlock_,companyBkl_,clientedir_,totalmontobruto_,totalmontodescuento_,totalmontoimpuesto_,totalmontoneto_,observ_,pdfurl_,pdfname_,pdfb64_,asunto,bodytxt,fechapago,saludo_,idpedido_,bodyFecha_);
	}else{
		enviar = false;
		return false;
	}
}) //PedmailUp

//CUANDO SE MODIFICA UNA COBRO
exports.CobroemailUp = functions.firestore.document("cobros/{id}").onUpdate((change,context)=>{
	let saludo_ = "Gracias por su compra.";
	const newValue = change.after.data();
	const email = newValue.emailcliente;
	const name = newValue.nomcliente;
	const pdfb64_ = newValue.pdfb64;
	const nfactura_ = newValue.nrofactura;
	const idpedido_ = newValue.idpedido;
	const enviaremail = newValue.sendmail;
	const companyhead_ = newValue.companyhead;
	const fvto_ = newValue.fpvencimiento;

	let pdfname_ = idpedido_+".pdf";
	asunto = "Recordatorio de Pago, Pedido N° "+ idpedido_;
	bodytxt = "Estimado " + name + ", usted presenta un pago pendiente correspondiente al pedido N° "+idpedido_ + ", con nota de entrega/factura N° " + nfactura_;
	let enviar = false;

	let dateObjectT = new Date(fvto_*1000);
	dateObjectT.setTime(dateObjectT.getTime() - 240 * 60 * 1000);

	var month 	  = new Array();
		month[0]  = "01";
		month[1]  = "02";
		month[2]  = "03";
		month[3]  = "04";
		month[4]  = "05";
		month[5]  = "06";
		month[6]  = "07";
		month[7]  = "08";
		month[8]  = "09";
		month[9]  = "10";
		month[10] = "11";
		month[11] = "12";

	let min_ = dateObjectT.getMinutes();
	var horas = new Array();
	horas [0]  = "12:" + min_ + " PM";
	horas [23] = "11:" + min_ + " PM";
	horas [22] = "10:" + min_ + " PM";
	horas [21] = "09:" + min_ + " PM";
	horas [20] = "08:" + min_ + " PM";
	horas [19] = "07:" + min_ + " PM";
	horas [18] = "06:" + min_ + " PM";
	horas [17] = "05:" + min_ + " PM";
	horas [16] = "04:" + min_ + " PM";
	horas [15] = "03:" + min_ + " PM";
	horas [14] = "02:" + min_ + " PM";
	horas [13] = "01:" + min_ + " PM";
	horas [12] = "12:" + min_ + " AM";
	horas [11] = "11:" + min_ + " AM";
	horas [10] = "10:" + min_ + " AM";
	horas [9]  = "09:" + min_ + " AM";
	horas [8]  = "08:" + min_ + " AM";
	horas [7]  = "07:" + min_ + " AM";
	horas [6]  = "06;" + min_ + " AM";
	horas [5]  = "05:" + min_ + " AM";
	horas [4]  = "04:" + min_ + " AM";
	horas [3]  = "03:" + min_ + " AM";
	horas [2]  = "02:" + min_ + " AM";
	horas [1]  = "01:" + min_ + " AM";
	//getTimezoneOffset
	let mes_ = month[dateObjectT.getMonth()];
    let ano_ = dateObjectT.getFullYear();
	let dia_ = dateObjectT.getDate();
	let hor_ = horas[dateObjectT.getHours()];
	let seg_ = dateObjectT.toUTCString();
	const fvencimiento_ = dia_+'/'+mes_+'/'+ano_;

	if (enviaremail === true){
		enviar = true;
	}

	var mailOptions = {
		html: 'Embedded image: <img src="cid:apollcasapp1550raf"/>',
		attachments: [
			{
				filename: 'noimage.png',
				path: '/img/',
				cid: 'apollcasapp1550raf' //same cid value as in the html img src
			}
		]
	}

	if (enviar){
		enviar = false;
		return sendcobromail(email,name,pdfb64_,nfactura_,idpedido_,asunto,bodytxt,pdfname_,companyhead_,fvencimiento_);
	}else{
		enviar = false;
		return false;
	}
}) //CobroemailUp



//CUANDO SE CREA UNA AVERIA
exports.Avemail = functions.firestore.document("averias/{id}").onCreate((snap,context)=>{
	let saludo_ = "Solicitud de Avería";
	const email = snap.data().email;
	const name = snap.data().nomcliente;
	const aveUid =  context.params.id;
	const tmn = snap.data().totalaveria;
	const codc = snap.data().idcliente;
	const nomc = snap.data().nomcliente;
	const codv = snap.data().idvendedor;
	const nomv = snap.data().nomvendedor;
	const codeBlock_ = snap.data().codeBlock;
	const companyBkl_ = snap.data().companyblk;
	const clientedir_ = snap.data().clientedir;
	const pdfurl_ = snap.data().pdfurl;
	const pdfname_ = snap.data().pdfname;
	const pdfb64_ = snap.data().pdfb64;
	const asunto = "Solicitud de avería, Nro ";
	const bodytxt = "";
	const idaveria_ = snap.data().idaveria;
	let bodyFecha_="";
	let txta = "";

	let txtr = ""
	let strtxtr = ""
	let txtc = "";
	let strtxtc = ""
	let nrodocfat = snap.data().nrodocumento;

	let observ_ = snap.data().observacion;

	if (typeof observ_ === "undefined"){
		observ_ = "";
	}




	let dateObjectT = new Date(snap.data().fechaaveria.seconds*1000);
	// set getTime=milisegundos - (diferencia horarioa = 240 min) * 60 * 1000 para convertirlo en milisegundos
	dateObjectT.setTime(dateObjectT.getTime() - 240 * 60 * 1000);

	var month 	 = new Array();
		month[0] = "01";
		month[1] = "02";
		month[2] = "03";
		month[3] = "04";
		month[4] = "05";
		month[5] = "06";
		month[6] = "07";
		month[7] = "08";
		month[8] = "09";
		month[9] = "10";
		month[10] = "11";
		month[11] = "12";

	let min_ = dateObjectT.getMinutes();
	var horas = new Array();
		horas [0]  = "12:" + min_ + " PM";
		horas [23] = "11:" + min_ + " PM";
		horas [22] = "10:" + min_ + " PM";
		horas [21] = "09:" + min_ + " PM";
		horas [20] = "08:" + min_ + " PM";
		horas [19] = "07:" + min_ + " PM";
		horas [18] = "06:" + min_ + " PM";
		horas [17] = "05:" + min_ + " PM";
		horas [16] = "04:" + min_ + " PM";
		horas [15] = "03:" + min_ + " PM";
		horas [14] = "02:" + min_ + " PM";
		horas [13] = "01:" + min_ + " PM";
		horas [12] = "12:" + min_ + " AM";
		horas [11] = "11:" + min_ + " AM";
		horas [10] = "10:" + min_ + " AM";
		horas [9] = "09:" + min_ + " AM";
		horas [8] = "08:" + min_ + " AM";
		horas [7] = "07:" + min_ + " AM";
		horas [6] = "06;" + min_ + " AM";
		horas [5] = "05:" + min_ + " AM";
		horas [4] = "04:" + min_ + " AM";
		horas [3] = "03:" + min_ + " AM";
		horas [2] = "02:" + min_ + " AM";
		horas [1] = "01:" + min_ + " AM";
	//getTimezoneOffset
	let mes_ = month[dateObjectT.getMonth()];
    let ano_ = dateObjectT.getFullYear();
	let dia_ = dateObjectT.getDate();
	let hor_ = horas[dateObjectT.getHours()];

	let seg_ = dateObjectT.toUTCString();

	//const fped = new Date(dateObjectT).toLocaleString('es-VE');
	const fave = dia_+'/'+mes_+'/'+ano_+' '+hor_;

	var mailOptions = {
		html: 'Embedded image: <img src="cid:apollcasapp1550raf"/>',
		attachments: [
			{
				filename: 'noimage.png',
				path: '/img/',
				cid: 'apollcasapp1550raf' //same cid value as in the html img src
			}
		]
	}

	return sendaveriamail(email,name,aveUid,tmn,fave,mailOptions,codc,nomc,codv,nomv,codeBlock_,companyBkl_,clientedir_,observ_,pdfurl_,pdfname_,pdfb64_,asunto,bodytxt,saludo_,idaveria_,bodyFecha_,txta,txtr,txtc,nrodocfat,strtxtr,strtxtc);
});//Averiasmail


//CUANDO SE MODIFICA UNA AVERIA
exports.AvemailUp = functions.firestore.document("averias/{id}").onUpdate((change,context)=>{

	let saludo_ = "Resolución de avería";
	const newValue = change.after.data();
	const email = newValue.email;
	const name = newValue.nomcliente;
	const pedUid =  context.params.id;
	const tmn = newValue.totalaveria;
	const codc = newValue.idcliente;
	const nomc = newValue.nomcliente;
	const codv = newValue.idvendedor;
	const nomv = newValue.nomvendedor;
	const codeBlock_ = newValue.codeBlock;
	const companyBkl_ = newValue.companyblk;
	const clientedir_ = newValue.clientedir;
	const pdfurl_ = newValue.pdfurl;
	const pdfname_ = newValue.pdfname;
	const pdfb64_ = newValue.pdfb64;
	const lastaction_ = newValue.lastaction;
	const idaveria_ = newValue.idaveria;
	const status_ = newValue.status;
	let txta = newValue.txtAveria;
	let txtr = newValue.txtResolucion;
	let strtxtr = "Observaciones de Resolución"
	let txtc = newValue.txtCierre;
	let strtxtc = "Observaciones de Cierre"
	let nrodocfat = newValue.nrodocumento;

	let asunto = "Resolución de avería, Nro ";
	let bodytxt = "";
	let bodyFecha_ = "";

	let observ_ = newValue.observacion;

	if (typeof observ_ === "undefined"){
		observ_ = "";
	}


	if (status_ === "ABIERTA"){
		asunto = "Solicitud de avería, Nro ";
		saludo_ = "Solicitud de avería";
		txtr = "";
		strtxtr = "";
		txtc = "";
		strtxtc = "";
	}
	if (status_ === "PROCESADA"){
		asunto = "Resolución de avería, Nro ";
		saludo_ = "Resolución de avería";
		txtc = "";
		strtxtc = "";
	}
	if (status_ === "CERRADA"){
		asunto = "Cierre de avería, Nro ";
		saludo_ = "Cierre de avería";
		txtr = "";
		strtxtr = "";
	}

	let dateObjectT = new Date(newValue.fechaaveria.seconds*1000);
	dateObjectT.setTime(dateObjectT.getTime() - 240 * 60 * 1000);

	var month 	 = new Array();
		month[0]  = "01";
		month[1]  = "02";
		month[2]  = "03";
		month[3]  = "04";
		month[4]  = "05";
		month[5]  = "06";
		month[6]  = "07";
		month[7]  = "08";
		month[8]  = "09";
		month[9]  = "10";
		month[10] = "11";
		month[11] = "12";

	let min_ = dateObjectT.getMinutes();
	var horas = new Array();
		horas [0]  = "12:" + min_ + " PM";
		horas [23] = "11:" + min_ + " PM";
		horas [22] = "10:" + min_ + " PM";
		horas [21] = "09:" + min_ + " PM";
		horas [20] = "08:" + min_ + " PM";
		horas [19] = "07:" + min_ + " PM";
		horas [18] = "06:" + min_ + " PM";
		horas [17] = "05:" + min_ + " PM";
		horas [16] = "04:" + min_ + " PM";
		horas [15] = "03:" + min_ + " PM";
		horas [14] = "02:" + min_ + " PM";
		horas [13] = "01:" + min_ + " PM";
		horas [12] = "12:" + min_ + " AM";
		horas [11] = "11:" + min_ + " AM";
		horas [10] = "10:" + min_ + " AM";
		horas [9]  = "09:" + min_ + " AM";
		horas [8]  = "08:" + min_ + " AM";
		horas [7]  = "07:" + min_ + " AM";
		horas [6]  = "06;" + min_ + " AM";
		horas [5]  = "05:" + min_ + " AM";
		horas [4]  = "04:" + min_ + " AM";
		horas [3]  = "03:" + min_ + " AM";
		horas [2]  = "02:" + min_ + " AM";
		horas [1]  = "01:" + min_ + " AM";
	//getTimezoneOffset
	let mes_ = month[dateObjectT.getMonth()];
    let ano_ = dateObjectT.getFullYear();
	let dia_ = dateObjectT.getDate();
	let hor_ = horas[dateObjectT.getHours()];
	let seg_ = dateObjectT.toUTCString();
	const fave = dia_+'/'+mes_+'/'+ano_+' '+hor_;

	let fpmes_;
	let fpano_;
	let fpdia_;

	var mailOptions = {
		html: 'Embedded image: <img src="cid:apollcasapp1550raf"/>',
		attachments: [
			{
				filename: 'noimage.png',
				path: '/img/',
				cid: 'apollcasapp1550raf' //same cid value as in the html img src
			}
		]
	}
	let enviar = false;
	if (typeof fave !== "undefined"){
		enviar = true;
	}

	if (status_ === "ELIMINADO"){
		asunto = "Solicitud de avería eliminada. Nro ";
		bodytxt = newValue.motivoEli;
		saludo_ = "Avería Eliminada";
		enviar = true;
	}

	if (enviar){
		enviar = false;
		return sendaveriamail(email,name,pedUid,tmn,fave,mailOptions,codc,nomc,codv,nomv,codeBlock_,companyBkl_,clientedir_,observ_,pdfurl_,pdfname_,pdfb64_,asunto,bodytxt,saludo_,idaveria_,bodyFecha_,txta,txtr,txtc,nrodocfat,strtxtr,strtxtc);
	}else{
		enviar = false;
		return false;
	}
}) //AvemailUp










//**************************************************************** */
//				ENVIAR MAIL - ENVIAR MAIL - ENVIAR MAIL
//**************************************************************** */



//ENVIA MAIL PEDIDOS
function sendpedidomail(email,name,pedUid,tmn,fped,mailOptions,codc,nomc,codv,nomv,cond,codeBlock_,companyBkl_,clientedir_,totalmontobruto_,totalmontodescuento_,totalmontoimpuesto_,totalmontoneto_,observ_,pdfurl_,pdfname_,pdfb64_,asunto,bodytxt,fechapago,saludo_,idpedido_,bodyFecha_)
{
	return transport.sendMail({
		from: "CAS-Ricamar<cas@ricamar.com.ve>",
		to: email,
		bcc: "casricamar@gmail.com,ricamarcloud@gmail.com",
		subject: `${asunto} ${idpedido_}`,
		html: 	`

		
		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
		<!--[if !mso]><!-->
		<meta http-equiv="X-UA-Compatible" content="IE=Edge">
		<!--<![endif]-->
		<!--[if (gte mso 9)|(IE)]>
		<xml>
		  <o:OfficeDocumentSettings>
			<o:AllowPNG/>
			<o:PixelsPerInch>96</o:PixelsPerInch>
		  </o:OfficeDocumentSettings>
		</xml>
		  <![endif]-->
		  <!--[if (gte mso 9)|(IE)]>
			<style type="text/css">
			  body {width: 600px;margin: 0 auto;}
			  table {border-collapse: collapse;}
			  table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
			  img {-ms-interpolation-mode: bicubic;}
			</style>
		  <![endif]-->
		<style type="text/css">
	  body, p, div {
		font-family: Helvetica;
		font-size: 14px;
	  }
	  body {
		color: #000000;
	  }
	  body a {
		color: #1188E6;
		text-decoration: none;
	  }
	  p { margin: 0; padding: 0; }
	  table.wrapper {
		width:100% !important;
		table-layout: fixed;
		-webkit-font-smoothing: antialiased;
		-webkit-text-size-adjust: 100%;
		-moz-text-size-adjust: 100%;
		-ms-text-size-adjust: 100%;
	  }
	  img.max-width {
		max-width: 100% !important;
	  }
	  .column.of-2 {
		width: 50%;
	  }
	  .column.of-3 {
		width: 33.333%;
	  }
	  .column.of-4 {
		width: 25%;
	  }
	  @media screen and (max-width:480px) {
		.preheader .rightColumnContent,
		.footer .rightColumnContent {
		  text-align: left !important;
		}
		.preheader .rightColumnContent div,
		.preheader .rightColumnContent span,
		.footer .rightColumnContent div,
		.footer .rightColumnContent span {
		  text-align: left !important;
		}
		.preheader .rightColumnContent,
		.preheader .leftColumnContent {
		  font-size: 80% !important;
		  padding: 5px 0;
		}
		table.wrapper-mobile {
		  width: 100% !important;
		  table-layout: fixed;
		}
		img.max-width {
		  height: auto !important;
		  max-width: 100% !important;
		}
		a.bulletproof-button {
		  display: block !important;
		  width: auto !important;
		  font-size: 80%;
		  padding-left: 0 !important;
		  padding-right: 0 !important;
		}
		.columns {
		  width: 100% !important;
		}
		.column {
		  display: block !important;
		  width: 100% !important;
		  padding-left: 0 !important;
		  padding-right: 0 !important;
		  margin-left: 0 !important;
		  margin-right: 0 !important;
		}
	  }
	</style>
		<!--user entered Head Start--><link href="https://fonts.googleapis.com/css?family=Viga&display=swap" rel="stylesheet"><style>
	  body {font-family: 'Viga', sans-serif;}
  </style><!--End Head user entered-->
	  </head>
	  <body>
		<center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#f0f0f0;">
		  <div class="webkit">
			<table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#f0f0f0">
			  <tbody><tr>
				<td valign="top" bgcolor="#f0f0f0" width="100%">
				  <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
					<tbody><tr>
					  <td width="100%">
						<table width="100%" cellpadding="0" cellspacing="0" border="0">
						  <tbody><tr>
							<td>
							  <!--[if mso]>
	  <center>
	  <table><tr><td width="600">
	<![endif]-->
									  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
										<tbody><tr>
										  <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#ffffff" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
		  <tbody>
			  <tr>
					<td role="module-content">
					  <p></p>
					</td>
			  </tr>
		  </tbody>
	  </table>
	  <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 20px 40px 30px;" bgcolor="#D5DBDB">
		  <tbody>
			<tr role="module-content">
			  <td height="100%" valign="top">
				  <table class="column" width="550" style="width:550px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="">
					  <tbody>
						  <tr>
							  <td style="padding:0px;margin:0px;border-spacing:0;">
								  <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; fixed;font-family: Helvetica;font-size: 18px;" data-muid="b422590c-5d79-4675-8370-a10c2c76af02">
									  <tbody>
										  <tr>
											  <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="left">

											  </td>
										  </tr>
										  ${companyBkl_}
									  </tbody>
								  </table>

								  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="1995753e-0c64-4075-b4ad-321980b82dfe">
									  <tbody>
										<tr>
										  <td style="padding:50px 0px 18px 0px; line-height:36px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="color: #154360; font-size: 40px; font-family: inherit">${saludo_}</span></div><div></div></div></td>
										</tr>
									  </tbody>
								  </table>
								  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="2ffbd984-f644-4c25-9a1e-ef76ac62a549">
									  <tbody>
											  <tr>
												  <td style="padding:18px 20px 20px 0px; line-height:24px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
													  <div>
														  <div style="font-family: inherit; text-align: inherit">
															  <span style="font-size: 24px">${bodytxt}</span><br />
															  <span style="font-size: 18px">${bodyFecha_}</span>
														  </div>
													  <div></div>
													  </div>
												  </td>
											  </tr>
									  </tbody>
								  </table>
								  <table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="69fc33ea-7c02-45ed-917a-b3b8a6866e89">
										<tbody>
										  <tr>
											<td align="left" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px;">
											  <!--<table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
												<tbody>
												  <tr>
												  <td align="center" bgcolor="#000000" class="inner-td" style="border-radius:6px; font-size:16px; text-align:left; background-color:inherit;">
													<a href="${pdfurl_}" style="background-color:#000000; border:1px solid #000000; border-color:#000000; border-radius:0px; border-width:1px; color:#ffffff; display:inline-block; font-size:18px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">
														Ver mas detalles del pedido</a>
												  </td>
												  </tr>
												</tbody>
											  </table>-->
											</td>
										  </tr>
										</tbody>
								  </table>
							  </td>
						  </tr>
					  </tbody>
				  </table>
			  </td>
			</tr>
		  </tbody>
	  </table>


	  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="8b5181ed-0827-471c-972b-74c77e326e3d">
		  <tbody>
			  <tr>
				  <td style="padding:30px 20px 18px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="color: #0055ff; font-size: 24px">Resumen del pedido</span></div><div></div></div></td>
			  </tr>
		  </tbody>
	  </table>
	  <table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f7373f10-9ba4-4ca7-9a2e-1a2ba700deb9">
		  <tbody>
			  <tr>
				  <td style="padding:0px 30px 0px 30px;" role="module-content" height="100%" valign="top" bgcolor="">
					  <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="3px" style="line-height:3px; font-size:3px;">
						  <tbody>
							  <tr>
								  <td style="padding:0px 0px 3px 0px;" bgcolor="#e7e7e7"></td>
							  </tr>
						  </tbody>
					  </table>
				  </td>
			  </tr>
		  </tbody>
	  </table>
	  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="264ee24b-c2b0-457c-a9c1-d465879f9935">
		  <tbody>
			  <tr>
				  <td style="padding:18px 20px 18px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
					  <table class="table" style="width:50%;border-style:solid;border-width:0px">
						  <tbody>
							  <tr>
								  <th style="text-align:left;width:140px;" scope="row">Nro:</th>
							  </tr>
							  <tr>
								  <td>${idpedido_}</td>
							  </tr>
							  <tr>
								  <th style="text-align:left;width:140px;" scope="row">Realizado el:</th>
							  </tr>
							  <tr>
								  <td>${fped}</td>
							  </tr>
							  <tr>
								  <th style="text-align:left;width:140px;" scope="row">Código del cliente:</th>
							  </tr>
							  <tr>
								  <td>${codc}</td>
							  </tr>
							  <tr>
								  <th style="text-align:left;width:140px;" scope="row">Nombre del cliente:</th>
							  </tr>
							  <tr>
								  <td>${nomc}</td>
							  </tr>
							  <tr>
								  <th style="text-align:left;width:140px;" scope="row">Código del vendedor:</th>
							  </tr>
							  <tr>
								  <td>${codv}</td>
							  </tr>
							  <tr>
								  <th style="text-align:left;width:140px;" scope="row">Nombre del vendedor:</th>
							  </tr>
							  <tr>
								  <td>${nomv}</td>
							  </tr>
							  <tr>
								  <th style="text-align:left;width:140px;" scope="row">Condición de Pago:</th>
							  </tr>
							  <tr>
								  <td>${cond}</td>
							  </tr>
						  </tbody>
					  </table>
				  </td>
			  </tr>
			  <tr>
			  	<td  style="padding:30px">
	  				<h4>${fechapago}<h4>
			    </td>
			  </tr>
		  </tbody>
	  </table>

	  <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:20px 20px 0px 30px;" bgcolor="#FFFFFF">
		  <tbody>

		  </tbody>
	  </table>

	  <table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f7373f10-9ba4-4ca7-9a2e-1a2ba700deb9.1">
		  <tbody>
			  <tr>
				  <td style="padding:20px 30px 0px 30px;" role="module-content" height="100%" valign="top" bgcolor="">
					  <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="3px" style="line-height:3px; font-size:3px;">
						  <tbody>
							  <tr>
								  <td style="padding:0px 0px 3px 0px;" bgcolor="E7E7E7">

								  </td>
							  </tr>
						  </tbody>
					  </table>
				  </td>
			  </tr>
		  </tbody>
	  </table>

	  <!--<table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="264ee24b-c2b0-457c-a9c1-d465879f9935.1">
		  <tbody>
			  <tr>
				  <td style="padding:18px 20px 30px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
					  <div>
					  	${codeBlock_}
					  </div>
				  </td>
			  </tr>
		  </tbody>
	  </table>-->


	  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="264ee24b-c2b0-457c-a9c1-d465879f9935.1">
		  <tbody>
			  <tr>
				  <td style="padding:18px 20px 30px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
					  	<div>
					 		<table style="width:100%">
								<tbody>
									<tr>
										<th style="text-align:right;" scope="row">Subtotal:</th>
										<td style="text-align:right;width:100px;">${new Intl.NumberFormat("en-US").format(totalmontobruto_.toFixed(2))}</td>
									</tr>
									<tr>
										<th style="text-align:right;" scope="row">Descuento:</th>
										<td style="text-align:right;width:100px;">${new Intl.NumberFormat("en-US").format(totalmontodescuento_.toFixed(2))}</td>
									</tr>
									<tr>
										<th style="text-align:right;" scope="row">Total:</th>
										<td style="text-align:right;width:100px;"><span style="color: #0055ff; font-size: 18px; font-family: inherit">${new Intl.NumberFormat("en-US").format(totalmontoneto_.toFixed(2))}</span></td>
									</tr>

								</tbody>
					    	</table>
					    </div>
				  </td>
			  </tr>
		  </tbody>
	  </table>



	  <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:0px 20px 0px 20px;" bgcolor="#0055ff">
	  <tbody>
		  <tr role="module-content">
			  <!--Estaba el footer-->
		  </tr>
	  </tbody>
  </table>

	</td>
	</tr>
	</tbody>
	</table>
					<!--[if mso]>
					</td>
				</tr>
				</table>
			</center>
			<![endif]-->
			</td>
		</tr>
		</tbody></table>
	</td>
	</tr>
	</tbody></table>
	</td>
	</tr>
	</tbody></table>
	</div>
	</center>


	</body>
	</html>










				`,
		attachments:[
						{
							filename: pdfname_,
							content: pdfb64_,
							encoding: 'base64'
						}
					//,{
					// 	filename: 'logimprmcasappydctsystem.PNG',
					// 	path: './img/logimprmcasappydctsystem.PNG',
					// 	cid: 'logimprmcasappydctsystem'
					// },
					// {
					// 	filename: 'logimprmcasappydctsystem2.PNG',
					// 	path: './img/logimprmcasappydctsystem2.PNG',
					// 	cid: 'logimprmcasappydctsystem2'
					// }


				]


	}).then(r=>console.log('Email enviado sin problemas')).catch(e=>console.log('El error es: ',e));
}//sendpedidomail

//ENVIA MAIL COBROS
function sendcobromail(email,name,pdfb64_,nfactura_,idpedido_,asunto,bodytxt,pdfname_,companyhead_,fvencimiento_)
{
	return transport.sendMail({
		from: "CAS-Ricamar<Cas@ricamar.com.ve>",
		to: email,
		bcc: "casricamar@gmail.com,ricamarcloud@gmail.com",
		subject: `${asunto}`,
		html: 	`


		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
		<!--[if !mso]><!-->
		<meta http-equiv="X-UA-Compatible" content="IE=Edge">
		<!--<![endif]-->
		<!--[if (gte mso 9)|(IE)]>
		<xml>
		  <o:OfficeDocumentSettings>
			<o:AllowPNG/>
			<o:PixelsPerInch>96</o:PixelsPerInch>
		  </o:OfficeDocumentSettings>
		</xml>
		  <![endif]-->
		  <!--[if (gte mso 9)|(IE)]>
			<style type="text/css">
			  body {width: 600px;margin: 0 auto;}
			  table {border-collapse: collapse;}
			  table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
			  img {-ms-interpolation-mode: bicubic;}
			</style>
		  <![endif]-->
		<style type="text/css">
	  body, p, div {
		font-family: Helvetica;
		font-size: 14px;
	  }
	  body {
		color: #000000;
	  }
	  body a {
		color: #1188E6;
		text-decoration: none;
	  }
	  p { margin: 0; padding: 0; }
	  table.wrapper {
		width:100% !important;
		table-layout: fixed;
		-webkit-font-smoothing: antialiased;
		-webkit-text-size-adjust: 100%;
		-moz-text-size-adjust: 100%;
		-ms-text-size-adjust: 100%;
	  }
	  img.max-width {
		max-width: 100% !important;
	  }
	  .column.of-2 {
		width: 50%;
	  }
	  .column.of-3 {
		width: 33.333%;
	  }
	  .column.of-4 {
		width: 25%;
	  }
	  @media screen and (max-width:480px) {
		.preheader .rightColumnContent,
		.footer .rightColumnContent {
		  text-align: left !important;
		}
		.preheader .rightColumnContent div,
		.preheader .rightColumnContent span,
		.footer .rightColumnContent div,
		.footer .rightColumnContent span {
		  text-align: left !important;
		}
		.preheader .rightColumnContent,
		.preheader .leftColumnContent {
		  font-size: 80% !important;
		  padding: 5px 0;
		}
		table.wrapper-mobile {
		  width: 100% !important;
		  table-layout: fixed;
		}
		img.max-width {
		  height: auto !important;
		  max-width: 100% !important;
		}
		a.bulletproof-button {
		  display: block !important;
		  width: auto !important;
		  font-size: 80%;
		  padding-left: 0 !important;
		  padding-right: 0 !important;
		}
		.columns {
		  width: 100% !important;
		}
		.column {
		  display: block !important;
		  width: 100% !important;
		  padding-left: 0 !important;
		  padding-right: 0 !important;
		  margin-left: 0 !important;
		  margin-right: 0 !important;
		}
	  }
	</style>
		<!--user entered Head Start--><link href="https://fonts.googleapis.com/css?family=Viga&display=swap" rel="stylesheet"><style>
	  body {font-family: 'Viga', sans-serif;}
  </style><!--End Head user entered-->
	  </head>
	  <body>
		<center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#f0f0f0;">
		  <div class="webkit">
			<table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#f0f0f0">
			  <tbody><tr>
				<td valign="top" bgcolor="#f0f0f0" width="100%">
				  <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
					<tbody><tr>
					  <td width="100%">
						<table width="100%" cellpadding="0" cellspacing="0" border="0">
						  <tbody><tr>
							<td>
							  <!--[if mso]>
	  <center>
	  <table><tr><td width="600">
	<![endif]-->
									  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
										<tbody><tr>
										  <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#ffffff" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
		  <tbody>
			  <tr>
					<td role="module-content">
					  <p></p>
					</td>
			  </tr>
		  </tbody>
	  </table>
	  <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 20px 40px 30px;" bgcolor="#D5DBDB">
		  <tbody>
			<tr role="module-content">
			  <td height="100%" valign="top">
				  <table class="column" width="550" style="width:550px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="">
					  <tbody>
						  <tr>
							  <td style="padding:0px;margin:0px;border-spacing:0;">
								  <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; fixed;font-family: Helvetica;font-size: 18px;" data-muid="b422590c-5d79-4675-8370-a10c2c76af02">
									  <tbody>
										  <tr>
											  <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="left">

											  </td>
										  </tr>
										 <!--Company Blok-->
									  </tbody>
								  </table>

								  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="1995753e-0c64-4075-b4ad-321980b82dfe">
									  <tbody></tbody>
									  ${companyhead_}
								  </table>
								  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="2ffbd984-f644-4c25-9a1e-ef76ac62a549">
									  <tbody>
											  <tr>
												  <td style="padding:18px 20px 20px 0px; line-height:24px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
													  <div>
														  <div style="font-family: inherit; text-align: inherit">

														  </div>
													  <div></div>
													  </div>
												  </td>
											  </tr>
									  </tbody>
								  </table>
							  </td>
						  </tr>
					  </tbody>
				  </table>
			  </td>
			</tr>
		  </tbody>
	  </table>


	  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="8b5181ed-0827-471c-972b-74c77e326e3d">
		  <tbody>
			  <tr>
				  <td style="padding:30px 20px 18px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="color: #0055ff; font-size: 24px">
				  	Notificación de cobro
				  </span></div><div></div></div></td>
			  </tr>
		  </tbody>
	  </table>
	  <table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f7373f10-9ba4-4ca7-9a2e-1a2ba700deb9">
		  <tbody>
			  <tr>
				  <td style="padding:0px 30px 0px 30px;" role="module-content" height="100%" valign="top" bgcolor="">
					  <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="3px" style="line-height:3px; font-size:3px;">
						  <tbody>
							  <tr>
								  <td style="padding:0px 0px 3px 0px;" bgcolor="#e7e7e7"></td>
							  </tr>
						  </tbody>
					  </table>
				  </td>
			  </tr>
		  </tbody>
	  </table>
	  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="264ee24b-c2b0-457c-a9c1-d465879f9935">
		  <tbody>
			  <tr>
				  <td style="padding:18px 20px 18px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
					  <table class="table" style="width:100%;border-style:solid;border-width:0px">
						  <tbody>
							  <tr>
								  <th style="text-align:left;width:140px;" scope="row">
								  	<span>${bodytxt}</span><br />
								  </th>
							  </tr>
							  <tr>
								  <td></td>
							  </tr>
						  </tbody>
					  </table>
				  </td>
			  </tr>
			  <tr>
			  	<td  style="padding:30px">
	  				<h4>Fecha de vencimiento: ${fvencimiento_}<h4>
			    </td>
			  </tr>
		  </tbody>
	  </table>

	<table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:0px 20px 0px 20px;" bgcolor="#0055ff">
	  <tbody>
		  <tr role="module-content">
			  <!--Estaba el footer-->
		  </tr>
	  </tbody>
  	</table>

	</td>
	</tr>
	</tbody>
	</table>
					<!--[if mso]>
					</td>
				</tr>
				</table>
			</center>
			<![endif]-->
			</td>
		</tr>
		</tbody></table>
	</td>
	</tr>
	</tbody></table>
	</td>
	</tr>
	</tbody></table>
	</div>
	</center>


	</body>
	</html>










				`,
		attachments:[
						{
							filename: pdfname_,
							content: pdfb64_,
							encoding: 'base64'
						}
					//,{
					// 	filename: 'logimprmcasappydctsystem.PNG',
					// 	path: './img/logimprmcasappydctsystem.PNG',
					// 	cid: 'logimprmcasappydctsystem'
					// },
					// {
					// 	filename: 'logimprmcasappydctsystem2.PNG',
					// 	path: './img/logimprmcasappydctsystem2.PNG',
					// 	cid: 'logimprmcasappydctsystem2'
					// }


				]


	}).then(r=>console.log('Email enviado sin problemas')).catch(e=>console.log('El error es: ',e));
}//sendcobromail

//ENVIA MAIL AVERIAS
function sendaveriamail(email,name,aveUid,tmn,fave,mailOptions,codc,nomc,codv,nomv,codeBlock_,companyBkl_,clientedir_,observ_,pdfurl_,pdfname_,pdfb64_,asunto,bodytxt,saludo_,idaveria_,bodyFecha_,txta,txtr,txtc,nrodocfat,strtxtr,strtxtc)
{
	return transport.sendMail({
		from: "CAS-Ricamar<CasRicamar@gmail.com>",
		to: email,
		bcc: "casricamar@gmail.com,ricamarcloud@gmail.com",
		subject: `${asunto} ${idaveria_}`,
		html: 	`


		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
		<!--[if !mso]><!-->
		<meta http-equiv="X-UA-Compatible" content="IE=Edge">
		<!--<![endif]-->
		<!--[if (gte mso 9)|(IE)]>
		<xml>
		  <o:OfficeDocumentSettings>
			<o:AllowPNG/>
			<o:PixelsPerInch>96</o:PixelsPerInch>
		  </o:OfficeDocumentSettings>
		</xml>
		  <![endif]-->
		  <!--[if (gte mso 9)|(IE)]>
			<style type="text/css">
			  body {width: 600px;margin: 0 auto;}
			  table {border-collapse: collapse;}
			  table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
			  img {-ms-interpolation-mode: bicubic;}
			</style>
		  <![endif]-->
		<style type="text/css">
	  body, p, div {
		font-family: Helvetica;
		font-size: 14px;
	  }
	  body {
		color: #000000;
	  }
	  body a {
		color: #1188E6;
		text-decoration: none;
	  }
	  p { margin: 0; padding: 0; }
	  table.wrapper {
		width:100% !important;
		table-layout: fixed;
		-webkit-font-smoothing: antialiased;
		-webkit-text-size-adjust: 100%;
		-moz-text-size-adjust: 100%;
		-ms-text-size-adjust: 100%;
	  }
	  img.max-width {
		max-width: 100% !important;
	  }
	  .column.of-2 {
		width: 50%;
	  }
	  .column.of-3 {
		width: 33.333%;
	  }
	  .column.of-4 {
		width: 25%;
	  }
	  @media screen and (max-width:480px) {
		.preheader .rightColumnContent,
		.footer .rightColumnContent {
		  text-align: left !important;
		}
		.preheader .rightColumnContent div,
		.preheader .rightColumnContent span,
		.footer .rightColumnContent div,
		.footer .rightColumnContent span {
		  text-align: left !important;
		}
		.preheader .rightColumnContent,
		.preheader .leftColumnContent {
		  font-size: 80% !important;
		  padding: 5px 0;
		}
		table.wrapper-mobile {
		  width: 100% !important;
		  table-layout: fixed;
		}
		img.max-width {
		  height: auto !important;
		  max-width: 100% !important;
		}
		a.bulletproof-button {
		  display: block !important;
		  width: auto !important;
		  font-size: 80%;
		  padding-left: 0 !important;
		  padding-right: 0 !important;
		}
		.columns {
		  width: 100% !important;
		}
		.column {
		  display: block !important;
		  width: 100% !important;
		  padding-left: 0 !important;
		  padding-right: 0 !important;
		  margin-left: 0 !important;
		  margin-right: 0 !important;
		}
	  }
	</style>
		<!--user entered Head Start--><link href="https://fonts.googleapis.com/css?family=Viga&display=swap" rel="stylesheet"><style>
	  body {font-family: 'Viga', sans-serif;}
  </style><!--End Head user entered-->
	  </head>
	  <body>
		<center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#f0f0f0;">
		  <div class="webkit">
			<table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#f0f0f0">
			  <tbody><tr>
				<td valign="top" bgcolor="#f0f0f0" width="100%">
				  <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
					<tbody><tr>
					  <td width="100%">
						<table width="100%" cellpadding="0" cellspacing="0" border="0">
						  <tbody><tr>
							<td>
							  <!--[if mso]>
	  <center>
	  <table><tr><td width="600">
	<![endif]-->
									  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
										<tbody><tr>
										  <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#ffffff" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
		  <tbody>
			  <tr>
					<td role="module-content">
					  <p></p>
					</td>
			  </tr>
		  </tbody>
	  </table>
	  <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 20px 40px 30px;" bgcolor="#D5DBDB">
		  <tbody>
			<tr role="module-content">
			  <td height="100%" valign="top">
				  <table class="column" width="550" style="width:550px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="">
					  <tbody>
						  <tr>
							  <td style="padding:0px;margin:0px;border-spacing:0;">
								  <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; fixed;font-family: Helvetica;font-size: 18px;" data-muid="b422590c-5d79-4675-8370-a10c2c76af02">
									  <tbody>
										  <tr>
											  <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="left">

											  </td>
										  </tr>
										  ${companyBkl_}
									  </tbody>
								  </table>

								  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="1995753e-0c64-4075-b4ad-321980b82dfe">
									  <tbody>
										<tr>
										  <td style="padding:50px 0px 18px 0px; line-height:36px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="color: #154360; font-size: 40px; font-family: inherit">${saludo_}</span></div><div></div></div></td>
										</tr>
									  </tbody>
								  </table>
								  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="2ffbd984-f644-4c25-9a1e-ef76ac62a549">
									  <tbody>
											  <tr>
												  <td style="padding:18px 20px 20px 0px; line-height:24px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
													  <div>
														  <div style="font-family: inherit; text-align: inherit">
															  <span style="font-size: 24px">${bodytxt}</span><br />
															  <span style="font-size: 18px">${bodyFecha_}</span>
														  </div>
													  <div></div>
													  </div>
												  </td>
											  </tr>
									  </tbody>
								  </table>
								  <table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="69fc33ea-7c02-45ed-917a-b3b8a6866e89">
										<tbody>
										  <tr>
											<td align="left" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px;">
											  <!--<table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
												<tbody>
												  <tr>
												  <td align="center" bgcolor="#000000" class="inner-td" style="border-radius:6px; font-size:16px; text-align:left; background-color:inherit;">
													<a href="${pdfurl_}" style="background-color:#000000; border:1px solid #000000; border-color:#000000; border-radius:0px; border-width:1px; color:#ffffff; display:inline-block; font-size:18px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">
														Ver mas detalles del pedido</a>
												  </td>
												  </tr>
												</tbody>
											  </table>-->
											</td>
										  </tr>
										</tbody>
								  </table>
							  </td>
						  </tr>
					  </tbody>
				  </table>
			  </td>
			</tr>
		  </tbody>
	  </table>


	  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="8b5181ed-0827-471c-972b-74c77e326e3d">
		  <tbody>
			  <tr>
				  <td style="padding:30px 20px 18px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="color: #0055ff; font-size: 24px">Datos de la solicitud</span></div><div></div></div></td>
			  </tr>
		  </tbody>
	  </table>
	  <table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f7373f10-9ba4-4ca7-9a2e-1a2ba700deb9">
		  <tbody>
			  <tr>
				  <td style="padding:0px 30px 0px 30px;" role="module-content" height="100%" valign="top" bgcolor="">
					  <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="3px" style="line-height:3px; font-size:3px;">
						  <tbody>
							  <tr>
								  <td style="padding:0px 0px 3px 0px;" bgcolor="#e7e7e7"></td>
							  </tr>
						  </tbody>
					  </table>
				  </td>
			  </tr>
		  </tbody>
	  </table>
	  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="264ee24b-c2b0-457c-a9c1-d465879f9935">
		  <tbody>
			  <tr>
				  <td style="padding:18px 20px 18px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
					  <table class="table" style="width:100%;border-style:solid;border-width:0px">
						  <tbody>
							  <tr>
								  <th style="text-align:left;width:140px;" scope="row">Nro:</th>
							  </tr>
							  <tr>
								  <td>${idaveria_}</td>
							  </tr>
							  <tr>
								  <th style="text-align:left;width:140px;" scope="row">Realizado el:</th>
							  </tr>
							  <tr>
								  <td>${fave}</td>
							  </tr>
							  <tr>
								  <th style="text-align:left;width:140px;" scope="row">Código del cliente:</th>
							  </tr>
							  <tr>
								  <td>${codc}</td>
							  </tr>
							  <tr>
								  <th style="text-align:left;width:140px;" scope="row">Nombre del cliente:</th>
							  </tr>
							  <tr>
								  <td>${nomc}</td>
							  </tr>
							  <tr>
								  <th style="text-align:left;width:140px;" scope="row">Código del vendedor:</th>
							  </tr>
							  <tr>
								  <td>${codv}</td>
							  </tr>
							  <tr>
								  <th style="text-align:left;width:140px;" scope="row">Nombre del vendedor:</th>
							  </tr>
							  <tr>
								  <td>${nomv}</td>
							  </tr>
							  <tr>
							  	   <th style="text-align:left;width:140px;" scope="row">N° Doc/Fac:</th>
							  </tr>
							  <tr>
							       <td>${nrodocfat}</td>
							  </tr>
							  <tr>
							  	   <th style="text-align:left;width:140px;" scope="row">${strtxtr}</th>
							  </tr>
							  <tr>
							       <td style="text-align:left;width:250px;">${txtr}<br /><br /></td>
							  </tr>
							  <tr>
							  	   <th style="text-align:left;width:140px;" scope="row">${strtxtc}</th>
							  </tr>
							  <tr>
							       <td style="text-align:left;width:250px;">${txtc}<br /></td>
							  </tr>
						  </tbody>
					  </table>
				  </td>
			  </tr>
			  <tr>
			  	<td  style="padding:30px">
	  				<h4>Adjunto encontrará un documento PDF, con los detalles de la avería<h4>
			    </td>
			  </tr>
		  </tbody>
	  </table>

	  <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:20px 20px 0px 30px;" bgcolor="#FFFFFF">
		  <tbody>

		  </tbody>
	  </table>

	  <table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f7373f10-9ba4-4ca7-9a2e-1a2ba700deb9.1">
		  <tbody>
			  <tr>
				  <td style="padding:20px 30px 0px 30px;" role="module-content" height="100%" valign="top" bgcolor="">
					  <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="3px" style="line-height:3px; font-size:3px;">
						  <tbody>
							  <tr>
								  <td style="padding:0px 0px 3px 0px;" bgcolor="E7E7E7">

								  </td>
							  </tr>
						  </tbody>
					  </table>
				  </td>
			  </tr>
		  </tbody>
	  </table>

	  <!--<table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="264ee24b-c2b0-457c-a9c1-d465879f9935.1">
		  <tbody>
			  <tr>
				  <td style="padding:18px 20px 30px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
					  <div>
					  	${codeBlock_}
					  </div>
				  </td>
			  </tr>
		  </tbody>
	  </table>-->


	  <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="264ee24b-c2b0-457c-a9c1-d465879f9935.1">
		  <tbody>
			  <tr>
				  <td style="padding:18px 20px 30px 30px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
					  	<div>
					 		<table style="width:100%">
								<tbody>
									<tr>
										<th style="text-align:right;" scope="row">Total Avería:</th>
										<td style="text-align:right;width:100px;"><span style="color: #0055ff; font-size: 18px; font-family: inherit">${new Intl.NumberFormat("en-US").format(tmn.toFixed(2))}</span></td>
									</tr>
								</tbody>
					    	</table>
					    </div>
				  </td>
			  </tr>
		  </tbody>
	  </table>



	  <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:0px 20px 0px 20px;" bgcolor="#0055ff">
	  <tbody>
		  <tr role="module-content">
			  <!--Estaba el footer-->
		  </tr>
	  </tbody>
  </table>

	</td>
	</tr>
	</tbody>
	</table>
					<!--[if mso]>
					</td>
				</tr>
				</table>
			</center>
			<![endif]-->
			</td>
		</tr>
		</tbody></table>
	</td>
	</tr>
	</tbody></table>
	</td>
	</tr>
	</tbody></table>
	</div>
	</center>


	</body>
	</html>










				`,
		attachments:[
						{
							filename: pdfname_,
							content: pdfb64_,
							encoding: 'base64'
						}
					//,{
					// 	filename: 'logimprmcasappydctsystem.PNG',
					// 	path: './img/logimprmcasappydctsystem.PNG',
					// 	cid: 'logimprmcasappydctsystem'
					// },
					// {
					// 	filename: 'logimprmcasappydctsystem2.PNG',
					// 	path: './img/logimprmcasappydctsystem2.PNG',
					// 	cid: 'logimprmcasappydctsystem2'
					// }


				]


	}).then(r=>console.log('Email enviado sin problemas')).catch(e=>console.log('El error es: ',e));
}//sendpedidomail
