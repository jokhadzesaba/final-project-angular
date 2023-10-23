import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RegistrationUpdateDeleteEditService } from '../sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { Exercise } from 'src/app/shared/interfaces/exercise';
import { Observable, Subscription } from 'rxjs';
import { Plan } from 'src/app/shared/interfaces/plan';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {
  public coaches$!: Observable<Coach[]>;
  public status$!: Observable<string>;
  private loggedUserSubscription: Subscription | undefined;
  private coachesSubscription: Subscription | undefined;
  public id?: number;
  constructor(
    private service: RegistrationUpdateDeleteEditService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loggedUserSubscription = this.service.loggedUser.subscribe(
      (res: User) => {
        this.id = res.id;
      }
    );
    this.status$ = this.service.status

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
  likePlan(plan: Plan) {
    let alreadyLiked: Plan | undefined = undefined;
    this.service.loggedUser.subscribe((res: User) => {
      if (res.likedPlans) {
        alreadyLiked = res.likedPlans.find((pl) => pl.name === plan.name);
      }
      if (alreadyLiked === undefined) {
        this.service.likePlan(plan, this.id!);
        this.coaches$ = this.service.loadCoaches();
        this.cd.detectChanges()
      }
    });
  }
  
  unlikePlan(plan: Plan) {
    let alreadyUnliked: Plan | undefined = undefined;
    this.service.unlikePlan(plan, this.id!);
    this.coaches$ = this.service.loadCoaches();
    this.cd.detectChanges()
  }
}
//like unlike need correction