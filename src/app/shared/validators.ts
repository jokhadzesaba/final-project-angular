import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { RegistrationUpdateDeleteEditService } from '../features/sharedServices/registration-update-delete-edit.service';
import { Observable, forkJoin, map } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class CostumValidators {
  validationMessages = {
    nickName: {
      required: 'Nickname is required.',
    },
    email: {
      required: 'Email is required.',
      email: 'Please enter a valid email address.',
      EmailRepetition: 'This email is already in use.',
    },
    password: {
      required: 'Password is required.',
    },
    confirmPassword: {
      required: 'Confirm Password is required.',
      passwordMatch: 'Passwords do not match.',
    },
  };
  constructor(private service: RegistrationUpdateDeleteEditService) {}
  EmailRepetition(email: string) {
    return forkJoin([
      this.service.loadUsers(),
      this.service.loadCoaches(),
    ]).pipe(
      map(([users, coaches]) => {
        const usersData = Object.values(users);
        const coachData = Object.values(coaches);
        const isEmailRepetitive =
          usersData.some((user) => user.email === email) ||
          coachData.some((coach) => coach.email === email);
        if (isEmailRepetitive) {
          alert('this email is already registered');
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
