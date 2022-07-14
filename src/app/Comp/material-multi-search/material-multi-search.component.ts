import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { Product } from 'src/app/models/product';
@Component({
  selector: 'app-material-multi-search',
  templateUrl: './material-multi-search.component.html',
  styleUrls: ['./material-multi-search.component.css']
})
export class MaterialMultiSearchComponent implements OnInit  {

  public keywordCli = "descId";
  public materialesList : any[];

  constructor() {
  }

  @Output() SelectedValue = new EventEmitter<string>();
  @Input() MaterialesList : Product[];


  ngOnInit(): void {
      console.log(this.MaterialesList);
      this.materialesList = this.MaterialesList.map(material => {
          return {
              ...material,
              descId: `${material.idmaterial } - ${material.descripcion}`
          };
      })
      // this.materialesList = this.MaterialesList;
  }

  onChangeSearch(val: string) {
    //console.log('aqui: ',val);
    // this.pedidoService.pedido_.idcliente = val;


  }//onChangeSearch
  selectEvent(elemento){
    const val = elemento.descripcion;
    this.SelectedValue.emit(val);

    }

}
