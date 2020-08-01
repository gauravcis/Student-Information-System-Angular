import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {AuthService} from './auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private AuthService:AuthService,private Router:Router) { }

  canActivate(): boolean {
    const isTokenAvaiable = this.AuthService.isTokenAvaiable();

    //console.log("isTokenAvaiable",isTokenAvaiable)
    if (isTokenAvaiable) 
    {
      return true;
    }
    else
    {
       Swal.fire(`Please Login`,'You are not allowed to access','error');
       this.AuthService.logout();
      return false;
    }    
  }
}
