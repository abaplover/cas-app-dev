export class Util {

	//Obtener fecha de campo Timestamp
	static getFecha(fec) {
		if (!fec) return null;
		let dateObject = new Date(fec.seconds * 1000);
		return dateObject;
	}

	static amountFieldConversion(amount) {

		if (!amount) return '0';
		let numberConv = amount;
		numberConv = numberConv.replace(".", "-");
		numberConv = numberConv.replace(",", ".");
		numberConv = numberConv.replace("-", ",");

		return numberConv;

	}

}