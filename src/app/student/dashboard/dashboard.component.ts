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
    this.username = sessionStorage.getItem('name')

    this.GetUserList(this.RefreshCallbackFunction());
  }

  RefreshCallbackFunction= async()=> { 
    console.log("This is a callback function.") ;
    await this._AuthService.GenrateNewToken();
}
GetUserList=(Refresh)=> { 
    console.log( "Running function first with message: "); 
    this._AuthService.getUserList().subscribe(data=>{
      console.log(data)
      this.StudnetList = data;
    },error => {
      if(error.status == 401)
      {
        console.log(' Token Expired or Missing 401');
      }
    });

    if (typeof Refresh == "function") 
    {
      Refresh(); 
    }
        
} 



  logout= ()=>{
    this.AuthService.logout()
    this._Router.navigateByUrl('auth')
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
              this._Router.navigate([DashboardComponent]);
          });
          }
          
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled','Your Record is safe :)','error')
      }
    })
  }
}
