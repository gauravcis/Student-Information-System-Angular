import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UpdateStudentComponent } from './update-student/update-student.component';
import { RegisterStudentComponent } from './register-student/register-student.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DashboardComponent, UpdateStudentComponent, RegisterStudentComponent],
  imports: [
    CommonModule,
    StudentRoutingModule,
    ReactiveFormsModule
  ]
})
export class StudentModule { }
