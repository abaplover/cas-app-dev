import { Component, OnInit } from '@angular/core';
import { FirebaseloginService } from '../../services/firebaselogin.service';
  import { from } from 'rxjs';

  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showModal: boolean;
  registerForm: FormGroup;
  submitted = false;

  isSignedIn = false;
  userError:boolean=false;

  constructor(public firebaseservices: FirebaseloginService,private formBuilder: FormBuilder,private router:Router) { 

  }

  ngOnInit(): void {
    if (localStorage.getItem('user') != null)
      this.isSignedIn=true
    else
      this.isSignedIn=false

      this.registerForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });

//console.log('thisisSignedIn: ',this.isSignedIn)


  }

  async onSignup(formemail: string, formpasswd: string){
    await this.firebaseservices.signup(formemail,formpasswd)
    if(this.firebaseservices.fbconectado)
      this.isSignedIn = true;

  }

  async onSignin(formemail: string, formpasswd: string){
    await this.firebaseservices.signin(formemail,formpasswd)
    //await this.firebaseservices.signin("a@a.com","123456")
    if(this.firebaseservices.fbconectado){
      this.isSignedIn = true;
       this.navegar('home');
    }
      
    if (!this.registerForm.invalid) {
      if (this.firebaseservices.getCurrentUser() == null){
        this.userError=true;
      }else{
        this.userError=false;
      }
    }
  }

  handleLogout(){
    this.isSignedIn = false; 
    //console.log('sesion Outs');
  }

  navegar(url: string){
    //console.log(url);   
    this.router.navigate([url]);
  }

   // convenience getter for easy access to form fields
   get f() { return this.registerForm.controls; }

   onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
       return;
    }

    if(this.submitted){
       this.showModal = false;
    }

   }
 


}
