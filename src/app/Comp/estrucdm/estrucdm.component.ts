import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseloginService } from 'src/app/services/firebaselogin.service';

@Component({
  selector: 'app-estrucdm',
  templateUrl: './estrucdm.component.html',
  styleUrls: ['./estrucdm.component.css']
})
export class EstrucdmComponent implements OnInit {

  constructor(public FBlogs: FirebaseloginService,private router:Router) { }

  ngOnInit(): void {
    if (!this.FBlogs.getcurrentusrtrueorfalse()){
      this.router.navigate(['login']);
    }
  }

}
