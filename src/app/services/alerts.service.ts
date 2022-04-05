import { Injectable } from '@angular/core';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';

const swalert: SweetAlert = _swal as any;

@Injectable()
export class AlertsService {

	constructor() { }

    succes(title, message) {
        swalert(title, message,'success');
    };

    error(title, message) {
        swalert(title, message,'error');
    };

    info(title, message) {
        swalert(title, message,'info');
    };

    custom(configObject) {
        swalert(configObject);
    }

	async warning (title, text, icon) {
		let res = await swalert({
		  title: title,
		  text: text,
		  icon: icon,
		  buttons: ['Cancelar', 'Rechazar'],
  		  dangerMode: true,
		}).then((result) => {
		  return result;
		})
		return res;
	  }
};