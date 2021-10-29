import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserInterface } from "../models/user-interface";
import { isNullOrUndefined } from "util";
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseloginService {

  fbconectado: boolean = false;

  //user: string;

  constructor(public AngFirAut: AngularFireAuth) { }

  async signin(emaDire:string, passwd: string){
  await this.AngFirAut.signInWithEmailAndPassword(emaDire,passwd)
    .then(fbres=>{
      this.fbconectado = true
      //this.AngFirAut.setPersistence(auth.Auth.Persistence.SESSION);
      localStorage.setItem('user',JSON.stringify(fbres.user))
    }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  }



  async signup(emaDire:string, passwd: string){
    await this.AngFirAut.createUserWithEmailAndPassword(emaDire,passwd)
    .then(fbres=>{
      this.fbconectado = true
      localStorage.setItem('user',JSON.stringify(fbres.user))
    }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  }

  logout(){
    this.AngFirAut.signOut();
    localStorage.removeItem('user');
    this.fbconectado = false;
  }

  getCurrentUser(): UserInterface {
    let user_string = localStorage.getItem("user");
    if (!isNullOrUndefined(user_string)) {
      let user: UserInterface = JSON.parse(user_string);
      return user;
    } else {
      return null;
    }
  }



  getcurrentusrtrueorfalse(): boolean {
    let user_string = localStorage.getItem("user");
    if (!isNullOrUndefined(user_string)) {
      let user: UserInterface = JSON.parse(user_string);
      return true;
    } else {
      return false;
    }
  }







}
