import { Component, OnInit } from '@angular/core';

import {ActivatedRoute, Router} from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-update-student',
  templateUrl: './update-student.component.html',
  styleUrls: ['./update-student.component.css']
})
export class UpdateStudentComponent implements OnInit {

  mainLoginForm : FormGroup;
  currentStd;
  studentId;
  constructor(private route: ActivatedRoute,public _FormBuilder:FormBuilder,public AuthService:AuthService,private Router:Router) {
    this.route.params.subscribe(params => this.AuthService.getStudentByID(params.id).subscribe(res=>{
      this.currentStd = res;
      this.studentId = this.currentStd.studentId;
    }));
    
}

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
      this.AuthService.UpdateStudent(this.currentStd.studentId,this.mainLoginForm.value).subscribe(res => {
        Swal.fire('Student Updated');
        this.Router.navigateByUrl('Dashboard');
      })
    }
    
  }
}
