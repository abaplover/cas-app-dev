import { NgModule, LOCALE_ID } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'


import { FormsModule,ReactiveFormsModule } from '@angular/forms';  //<<<< import it here
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeesVe from '@angular/common/locales/es-VE';
registerLocaleData(localeesVe);


import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireStorageModule } from '@angular/fire/storage';

import { AppComponent } from './app.component';


import { AutocompleteLibModule } from 'angular-ng-autocomplete';

// Print modules

import { NgxPrintModule } from 'ngx-print';
import { NgxCurrencyModule } from "ngx-currency";


//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from '../environments/environment';

//Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule} from '@angular/material/table';

//navbar
import { NavbarComponent } from './Comp/navbar/navbar.component';

//sidenav - navbar
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SidenavComponent } from './Comp/sidenav/sidenav.component';

//Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { MatNativeDateModule } from '@angular/material/core';

import {MatInputModule} from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { DataTablesModule } from 'angular-datatables';
import {MatDialogModule} from '@angular/material/dialog';


//Component
import { HomeComponent } from './Comp/home/home.component';
import { ContactoComponent } from './Comp/contacto/contacto.component';
import { AyudaComponent } from './Comp/ayuda/ayuda.component';
import { LoginComponent } from './Comp/login/login.component';
import { AveriasComponent } from './Comp/averias/averias.component';
import { MaestrosComponent } from './Comp/maestros/maestros.component';
import { ReportsComponent } from './Comp/reports/reports.component';
import { PedidosListComponent } from './Comp/pedidos/pedidos-list/pedidos-list.component';
import { PedidoComponent } from './Comp/pedidos/pedido/pedido.component';
import { PedidosComponent } from './Comp/pedidos/pedidos.component';
import { ProductComponent } from './Comp/products/product/product.component';
import { ProductListComponent } from './Comp/products/product-list/product-list.component';
import { MarcaComponent } from './Comp/marcas/marca/marca.component';
import { MarcaListComponent } from './Comp/marcas/marca-list/marca-list.component';
import { UmedidaComponent } from './Comp/umedidas/umedida/umedida.component';
import { UmedidaListComponent } from './Comp/umedidas/umedida-list/umedida-list.component';
import { GarticuloComponent } from './Comp/garticulos/garticulo/garticulo.component';
import { GarticuloListComponent } from './Comp/garticulos/garticulo-list/garticulo-list.component';
import { LprecioListComponent } from './Comp/lprecios/lprecio-list/lprecio-list.component';
import { LprecioComponent } from './Comp/lprecios/lprecio/lprecio.component';
import { ZventaComponent } from './Comp/zonaventas/zventa/zventa.component';
import { ZventaListComponent } from './Comp/zonaventas/zventa-list/zventa-list.component';
import { CpagoComponent } from './Comp/condicionespago/cpago/cpago.component';
import { CpagoListComponent } from './Comp/condicionespago/cpago-list/cpago-list.component';
import { IimpuestoListComponent } from './Comp/iimpuestos/iimpuesto-list/iimpuesto-list.component';
import { IimpuestoComponent } from './Comp/iimpuestos/iimpuesto/iimpuesto.component';
import { IretencionComponent } from './Comp/iretenciones/iretencion/iretencion.component';
import { IretencionListComponent } from './Comp/iretenciones/iretencion-list/iretencion-list.component';
import { MrechazoListComponent } from './Comp/motivorechazos/mrechazo-list/mrechazo-list.component';
import { MrechazoComponent } from './Comp/motivorechazos/mrechazo/mrechazo.component';
import { VpagoComponent } from './Comp/viaspago/vpago/vpago.component';
import { VpagoListComponent } from './Comp/viaspago/vpago-list/vpago-list.component';
import { MaveriaListComponent } from './Comp/averias/maveria-list/maveria-list.component';
import { MaveriaComponent } from './Comp/averias/maveria/maveria.component';
import { VendedorComponent } from './Comp/vendedores/vendedor/vendedor.component';
import { VendedorListComponent } from './Comp/vendedores/vendedor-list/vendedor-list.component';
import { ClientListComponent } from './Comp/clients/client-list/client-list.component';
import { ClientComponent } from './Comp/clients/client/client.component';
import { UserListComponent } from './Comp/users/user-list/user-list.component';
import { UserComponent } from './Comp/users/user/user.component';
import { DatoempComponent } from './Comp/datosemp/datoemp/datoemp.component';
import { TabpedidosComponent } from './Comp/tabpedidos/tabpedidos.component';
import { EstrucempresaComponent } from './Comp/estrucempresa/estrucempresa.component';
import { EstrucdmComponent } from './Comp/estrucdm/estrucdm.component';
import { DatoempListComponent } from './Comp/datosemp/datoemp-list/datoemp-list.component';
import { PedidoEditComponent } from './Comp/pedidos/pedido-edit/pedido-edit.component';
import { TipodComponent } from './Comp/tipod/tipod/tipod.component';
import { TipodListComponent } from './Comp/tipod/tipod-list/tipod-list.component';
import { PedidoShowComponent } from './Comp/pedidos/pedido-show/pedido-show.component';
import { PedidoNfComponent } from './Comp/pedidos/pedido-nf/pedido-nf.component';
import { PedidoNdComponent } from './Comp/pedidos/pedido-nd/pedido-nd.component';
import { PedidoNeComponent } from './Comp/pedidos/pedido-ne/pedido-ne.component';
import { NewpedComponent } from './Comp/pedidos/newped/newped.component';
import { NewpedListComponent } from './Comp/pedidos/newped-list/newped-list.component';
import { GcobroComponent } from './Comp/cobros/gcobro/gcobro.component';
import { GcobroListComponent } from './Comp/cobros/gcobro-list/gcobro-list.component';
import { TabcobrosComponent } from './Comp/tabcobros/tabcobros.component';
import { BancoComponent } from './Comp/bancos/banco/banco.component';
import { BancoListComponent } from './Comp/bancos/banco-list/banco-list.component';
import { GcobrovListComponent } from './Comp/cobros/gcobrov-list/gcobrov-list.component';
import { GcobrocListComponent } from './Comp/cobros/gcobroc-list/gcobroc-list.component';
import { Rep01Component } from './Comp/reports/rep01/rep01.component';
import { Rep02Component } from './Comp/reports/rep02/rep02.component';
import { Rep03Component } from './Comp/reports/rep03/rep03.component';
import { Rep04Component } from './Comp/reports/rep04/rep04.component';
import { TransporteComponent } from './Comp/transportes/transporte/transporte.component';
import { TransporteListComponent } from './Comp/transportes/transporte-list/transporte-list.component';
import { RegistrarAveriasComponent } from './Comp/averias/registrar-averias/registrar-averias.component';
import { ModificarAveriasComponent } from './Comp/averias/modificar-averias/modificar-averias.component';
import { RegAveListComponent } from './Comp/averias/reg-ave-list/reg-ave-list.component';

