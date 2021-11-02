import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() isLogout = new EventEmitter<void>();
  constructor(private router:Router,public firebaseservices: FirebaseloginService) { }

  ngOnInit(): void {
  }
  navegar(url: string){
    //console.log('Usuario: ',this.firebaseservices.user)
    this.router.navigate([url]);
  }
  logout() {
    this.firebaseservices.logout();
    this.isLogout.emit();
    this.navegar('home');
  }
}
