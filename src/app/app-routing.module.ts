import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './Comp/home/home.component';
import { ContactoComponent } from './Comp/contacto/contacto.component';
import { LoginComponent } from './Comp/login/login.component';
import { AyudaComponent } from './Comp/ayuda/ayuda.component';
import { PedidosComponent } from './Comp/pedidos/pedidos.component';
import { GcobroComponent } from './Comp/cobros/gcobro/gcobro.component';
import { AveriasComponent } from './Comp/averias/averias.component';
import { MaestrosComponent } from "./Comp/maestros/maestros.component";
import { EstrucempresaComponent } from "./Comp/estrucempresa/estrucempresa.component";
import { EstrucdmComponent } from "./Comp/estrucdm/estrucdm.component";
import { ReportsComponent } from "./Comp/reports/reports.component";
import { TabpedidosComponent } from "./Comp/tabpedidos/tabpedidos.component";
import { TabcobrosComponent } from "./Comp/tabcobros/tabcobros.component";
import { SidenavComponent } from './Comp/sidenav/sidenav.component';
import { ReportsAveriasComponent } from './Comp/reports-averias/reports-averias.component';
import { ReportsCobrosComponent } from './Comp/reports-cobros/reports-cobros.component';
import { TabTransportePedidosComponent } from './Comp/tab-transporte-pedidos/tab-transporte-pedidos.component';

const routes: Routes = [
  { path:'home' ,component: HomeComponent },
  { path: 'contacto', component:ContactoComponent},
  { path: 'ayuda', component:AyudaComponent},
  { path: 'login', component:LoginComponent},
  { path: 'pedidos', component:TabpedidosComponent},
  { path: 'transporte-pedidos', component:TabTransportePedidosComponent},
  { path: 'cobros', component: TabcobrosComponent},
  { path: 'averias', component:AveriasComponent },
  { path: 'maestros', component:MaestrosComponent },
  { path: 'estrucempresa', component:EstrucempresaComponent },
  { path: 'estrucdm', component:EstrucdmComponent },
  { path: 'reports', component:ReportsComponent },
  { path: 'reports-averias', component:ReportsAveriasComponent },
  { path: 'reports-cobros', component:ReportsCobrosComponent },
  { path: '',   redirectTo: '/login', pathMatch: 'full' }
                    
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