//Services
import { ToastrModule } from 'ngx-toastr';
import { ProductService } from './services/product.service';
import { PedidoService } from './services/pedido.service';
import { CobrosService } from './services/cobros.service';
import { BancoService } from './services/banco.service';
import { TransporteService } from './services/transporte.service';
import { MarcaService } from './services/marca.service';
import { UmedidaService } from './services/umedida.service';
import { GarticuloService } from './services/garticulo.service';
import { LprecioService } from './services/lprecio.service';
import { ZventaService } from './services/zventa.service';
import { CpagoService } from './services/cpago.service';
import { IimpuestoService } from './services/iimpuesto.service';
import { IretencionService } from './services/iretencion.service';
import { MrechazoService } from './services/mrechazo.service';
import { VpagoService } from './services/vpago.service';
import { MaveriaService } from './services/maveria.service';
import { VendedorService } from './services/vendedor.service';
import { ConexionService } from './services/conexion.service';
import { ClientService } from './services/client.service';
import { AlmacenistaService } from './services/almacenista.service';
import { AlertsService } from './services/alerts.service';
import { FirebaseloginService } from './services/firebaselogin.service';
import { DatoempService } from './services/datoemp.service';
import { TipodService  } from './services/tipod.service';
import { TipodcobrosService  } from './services/tipodcobros.service';
import { GestionaveriasService } from './services/gestionaverias.service';
import { solucionAveriaService } from './services/solucionAveria.service';

import { CurrencyPipe } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getDutchPaginatorIntl } from './Comp/matPaginatorCustom/dutch-paginator-intl';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AveriaShowComponent } from './Comp/averias/averia-show/averia-show.component';
import { CerrarAveriasComponent } from './Comp/averias/cerrar-averias/cerrar-averias.component';
import { PrintLabelComponent } from './Comp/print-label/print-label.component';
import { PedidosLayoutComponent } from './Comp/pedidos/pedidos-layout/pedidos-layout.component';
import { TotalesDePedidosComponent } from './Comp/totales-de-pedidos/totales-de-pedidos.component';
import { ClientAutoCompleteComponent } from './Comp/client-auto-complete/client-auto-complete.component';
import { PedidoAlmacenComponent } from './Comp/pedidos/pedido-almacen/pedido-almacen.component';
import { ReportsAveriasComponent } from './Comp/reports-averias/reports-averias.component';
import { GeneralReportComponent } from './Comp/reports-averias/general-report/general-report.component';
import { TotalesDeAveriasComponent } from './Comp/totales-de-averias/totales-de-averias.component';
import { DetalleComponent } from './Comp/reports-averias/detalle/detalle.component';
import { GcobroregListComponent } from './Comp/cobros/gcobroreg-list/gcobroreg-list.component';

