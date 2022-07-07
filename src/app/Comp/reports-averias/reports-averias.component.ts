import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';

@Component({
  selector: 'app-reports-averias',
  templateUrl: './reports-averias.component.html',
  styleUrls: ['./reports-averias.component.css']
})
export class ReportsAveriasComponent implements OnInit {

    constructor(public FBlogs: FirebaseloginService,private router:Router) {}
    
    ngOnInit(): void {
      if (!this.FBlogs.getcurrentusrtrueorfalse()){
        this.router.navigate(['login']);
      }
    }
  
  
}//export class ReportsComponent
  
