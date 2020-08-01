import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import { async } from 'rxjs/internal/scheduler/async';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username;
  StudnetList;
  constructor(private AuthService:AuthService,private _Router:Router,private _AuthService:AuthService) { 
 

  }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('name');
      this._AuthService.getUserList().subscribe(data=>{
        this.StudnetList = data;
      });        
  }






  logout= ()=>{
    this.AuthService.logout();
  }




  Delete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This Record will be deleted from database !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) 
      {
        this._AuthService.deleteStudent(id).subscribe(
          data=>
          {
            Swal.fire('Deleted!','Your Record has been deleted.','success')
            this._Router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
              this._Router.navigateByUrl('Dashboard/Home');
          });
          }
          
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled','Your Record is safe :)','error')
      }
    })
  }
}
