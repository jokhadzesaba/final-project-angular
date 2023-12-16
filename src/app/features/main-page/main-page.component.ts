import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { RegistrationUpdateDeleteEditService } from '../sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { Observable } from 'rxjs';
import { Plan } from 'src/app/shared/interfaces/plan';
import { User } from 'src/app/shared/interfaces/user';
import { Router, NavigationExtras } from '@angular/router';
import { SharedService } from '../sharedServices/shared.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {
  public coaches$!: Coach[];
  public status$!: Observable<String>;

  constructor(
    private service: RegistrationUpdateDeleteEditService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private sharedService:SharedService
  ) {}

  ngOnInit() {
    this.status$ = this.service.status;
    this.service.loggedUser.subscribe((user: User) => {
      this.service.loadCoaches().subscribe((coaches) => {
        this.coaches$ = Object.values(coaches);
        if (user.status === 'user') {
          if (user.likedPlans) {
            Object.values(user.likedPlans).forEach(plans => this.sharedService.likedPlans.push(plans.planId))
          }
        }
        this.cd.detectChanges();
      });
    });
  }

  isPlanLiked(plan: Plan) {
    return this.sharedService.likedPlans.some((e) => e === plan.planId);
  }
  likePlan(plan: Plan) {
    this.service.likePlan(plan).subscribe(() => {
      this.sharedService.likedPlans.push(plan.planId);
      this.cd.detectChanges();
    });
  }

  unlikePlan(plan: Plan) {
    this.service.unlikePlan(plan).subscribe(() => {
      this.sharedService.likedPlans = this.sharedService.likedPlans.filter((e) => e !== plan.planId);
      this.cd.detectChanges();
    });
  }
  navigate(plan: Plan) {
    this.sharedService.navigateToPlan(plan.planId)
  }
}
