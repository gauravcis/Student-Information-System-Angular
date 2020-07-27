import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { async } from 'rxjs/internal/scheduler/async';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  data;
  baseURl = "https://localhost:44388/api/";
  constructor(private http:HttpClient) { }

 
  DoLogin=(formData)=>{
    var DataObj = {EmailOrId:'',Password:''};
    DataObj.EmailOrId = formData.Email;
    DataObj.Password = formData.Password;
    return this.http.post(this.baseURl + "Auth/login",DataObj)
  }

  SaveLogin=(data)=>{
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


  IsUserStillLoggedin= async()=>{
    
    const isTokenExpired  = this.isTokenExpired();

    console.log("isTokenExpired",isTokenExpired)
    if(isTokenExpired)
    {
       this.GenrateNewToken();
      
    }
    else
    {
      //can access
      return true
    }
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

  logout = () =>{
    sessionStorage.removeItem('auth')
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('jwtToken')
    sessionStorage.removeItem('message')
    sessionStorage.removeItem('name')
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
   var headers = this.getToken();
    return this.http.get(this.baseURl + "Student/GetStudentList",{headers})
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
}
