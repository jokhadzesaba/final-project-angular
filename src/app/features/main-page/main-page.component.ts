import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RegistrationUpdateDeleteEditService } from '../sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { Observable, Subscription } from 'rxjs';
import { Plan } from 'src/app/shared/interfaces/plan';
import { User } from 'src/app/shared/interfaces/user';
import { Router, NavigationExtras } from '@angular/router';



@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss',],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {
  public coaches$!: Observable<Coach[]>;
  public status$!: Observable<string>;
  private loggedUserSubscription: Subscription | undefined;
  private coachesSubscription: Subscription | undefined;
  public likedPlans: string[] = [];
  public id?: number;
  constructor(
    private service: RegistrationUpdateDeleteEditService,
    private cd: ChangeDetectorRef,
    private router:Router,
  ) {}

  ngOnInit() {
    this.loggedUserSubscription = this.service.loggedUser.subscribe(
      (res: User) => {
        this.id = res.id;
      }
    );
    this.status$ = this.service.status;
    this.status$.subscribe((res)=>{
      if (res === 'user') {
        this.service.getUserOrCoach(this.id!, 'users').subscribe((user: User) => {
          if (user.likedPlans) {
            for (const plan of user.likedPlans) {
              this.likedPlans.push(plan.planId);
            }
          }
        });  
      }
    })


    this.coachesSubscription = this.service
      .loadCoaches()
      .subscribe((coaches: Coach[]) => {});
    this.coaches$ = this.service.loadCoaches();
  }

  ngOnDestroy() {
    if (this.loggedUserSubscription) {
      this.loggedUserSubscription.unsubscribe();
    }

    if (this.coachesSubscription) {
      this.coachesSubscription.unsubscribe();
    }
  }
  isPlanLiked(plan: Plan) {
    return this.likedPlans.some((e) => e === plan.planId);
  }

  likePlan(plan: Plan) {
    this.service.likePlan(plan, this.id!).subscribe(() => {
      this.likedPlans.push(plan.planId);
      this.cd.detectChanges()
    });
  }

  unlikePlan(plan: Plan) {
    this.service.unlikePlan(plan, this.id!).subscribe(() => {
      this.likedPlans = this.likedPlans.filter((e) => e !== plan.planId);
      this.cd.detectChanges()
    });
  }
  navigate(plan:Plan, coach:Coach){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        coach:coach.id,
        plan:plan.planId
      }
    }
    this.router.navigate([`/plan/${plan.planId}`], navigationExtras)
  }
}
