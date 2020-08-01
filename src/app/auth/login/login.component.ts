import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import { Router } from '@angular/router'
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  mainLoginForm : FormGroup;
  apiResult;
  constructor(private spinner: NgxSpinnerService,public _FormBuilder:FormBuilder,private _AuthService:AuthService,private _Router:Router,)
  {
  }

  ngOnInit() {
      this.mainLoginForm = this._FormBuilder.group({
        Email : ['',[Validators.required]],
        Password : ['',[Validators.required]]
      });
  }

  onSubmit(){
    this.spinner.show();
    this._AuthService.DoLogin(this.mainLoginForm.value).subscribe(data => {
      console.log(data);
      this.apiResult = data;
      if(this.apiResult.status == 200)
      {
        this._AuthService.SaveLogin(this.apiResult);
        this._Router.navigate(['Dashboard']);
      }
      else
      {
        Swal.fire("Stop !!!", this.apiResult.message, "error");
      }
      this.spinner.hide();
    },error =>{

      if(error.status != 200)
      {
        Swal.fire("Sorry !!!", "Api not Responding", "warning");
      }

      this.spinner.hide();
      console.log(error.status);
      //this._Router.navigateByUrl("Stock");
    }
    )
  }
}
