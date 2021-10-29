import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage';

//  Service 
import { ProductService } from '../../../services/product.service';
import { MarcaService } from '../../../services/marca.service';
import { UmedidaService } from '../../../services/umedida.service';
import { GarticuloService } from '../../../services/garticulo.service';

// Class
import { Product } from '../../../models/product';
import { Marca } from '../../../models/marca';
import { Umedida } from '../../../models/umedida';  
import { Garticulo } from '../../../models/garticulo'; 

// toastr
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { off } from 'process';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {

  //@ViewChild('productForm') newfomr: NgForm;
  //imagen 
  prevUrl= "";
  prevpath="";
  imgmuestra = "";
  imagenSelected = "";
  downloadURL: Observable<string>;
  imgUrl: boolean;
  imgname: string;
  randomNum: number;
  uploadPercent: Observable<number>;
  porcentajesubida: number;
  percenttxt: string;
  storage009 = firebase.storage();


  public get productService(): ProductService {
    return this._productService;
  }
  public set productService(value: ProductService) {
    this._productService = value;
  }



  marcasList: Marca[]; //arreglo vacio
  umedidaList: Umedida[]; //arreglo vacio
  garticuloList: Garticulo[]; //arreglo vacio

  

  constructor
  (
    private _productService: ProductService,
    private toastr: ToastrService,
    public marcaS : MarcaService,
    public umedidaS : UmedidaService,
    public garticuloS : GarticuloService,
    private http: HttpClient,
    private de: AngularFireStorage
  )
  { }

  ngOnInit() {
    this.imgUrl=false;
    this.productService.mostrarForm = false;
    this.productService.idFieldReadOnly = false;
    this.productService.getProducts();
    //this.resetForm(this.newfomr);

    this.marcaS.getMarcas().valueChanges().subscribe(ms =>{
      this.marcasList = ms;
    })

    this.umedidaS.getUmedidas().valueChanges().subscribe(um =>{
      this.umedidaList = um;
    })

    this.garticuloS.getGarticulo().valueChanges().subscribe(ga =>{
      this.garticuloList = ga;
    })
    //console.log('ggg ',this.productService.selectedProduct.fotourl)
  }

  onSubmit(productForm: NgForm)
  {
    //console.log('key: ',productForm.value.$key);
    
    if(productForm.value.$key == null){
      this.productService.insertProduct(productForm.value);
      this.toastr.success('Operación Terminada', 'Producto Registrado');
    }else{
      this.productService.updateProduct(productForm.value);
      //this.eliminarArchivo(this.prevpath);
      this.toastr.success('Operación Terminada', 'Producto Actualizado');
    }

    this.resetForm(productForm);
      //oculta el formulario
      this.productService.mostrarForm = false;
      this.msj_enlace = 'Materiales';
  }

  resetForm(productForm?: NgForm)
  {
    if(productForm != null){
      productForm.reset();
      this.productService.selectedProduct = new Product();
      this.productService.idFieldReadOnly = false;
      this.productService.selectedProduct.fotourl =""; //"https://firebasestorage.googleapis.com/v0/b/cloud-anvanced-seliing.appspot.com/o/appImage%2Fnoimage.png?alt=media&token=4cb53145-7b97-44d5-810a-202aae8385b0";
      this.percenttxt = "";
      this.porcentajesubida=0;
    }
  }

 //mostrar: boolean = false;
 public msj_enlace: string = 'Materiales';

  moForm(){
    if (this.productService.mostrarForm){
      this.productService.mostrarForm = false;
      this.productService.idFieldReadOnly = true;
        this.resetForm();
      this.msj_enlace = 'Materiales';
    }else{
      this.productService.mostrarForm = true;
      this.productService.idFieldReadOnly = false;
      this.msj_enlace = '';
    }
  }


  onFileSelected(e){

    this.prevUrl = this.productService.selectedProduct.fotourl;
    this.prevpath = this.productService.selectedProduct.path;
    this.imagenSelected = e.target.files[0];
    this.imgname = e.target.files[0].name;
    this.randomNum = Math.floor(100000 + Math.random() * 900000);
    const filePath = "/Materials/cusweb-"+this.randomNum+"-"+Date.now();

    const task = this.de.upload(filePath,this.imagenSelected);
    this.uploadPercent = task.percentageChanges();

    this.uploadPercent.subscribe(psub => {
      this.porcentajesubida = parseInt(psub.toFixed());
      this.percenttxt = this.porcentajesubida.toString() + '%';
    });
    
    task
    .snapshotChanges()
    .pipe(
      finalize(() => {
        this.downloadURL = this.de.ref(filePath).getDownloadURL();
        this.imgUrl = true;
        //console.log('OTRA',this.downloadURL);
         //fileRef.getDownloadURL();
        this.downloadURL.subscribe(url => {
          if (url) {
            this.imgmuestra = url;
            this._productService.selectedProduct.fotourl = url.toString();
            this._productService.selectedProduct.path = filePath.toString();
          }
        });
      })
    )
    .subscribe(url => {
      if (url) {
      // console.log(url);
      }
    });
  }

  eliminarArchivo(p){
    var storageRef = this.storage009.ref();
    var desertRef = storageRef.child(p.toString());

    desertRef.delete().then(function() {
      // File deleted successfully
    }).catch(function(error) {
      // Uh-oh, an error occurred!
      this.toastr.console.error('Error', error);
    });
  }



}//fin class ProductComponent

