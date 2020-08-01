import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { async } from 'rxjs/internal/scheduler/async';
import { catchError, tap, switchMap } from 'rxjs/operators';
import {Router} from '@angular/router'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  data;
  baseURl = "https://localhost:44388/api/";
  constructor(private http:HttpClient,private Router:Router) { }

 
  DoLogin=(formData)=>{
    var DataObj = {EmailOrId:'',Password:''};
    DataObj.EmailOrId = formData.Email;
    DataObj.Password = formData.Password;
    return this.http.post(this.baseURl + "Auth/login",DataObj)
  }

 
  SaveLogin=(data)=>{
    sessionStorage.setItem('JwtTokenExpirey',data.jwtTokenExpirey)
    sessionStorage.setItem('RefreshTokenExpire',data.refreshTokenExpire)
    sessionStorage.setItem('auth',data.auth)
    sessionStorage.setItem('email',data.email)
    sessionStorage.setItem('jwtToken',data.jwtToken)
    sessionStorage.setItem('message',data.message)
    sessionStorage.setItem('name',data.name)
    sessionStorage.setItem('RefreshToken',data.refreshToken)
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0); 
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  GenrateNewToken = () => {
    var obj = {AccessToken:'',RefreshToken:''};
    obj.AccessToken =  sessionStorage.getItem('jwtToken');
    obj.RefreshToken = sessionStorage.getItem('RefreshToken');
    this.http.post(this.baseURl + "Auth/RefreshToken",obj).subscribe(res => {
      this.data = res;
      sessionStorage.setItem('jwtToken',this.data.newjwtToken);
    });
  }

  isTokenExpired(token?: string): boolean {
    if(!token) token =  sessionStorage.getItem('jwtToken');
    if(!token) return true;

    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    var temp = !(date.valueOf() > new Date().valueOf());
    
    return temp;    
  }

  isTokenAvaiable =()=>{
    var token = sessionStorage.getItem('jwtToken');
    if(token === null)
    {
      return false
    }
    else
    {
      return true
    }
  }


  logout = () =>{
    sessionStorage.removeItem('auth')
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('jwtToken')
    sessionStorage.removeItem('message')
    sessionStorage.removeItem('name')
    sessionStorage.removeItem('JwtTokenExpirey')
    sessionStorage.removeItem('RefreshToken')
    sessionStorage.removeItem('RefreshTokenExpire')
    this.Router.navigateByUrl('auth')
  }


  getToken = () => {
    var jwtToken =  sessionStorage.getItem('jwtToken')
    const headers = new HttpHeaders(
      {
        'Authorization':`Bearer ${jwtToken}`
      });
      return headers
  }

  getUserList = () => {
  //  var headers = this.getToken();
    return this.http.get(this.baseURl + "Student/GetStudentList")
  }

  deleteStudent = (id) =>{
    var jwtToken =  sessionStorage.getItem('jwtToken')
    const headers = new HttpHeaders(
      {
        'Authorization':`Bearer ${jwtToken}`
      });
      return this.http.delete(this.baseURl + `Student/DeleteStudent?StudentId=${id}`,{headers})
  }

  registerStudent = (formData) =>{
      return this.http.post(this.baseURl + `Student/RegisterStudent`,formData)
  }

  getStudentByID = (id)=>{
    var jwtToken =  sessionStorage.getItem('jwtToken')
    const headers = new HttpHeaders(
      {
        'Authorization':`Bearer ${jwtToken}`
      });
    return this.http.get(this.baseURl + `Student/GetStudent?StudentId=${id}`,{headers})
  }

  UpdateStudent=(id,data)=>{
    var jwtToken =  sessionStorage.getItem('jwtToken')
    const headers = new HttpHeaders(
      {
        'Authorization':`Bearer ${jwtToken}`
      });
    return this.http.put(this.baseURl + `Student/UpdateStudent?StudentId=${id}`,data,{headers})
  }

  getNewAccessToken() {
    var obj = {AccessToken:'',RefreshToken:''};
    obj.AccessToken =  sessionStorage.getItem('jwtToken');
    obj.RefreshToken = sessionStorage.getItem('RefreshToken');

    return this.http.post(this.baseURl + "Auth/RefreshToken",obj, {
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.body.newjwtToken);
      })
    )
  }

  setAccessToken(accessToken: string) {
    sessionStorage.setItem('jwtToken', accessToken)
  }
}
