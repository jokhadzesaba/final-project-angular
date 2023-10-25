import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RegistrationUpdateDeleteEditService } from '../sharedServices/registration-update-delete-edit.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserPageGuard implements CanActivate {

  constructor(private registrationService: RegistrationUpdateDeleteEditService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.registrationService.loggedUser.pipe(
      map((res) => {
        if (res.status === 'user') {
          return true;
        } else {
          this.router.navigate(['/login']);
          alert("registrate or log in to see page")
          return false;
        }
      })
    );
  }
}
