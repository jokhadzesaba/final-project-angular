import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject} from 'rxjs';
import { RegistrationUpdateDeleteEditService } from 'src/app/features/sharedServices/registration-update-delete-edit.service';
import { SharedService } from 'src/app/features/sharedServices/shared.service';
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
  public images: string[] = []
  public menu = new BehaviorSubject<boolean>(false);
  constructor(
    private sharedService:SharedService,
    private service: RegistrationUpdateDeleteEditService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.service.loggedUser.subscribe((res) => {
      this.loggedStatus = res.status;
      this.userOrCoach = res;
      this.images = this.sharedService.topBarFooterImg
    });
  }
  showMenu() {
    this.menu.next(!this.menu.value);
  }
  logOut() {
    this.service.loggedUser.next({
      nickName: '',
      email: '',
      id: '',
      password: '',
      plans: [],
      status: 'guest',
      profileImgUrl:'',
      registrationDate:new Date(),
    });
    this.router.navigate(['/login']);
  }
  navigate() {
    this.router.navigate([`single-coach-info/${this.service.firebaseId}`]);
  }
}
