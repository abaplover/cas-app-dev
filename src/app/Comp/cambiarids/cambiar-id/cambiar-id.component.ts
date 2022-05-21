import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { each } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Pedido } from 'src/app/models/pedido';
import { AlertsService } from 'src/app/services/alerts.service';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-cambiar-id',
  templateUrl: './cambiar-id.component.html',
  styleUrls: ['./cambiar-id.component.css']
})
export class CambiarIdComponent implements OnInit {

  pedidoList: Pedido[];
  pedidoslist: [];
  idped = "";
  arrayIds = [];
  pedidoId = "";
  dataSource: MatTableDataSource<Pedido>;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['idpedido','fechapedido','status','listaprecio','condiciondepago','nomcliente','nomvendedor','totalmontobruto','totalmontodescuento','totalmontoneto'];

  public get pedidoService(): PedidoService {
    return this._pedidoService;
  }
  public set pedidoService(value: PedidoService) {
    this._pedidoService = value;
  }

  constructor(
    private _pedidoService: PedidoService,
    private toastr: ToastrService,
    public alertsS: AlertsService,
  ) { }

  ngOnInit() {
    this.resetForm();
  }

  buscarPedido() {

    this.pedidoService.getPedidoCambioId(this.pedidoId).subscribe( pedido => {
      this.pedidoList = pedido;

      this.dataSource = new MatTableDataSource(this.pedidoList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }



  cambiarId(pedForm:NgForm) {
    //Array de ids que proporcionó el señor Ricardo
    this.arrayIds = ["1002281", "1002647", "1003576", "1003849", "1003648", "1003648", "1003648", "1004106", "1003952", "1003984", "1004130", "1004151", "1003927", "1003996", "1004156", "1004228", "1004246", "1004303", "1004310", "1004199", "1004222", "1004290", "1004298", "1004387", "1004245", "1004245", "1004281", "1004470", "1004467", "1004353", "1004361", "1004367", "1004371", "1004372", "1004556", "1004696", "1004629", "1004339", "1004349", "1004377", "1004389", "1004403", "1004394", "1004410", "1004413", "1004411", "1004415", "1004417", "1004421", "1004430", "1004441", "1004510", "1004532", "1004539", "1004540", "1004589", "1004596", "1004597", "1004558", "1004600", "1004602", "1004607", "1004336", "1004337", "1004369", "1004408", "1004405", "1004557", "1004363", "1004378", "1004382", "1004390", "1004391", "1004419", "1004495", "1004501", "1004566", "1004592", "1004652", "1004463", "1004359", "1004464", "1004468", "1004479", "1004481", "1004478", "1004482", "1004482", "1004489", "1004494", "1004507", "1004507", "1004547", "1004605", "1004505", "1004525", "1004529", "1001533", "1004686", "1004431", "1004446", "1004449", "1004465", "1004473", "1004520", "1004416", "1004526", "1004624", "1004636", "1004637", "1004638", "1004648", "1004653", "1004670", "1004682", "1004684", "1004687", "1004691", "1004698", "1004706", "1004721", "1004726", "1004518", "1004753", "1004257", "1004434", "1004434", "1004448", "1004471", "1004488", "1004490", "1004504", "1004513", "1004514", "1004515", "1004419", "1004561", "1004611", "1004612", "1004613", "1004614", "1004650", "1004727", "1004739", "1004740", "1004752", "1004759", "1004756", "1004511", "1004626", "1004508", "1004523", "1004530", "1004534", "1004537", "1004544", "1004563", "1004567", "1004574", "1004584", "1004586", "1004587", "1004595", "1004604", "1004606", "1004618", "1004646", "1004503", "1004573", "1004588", "1004625", "1004627", "1004634", "1004647", "1004764", "1004527", "1004545", "1004568", "1004560", "1004579", "1004591", "1004639", "1004552", "1004569", "1004559", "1004565", "1004577", "1004580", "1004582", "1004608", "1004609", "1004632", "1004633", "1004630", "1004649", "1004719", "1004616", "1004644", "1004656", "1004656", "1004673", "1004679", "1004680", "1004681", "1004683", "1004694", "1004695", "1004700", "1004709", "1004707", "1004708", "1004722", "1004620", "1004622", "1004645", "1004655", "1004676", "1004728", "1004733", "1004735", "1004737", "1004746", "1004767", "1004459", "1004459", "1004610", "1004666", "1004750", "1004665", "1004671", "1004693", "1004693", "1004744", "1004531", "1004531", "1004583", "1004603", "1004590", "1004617", "1004640", "1004643", "1004651", "1004669", "1004654", "1004657", "1004663", "1004664", "1004667", "1004668", "1004672", "1004674", "1004677", "1004678", "1004690", "1004692", "1004699", "1004697", "1004702", "1004701", "1004703", "1004716", "1004717", "1004718", "1004712", "1004710", "1004704", "1004720", "1004723", "1004724", "1004730", "1004731", "1004732", "1004742", "1004660", "1004760", "1004762", "1004768", "1004766", "1004763", "1004761", "1004770", "1004771", "1004772", "1004773"]
    

    this.alertsS.warning(
      "Enviar a cuentas por cobrar",
      "¿Está seguro que desea enviar el pedido a cuentas por cobrar?","warning","Enviar"
      ).then((res) => {
      if (res.isConfirmed) {
        //if (this.pedidoList[0].idpedido.toString() == this.pedidoId) {

          this.pedidoList[0].status = "TEMPORAL";
          this.pedidoService.updatePedidos(this.pedidoList[0]);
  
          this.resetForm(pedForm);
  
          this.toastr.success('Operación Terminada', `Pedido editado`);
     //s }
      } else {
        return;
      }
    });

    

    /* if (this.arrayIds.length > 0) {
 
      for(let i = 0; i < this.arrayIds.length;i++) {
        
        for (let j=0; j< this.pedidoslist.length;j++) {
          if (this.arrayIds[i] == this.pedidoslist[j].idpedido) {
            this.pedidoslist.splice(j,1);
            break;
          }
        }
      }
  
      console.log("pedidosList ", this.pedidoslist);
  
      this.pedidoslist.forEach( element => {
        //element.status = "COBRADO";
        this.pedidoService.updatePedidos(element);
      })
      
      this.toastr.success('Operación Terminada', 'Pedido Editado');
    } else {

      this.toastr.success('Operación Erronea', 'No hay ids');
    } */
  }

  resetForm(pedidoForm?: NgForm)
  {
    pedidoForm.reset();
    this.pedidoList = [];

    this.dataSource = new MatTableDataSource(this.pedidoList);
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
