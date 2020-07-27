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
    const IsUserStillLoggedin = this.AuthService.IsUserStillLoggedin();
    if (IsUserStillLoggedin) 
    {
      return true;
    }
    else
    {
      const IsUserStillLoggedin = this.AuthService.IsUserStillLoggedin();
      if (IsUserStillLoggedin) 
      {
        return true;
      }
      else
      {
        return false;
      }
    }
    // Swal.fire('Wait',`Please Login to Access ......`,'warning')
    // this.Router.navigate(['auth']);
    //   return false;
    
  }
}
