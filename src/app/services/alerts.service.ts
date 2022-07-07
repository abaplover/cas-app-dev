import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'


@Injectable()
export class AlertsService {

	constructor() { }

    succes(title, message) {
        Swal.fire(title, message,'success');
    };

    error(title, message) {
        Swal.fire(title, message,'error');
    };

    info(title, message) {
        Swal.fire(title, message,'info');
    };

    custom(configObject) {
        Swal.fire(configObject);
    }

	async warning (title, text, icon,buttonname) {
		let res = await Swal.fire({
		  title: title,
		  text: text,
		  icon: icon,
		  showCancelButton: true,
		  confirmButtonText: buttonname,
		  confirmButtonColor: '#d33',
		}).then((result) => {
		  return result;
		})
		return res;
	  }
};