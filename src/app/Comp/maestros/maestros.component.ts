import { Component, OnInit } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';

@Component({
  selector: 'app-maestros',
  templateUrl: './maestros.component.html',
  styleUrls: ['./maestros.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MaestrosComponent implements OnInit {

  constructor(public FBlogs: FirebaseloginService,private router:Router) { }

  ngOnInit(): void {
    if (!this.FBlogs.getcurrentusrtrueorfalse()){
      this.router.navigate(['login']);
    }
  }

}
