import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';

//declare const $;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  constructor(public FBlogs: FirebaseloginService,private router:Router) {}
  
  ngOnInit(): void {
    if (!this.FBlogs.getcurrentusrtrueorfalse()){
      this.router.navigate(['login']);
    }
  }


}//export class ReportsComponent
