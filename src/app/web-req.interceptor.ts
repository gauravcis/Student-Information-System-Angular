import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, empty, Subject } from 'rxjs';
import { AuthService } from './services/auth.service';
import { catchError, tap, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable()
export class WebReqInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}
  refreshingAccessToken: boolean;

  accessTokenRefreshed: Subject<any> = new Subject();

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<any> 
  {
   // console.log(request.headers.get("authorization"))
    request = this.addAuthHeader(request);
    //console.log(request.headers.get("authorization"))
    // call next() and handle the response
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) 
        {
          console.log("got error 401");
          // 401 error so we are unauthorized
  
          // refresh the access token
          return this.refreshAccessToken()
            .pipe(
              switchMap(() => {
                request = this.addAuthHeader(request);
                console.log(request.headers.get("authorization"))
                return next.handle(request);
              }),
              catchError((err: HttpErrorResponse) => {

                if(err.status === 400)
                {
                 Swal.fire('Please Log-in Again','You have Been Logged-out Due to inactivity from a long time','warning')
                   this.authService.logout();
                    return empty();
                }
                else
                {
                  //alert(err);
                  console.log(err);
                  return empty();
                }
                
               
              })
            );
        }
  
        return throwError(error);
      })
    ); 
  }


  addAuthHeader(request: HttpRequest<any>) {
    // get the access token
    const token =  sessionStorage.getItem('jwtToken')
    if (token) {
      // append the access token to the request header
      return request.clone({
        setHeaders: {
          'Authorization':`Bearer ${token}`
        }
      });
    }
    return request;
  }

  refreshAccessToken() 
  {
    if (this.refreshingAccessToken) 
    {
      return new Observable(observer => {
        this.accessTokenRefreshed.subscribe(() => {
          // this code will run when the access token has been refreshed
          observer.next();
          observer.complete();
        });
      });
    } 
    else 
    {
      this.refreshingAccessToken = true;
      // we want to call a method in the auth service to send a request to refresh the access token
      return this.authService.getNewAccessToken().pipe(
        tap(() => {
          console.log("Access Token Refreshed!");
          this.refreshingAccessToken = false;
          this.accessTokenRefreshed.next();
        })
      );
    }
  }
}
