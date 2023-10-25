import { Component, OnInit } from '@angular/core';
import { RegistrationUpdateDeleteEditService } from 'src/app/features/sharedServices/registration-update-delete-edit.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit{
    public loggedStatus? = ''
    constructor(private service:RegistrationUpdateDeleteEditService){

    }  
  ngOnInit(): void {
    this.service.status.subscribe(res=>{
      this.loggedStatus = res
      console.log(this.loggedStatus);
      
    })
  }
}
