import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';

@Component({
  selector: 'app-reports-cobros',
  templateUrl: './reports-cobros.component.html',
  styleUrls: ['./reports-cobros.component.css']
})
export class ReportsCobrosComponent implements OnInit {

  constructor(public FBlogs: FirebaseloginService,private router:Router) {}
    
    ngOnInit(): void {
      if (!this.FBlogs.getcurrentusrtrueorfalse()){
        this.router.navigate(['login']);
      }
    }

}
