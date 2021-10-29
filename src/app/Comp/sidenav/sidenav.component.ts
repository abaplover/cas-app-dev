import { Component, OnInit, ChangeDetectorRef, ViewChild,EventEmitter,Output, ElementRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  
 
  @ViewChild('snavp') snavp: MatSidenav;
  @Output() isLogout = new EventEmitter<void>();

  @ViewChild('pills-pedidos', {static: true}) namebutton: ElementRef;
  
  mobileQuery: MediaQueryList;

  public get FirebaseloginService(): FirebaseloginService {
    return this._fireloginSer;
  }
  public set FirebaseloginService(value: FirebaseloginService) {
    this._fireloginSer = value;
  }

  fillerNav = [
    { name: 'Inicio', route: 'home', icon: 'home' },
    { name: 'Gestión de pedidos', route: 'pedidos', icon: 'local_shipping' },
    { name: 'Gestión de Cobros', route: 'cobros', icon: 'payment' },
    { name: 'Gestión de Averías', route: 'averias', icon: 'broken_image' },
    { name: 'Datos Maestros', route: 'maestros', icon: 'domain' },
    { name: 'Estructura de la empresa', route: 'estrucempresa', icon: 'bar_chart'},
    { name: 'Estructura DM', route: 'estrucdm', icon: 'bar_chart'},
    { name: 'Reportes', route: 'reports', icon: 'bar_chart'}
  ];

  fillerContent = Array.from({ length: 50 }, () => `[.][.]`);

  private _mobileQueryListener: () => void;



  pillshome          = "nav-link active";
  pillspedidos       = "nav-link";
  pillscobros        = "nav-link";
  pillsaverias       = "nav-link";
  pillsmaestros      = "nav-link";
  pillsestructe      = "nav-link";
  pillsestrustm      = "nav-link";
  pillsreportes      = "nav-link";

  allowNewCounter = false;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _fireloginSer: FirebaseloginService,
    private router:Router,
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    //setTimeout(() => {
    //  this.allowNewCounter = true;
    //}, 2000);
  }


  //Verificar usuario conectado
  public estaConectado: boolean = false;
  public usrname: string;
  public usremail: string;


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  //shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  shouldRun = true;

  ngOnInit(): void {
    this.usuarioconectado();
  }

  
  changeclass(btn: string){
    if (btn=='home'){
      this.pillshome = "nav-link active";
      this.pillscobros = this.pillsestrustm = this.pillsestructe = this.pillsmaestros = this.pillsaverias = this.pillsreportes = this.pillspedidos = "nav-link";
    }
    if (btn=='cobros'){
      this.pillscobros = "nav-link active";
      this.pillshome = this.pillsestrustm = this.pillsestructe = this.pillsmaestros = this.pillsaverias = this.pillsreportes = this.pillspedidos = "nav-link";
    }
    if (btn=='pedidos'){
      this.pillspedidos = "nav-link active";
      this.pillshome = this.pillsestrustm = this.pillsestructe = this.pillsmaestros = this.pillsaverias = this.pillsreportes = this.pillscobros = "nav-link";
    }
    if (btn=='averias'){
      this.pillsaverias = "nav-link active";
      this.pillshome = this.pillsestrustm = this.pillsestructe = this.pillsmaestros = this.pillspedidos = this.pillsreportes = this.pillscobros = "nav-link";
    }
    if (btn=='maestros'){
      this.pillsmaestros = "nav-link active";
      this.pillshome = this.pillsestrustm = this.pillsestructe = this.pillsaverias = this.pillspedidos = this.pillsreportes = this.pillscobros = "nav-link";
      this.snavp.close();
    }
    if (btn=='estrucempresa'){
      this.pillsestructe = "nav-link active";
      this.pillshome = this.pillsestrustm = this.pillsaverias = this.pillsmaestros = this.pillspedidos = this.pillsreportes = this.pillscobros = "nav-link";
      this.snavp.close();
    }
    if (btn=='estrucdm'){
      this.pillsestrustm = "nav-link active";
      this.pillshome = this.pillsaverias = this.pillsestructe = this.pillsmaestros = this.pillspedidos = this.pillsreportes = this.pillscobros = "nav-link";
      this.snavp.close();
    }
    if (btn=='reports'){
      this.pillsreportes = "nav-link active";
      this.pillshome = this.pillsestrustm = this.pillsestructe = this.pillsmaestros = this.pillspedidos = this.pillsaverias = this.pillscobros = "nav-link";
    }
  }

  navegar(url: string){
    //console.log(url);
    this.changeclass(url);
    
    this.router.navigate([url]);
  }

  cerrar() {
    localStorage.removeItem('user');
    localStorage.clear();
    this._fireloginSer.logout();
    this.isLogout.emit();
    this.snavp.close();
    this.navegar('login');
  }  


  //No usado por el momento puesto que llamo 
  //directamente al metodo FirebaseloginService.getcurrentusrtrueorfalse() 
  usuarioconectado(): void{
    if (this._fireloginSer.getCurrentUser() == null){
      this.estaConectado=false;
    }else{
      this.estaConectado=true;
      this.usrname = this._fireloginSer.getCurrentUser().email;
    }
  }

  logout() {
    this._fireloginSer.logout();
    this.isLogout.emit();
    this.navegar('login');
  }

}
