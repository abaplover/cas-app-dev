export class Product {
	$key			: string;
	idmaterial		: string;
	descripcion		: string;
	marca			: string;
	unidadmedida	: string;
	grupodearticulos: string;
	multiplodeventas: number;
	status			: string;
	clasificacion	: number;
	existencia		: number;
	detalles?		: string = "";
	preciousd1		: number;
	preciousd2		: number;
	preciovef1		: number;
	preciovef2		: number;
	fotourl?		: string;  //= "https://firebasestorage.googleapis.com/v0/b/cloud-anvanced-seliing.appspot.com/o/appImage%2Fnoimage.png?alt=media&token=4cb53145-7b97-44d5-810a-202aae8385b0";
    path?           : string;
}
