import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { User } from 'src/app/shared/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class CalculateService {

  constructor(private http:HttpClient, private service:RegistrationUpdateDeleteEditService) { }

  addToUser(which:'bmi'| 'bmr' | 'orm', value:number, who:'users'| 'coaches', id:string){
    this.service.getUserOrCoach(id, who).subscribe((res:User|Coach)=>{
        const update = value.toFixed(1);
        if (which === 'bmi') {
          this.http.patch(`http://localhost:3000/${who}/${id}`, {bmi:update}).subscribe()
          
        }else if (which === 'bmr') {
          this.http.patch(`http://localhost:3000/${who}/${id}`, {bmr:update}).subscribe()
          
        }else if (which === 'orm') {
          this.http.patch(`http://localhost:3000/${who}/${id}`, {orm:update}).subscribe()        
        }
    })
  }
}
