import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterStudentComponent } from './register-student/register-student.component';
import { UpdateStudentComponent } from './update-student/update-student.component';

import { AuthGuardService } from '../services/auth-guard.service';

const routes: Routes = [
  {
    path:'',
    redirectTo:'Home',
    pathMatch:'full'
  },
  {
    path:'Home',
    component:DashboardComponent,
    canActivate: [AuthGuardService]
  },
  {
    path:'RegisterStudent',
    component:RegisterStudentComponent
  },
  {
    path:'UpdateStudent/:id',
    component:UpdateStudentComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
