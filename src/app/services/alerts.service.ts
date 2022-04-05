import { Injectable } from '@angular/core';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';

const swal: SweetAlert = _swal as any;

@Injectable()
export class AlertsService {

	constructor() { }

    succes(title, message) {
        swal(title, message,'success');
    };

    error(title, message) {
        swal(title, message,'error');
    };

    info(title, message) {
        swal(title, message,'info');
    };

    custom(configObject) {
        swal(configObject);
    }

	async warning (title, text, icon) {
		let res = await swal({
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