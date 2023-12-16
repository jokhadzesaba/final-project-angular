import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { User } from 'src/app/shared/interfaces/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CalculateService {

  constructor(private http:HttpClient, private service:RegistrationUpdateDeleteEditService, private router:Router) { }

  addToUser(which:'bmi'| 'bmr' | 'orm', value:number, who:'users'| 'coaches'){
    
        const update = value.toFixed(1);
        if (which === 'bmi') {
          this.http.patch(`${this.service.url}/${who}/${this.service.firebaseId}.json`, {bmi:update}).subscribe()
          
        }else if (which === 'bmr') {
          this.http.patch(`${this.service.url}/${who}/${this.service.firebaseId}.json`, {bmr:update}).subscribe()
          
        }else if (which === 'orm') {
          this.http.patch(`${this.service.url}/${who}/${this.service.firebaseId}.json`, {orm:update}).subscribe()        
        }
  
  }
  navigateToCoach(coachId: string) {
    this.router.navigate([`/single-coach-info/${coachId}`]);
  }
}
