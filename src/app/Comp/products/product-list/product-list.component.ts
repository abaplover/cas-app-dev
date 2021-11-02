import { Component, OnInit,ViewChild } from '@angular/core';
// model
import { Product } from '../../../models/product';

// service
import { ProductService } from '../../../services/product.service';

// toastr
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  productList: Product[];
  dataSource: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idmaterial', 'descripcion', 'marca', 'unidadmedida', 'grupodearticulos','multiplodeventas','clasificacion','existencia','preciousd1','preciousd2','preciovef1','preciovef2','Opc'];

  constructor(
    public productService: ProductService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    return this.productService.getProducts()
      .snapshotChanges().subscribe(item => {
        this.productList = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.productList.push(x as Product);
        });

        //ELEMENT_DATA
        this.dataSource = new MatTableDataSource(this.productList);
        this.dataSource.sort = this.sort;  
        this.dataSource.paginator = this.paginator;

      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  moForm(){
    if (this.productService.mostrarForm){
       this.productService.mostrarForm = false;
       this.productService.idFieldReadOnly = true;
    }else{
     this.productService.idFieldReadOnly = false;
      this.productService.mostrarForm = true;
    }
  }

  onEdit(product: Product) {
    this.productService.selectedProduct = Object.assign({}, product);
    this.productService.mostrarForm = true;
    this.productService.idFieldReadOnly = true;
    //console.log(this.productList[0].fotourl);
  }

  onDelete($key: string) {
    if(confirm('¿Está seguro de que quiere eliminar este elemento?')) {
      this.productService.deleteProduct($key);
      this.toastr.warning('Operación Terminada', 'Producto eliminado');
    }
  }

}