import { MonedaComponent } from './Comp/monedas/moneda/moneda.component';
import { MonedaListComponent } from './Comp/monedas/moneda-list/moneda-list.component';
import { TipodCobrosComponent } from './Comp/tipodoc-cobros/tipod-cobros/tipod-cobros.component';
import { TipodcobrosListComponent } from './Comp/tipodoc-cobros/tipodcobros-list/tipodcobros-list.component';
import { ReportsCobrosComponent } from './Comp/reports-cobros/reports-cobros.component';
import { GeneralComponent } from './Comp/reports-cobros/general/general.component';
import { TotalesDeCobrosComponent } from './Comp/totales-de-cobros/totales-de-cobros.component';

import { CambiarIdComponent } from './Comp/cambiarids/cambiar-id/cambiar-id.component';
import { IdsListComponent } from './Comp/cambiarids/ids-list/ids-list.component';
import { PedidosCobrosComponent } from './Comp/reports-cobros/pedidos-cobros/pedidos-cobros.component';
import { PedidoscobrosShowComponent } from './Comp/cobros/pedidoscobros-show/pedidoscobros-show.component';
import { TotalesPedCobrosComponent } from './Comp/totales-ped-cobros/totales-ped-cobros.component';


/* const firebase = require('firebase');
firebase.firestore().settings({experimentalForceLongPolling: true}); */

//
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidenavComponent,
    HomeComponent,
    ContactoComponent,
    AyudaComponent,
    LoginComponent,
    AveriasComponent,
    MaestrosComponent,
    ReportsComponent,
    PedidosListComponent,
    PedidoComponent,
    PedidosComponent,
    ProductComponent,
    ProductListComponent,
    MarcaComponent,
    MarcaListComponent,
    UmedidaComponent,
    UmedidaListComponent,
    GarticuloComponent,
    GarticuloListComponent,
    LprecioListComponent,
    LprecioComponent,
    ZventaComponent,
    ZventaListComponent,
    CpagoComponent,
    CpagoListComponent,
    IimpuestoListComponent,
    IimpuestoComponent,
    IretencionComponent,
    IretencionListComponent,
    MrechazoListComponent,
    MrechazoComponent,
    VpagoComponent,
    VpagoListComponent,
    MaveriaListComponent,
    MaveriaComponent,
    VendedorComponent,
    VendedorListComponent,
    UserListComponent,
    UserComponent,
    ClientListComponent,
    ClientComponent,
    EstrucempresaComponent,
    EstrucdmComponent,
    DatoempComponent,
    DatoempListComponent,
    TabpedidosComponent,
    PedidoEditComponent,
    TipodComponent,
    TipodListComponent,
    PedidoShowComponent,
    PedidoNfComponent,
    PedidoNdComponent,
    PedidoNeComponent,
    NewpedComponent,
    NewpedListComponent,
    GcobroComponent,
    GcobroListComponent,
    TabcobrosComponent,
    BancoComponent,
    BancoListComponent,
    GcobrovListComponent,
    GcobrocListComponent,
    Rep01Component,
    Rep02Component,
    Rep03Component,
    Rep04Component,
    TransporteComponent,
    TransporteListComponent,
    RegistrarAveriasComponent,
    ModificarAveriasComponent,
    RegAveListComponent,
    AveriaShowComponent,
    CerrarAveriasComponent,
    PrintLabelComponent,
    PedidosLayoutComponent,
    TotalesDePedidosComponent,
    ClientAutoCompleteComponent,
    PedidoAlmacenComponent,
    ReportsAveriasComponent,
    GeneralReportComponent,
    TotalesDeAveriasComponent,
    DetalleComponent,
    GcobroregListComponent,
    MonedaComponent,
    MonedaListComponent,
    TipodCobrosComponent,
    TipodcobrosListComponent,
    ReportsCobrosComponent,
    GeneralComponent,
    TotalesDeCobrosComponent,
    CambiarIdComponent,
    IdsListComponent,
    PedidosCobrosComponent,
    PedidoscobrosShowComponent,
    TotalesPedCobrosComponent,

  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAnalyticsModule,
    FormsModule,
    NgbModule,
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    ToastrModule.forRoot(),
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatCheckboxModule,
    HttpClientModule,
    AngularFireStorageModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatNativeDateModule,
    AutocompleteLibModule,
    MatSelectModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    DataTablesModule,
    MatTooltipModule,
    NgxPrintModule,
    MatProgressSpinnerModule,
    NgxCurrencyModule,
    MatRadioModule
  ],
  providers: [
    PedidoService,
    CobrosService,
    BancoService,
    TransporteService,
    ProductService,
    MarcaService,
    UmedidaService,
    GarticuloService,
    LprecioService,
    ZventaService,
    CpagoService,
    IimpuestoService,
    IretencionService,
    MrechazoService,
    VpagoService,
    MaveriaService,
    solucionAveriaService,
    VendedorService,
    ConexionService,
    ClientService,
    AlmacenistaService,
    AlertsService,
    FirebaseloginService,
    CurrencyPipe,
    DatoempService,
    TipodService,
    TipodcobrosService,
    GestionaveriasService,
    { provide: LOCALE_ID, useValue: 'es-VE'},
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() },
  ],
  bootstrap: [AppComponent],
  entryComponents:[PedidoShowComponent]
})

export class AppModule { }
