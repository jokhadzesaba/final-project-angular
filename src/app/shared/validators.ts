import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { RegistrationUpdateDeleteEditService } from '../features/sharedServices/registration-update-delete-edit.service';
import { forkJoin, map } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class CostumValidators {
  constructor(private service: RegistrationUpdateDeleteEditService) {}
  matchPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');
      if (password?.value !== confirmPassword?.value) {
        return { passwordMatch: true };
      }
      return null;
    };
  } 
  EmailRepetition(): ValidatorFn {
    return (control: AbstractControl) => {
      return forkJoin([
        this.service.loadUsers(),
        this.service.loadCoaches()
      ]).pipe(
        map(([users, coaches]) => {
          const userEmail = control.value;
          const isEmailRepetitive = users.some(user => user.email === userEmail) ||
                                    coaches.some(coach => coach.email === userEmail);
          return isEmailRepetitive ? { EmailRepetition: true } : null;
        })
      );
    };
  }
}

