import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegistrationUpdateDeleteEditService } from 'src/app/features/sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
  public loggedStatus? = '';
  public userOrCoach?: User | Coach;
  public menu = new BehaviorSubject<boolean>(false);
  constructor(
    private service: RegistrationUpdateDeleteEditService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.service.loggedUser.subscribe((res) => {
      this.loggedStatus = res.status;
      this.userOrCoach = res;
    });
  }
  showMenu() {
    this.menu.next(!this.menu.value);
  }
  logOut() {
    this.service.loggedUser.next({
      name: '',
      nickName: '',
      lastname: '',
      email: '',
      phoneNumber: '',
      id: '',
      age: '',
      password: '',
      plans: [],
      status: 'guest',
    });
    this.router.navigate(['/login']);
  }
  navigate() {
    this.router.navigate([`single-coach-info/${this.service.firebaseId}`]);
  }
}
