import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {Router} from '@angular/router'

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})
export class RegisterStudentComponent implements OnInit {

  mainLoginForm : FormGroup;
  apiResult;
  constructor(public _FormBuilder:FormBuilder,public AuthService:AuthService,private Router:Router) { }

  ngOnInit(): void {
    this.mainLoginForm = this._FormBuilder.group({
      Fullname : ['',[Validators.required]],
      Email : ['',[Validators.required]],
      DOB : ['',[Validators.required]],
      contact : ['',[Validators.required]],
      address : ['',[Validators.required]],
      password : ['',[Validators.required]],
    });
  }

  onSubmit=()=>{
    if(this.mainLoginForm.invalid)
    {
      return
    }
    else
    {
      this.AuthService.registerStudent(this.mainLoginForm.value).subscribe(res => {
        Swal.fire('Student Registered');
        this.Router.navigateByUrl('Dashboard');
      })
    }
    
  }
}
