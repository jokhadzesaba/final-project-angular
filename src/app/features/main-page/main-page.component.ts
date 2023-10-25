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
    this.service.likePlan(plan, this.id!).subscribe()
  }
  
  unlikePlan(plan: Plan) {
    this.service.unlikePlan(plan, this.id!).subscribe()
  }
}