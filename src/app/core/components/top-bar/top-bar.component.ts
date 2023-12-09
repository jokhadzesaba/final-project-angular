import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


import { Router } from '@angular/router';
import { RegistrationUpdateDeleteEditService } from 'src/app/features/sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { User } from 'src/app/shared/interfaces/user';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit{
    public loggedStatus? = '';
    public userOrCoach?:User|Coach


    constructor(private service:RegistrationUpdateDeleteEditService,private router:Router,
      private firebase: HttpClient ){

    }  
  ngOnInit(): void {
    
    this.service.loggedUser.subscribe(res=>{
      this.loggedStatus = res.status
      this.userOrCoach = res
      console.log(this.loggedStatus);
    })
  }
  logOut(){
    this.service.loggedUser.next({
      name: '',
      nickName: '',
      lastname: '',
      email: '',
      phoneNumber: '',
      id:'',
      age: '',
      password: '',
      plans: [],
      status: 'guest',
    });
    this.router.navigate(['/login'])
    
  }
}
