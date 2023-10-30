import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { RegistrationUpdateDeleteEditService } from 'src/app/features/sharedServices/registration-update-delete-edit.service';
import { Exercise } from 'src/app/shared/interfaces/exercise';
import { Plan } from 'src/app/shared/interfaces/plan';
import { User } from 'src/app/shared/interfaces/user';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavigationExtras, Router } from '@angular/router';
import { RequestedPlan } from 'src/app/shared/interfaces/requestedPlan';
import { SharedService } from 'src/app/features/sharedServices/shared.service';

@Component({
  selector: 'app-user-info-page',
  templateUrl: './user-info-page.component.html',
  styleUrls: ['./user-info-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoPageComponent implements OnInit {
  public id?: number;
  public userPlans!: Observable<User>;
  public user!: User;
  public selectedPlan!: Plan | null;
  constructor(
    private service: RegistrationUpdateDeleteEditService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private router: Router,
    private sharedService:SharedService
  ) {}

  addExercise(plan: Plan) {
    this.service.selectedPlan = plan;
    this.sharedService.addexercise(true)
    this.sharedService.ifchanged(false)
    this.router.navigate(['/exercises']);
    this.getExercises();
  }

  showPlan(plan: Plan) {
    if (this.selectedPlan && this.selectedPlan.planId === plan.planId) {
      this.selectedPlan = null;
    } else {
      this.selectedPlan = plan;
    }
  }
  showRequestedPlan(requestedPlan: RequestedPlan) {
    if (this.selectedPlan && this.selectedPlan.planId === requestedPlan.planId) {
      this.selectedPlan = null;
    } else {
      this.selectedPlan = {
        name: requestedPlan.planName,
        description:requestedPlan.description,
        exercises: requestedPlan.exercises,
        planId:requestedPlan.planId
      };
    }
  }
  ngOnInit(): void {
    this.service.loggedUser.subscribe((user) => {
      this.user = user;
      this.id = user.id!;
    });
    this.sharedService.wasChanged$.subscribe(value=>{
      if (value===true) {
        this.getExercises();
        this.cd.markForCheck()
      }
    })
    this.getExercises();
  }
  getExercises() {
    if (this.user) {
      this.userPlans = this.service.getUserOrCoach(this.user.id!, 'users');
    }
  }
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  deletePlan(plan: Plan) {
    this.service.deletePlan(plan, this.id!, 'users').subscribe(() => {
      this.getExercises();
      this.cd.detectChanges();
    });
  }
  deleteExercise(plan: Plan, exercise: Exercise) {
    this.service.deleteExercise(plan, exercise, this.id!, 'users').subscribe(()=>{
      this.getExercises();
      this.cd.detectChanges()
    }
    )      
  }

  moveExercise(plan: Plan, exercise: Exercise, offset: number) {
    if (plan && plan.exercises) {
      const currentIndex = plan.exercises.indexOf(exercise);
      const newIndex = currentIndex + offset;

      if (
        plan.exercises &&
        currentIndex !== -1 &&
        newIndex >= 0 &&
        newIndex < plan.exercises.length
      ) {
        const updatedExercises = [...plan.exercises];
        const movedExercise = updatedExercises[currentIndex];
        updatedExercises.splice(currentIndex, 1);
        updatedExercises.splice(newIndex, 0, movedExercise);
        const updatedPlan = { ...plan, exercises: updatedExercises };

        if (this.user && this.user.plans) {
          const planIndex = this.user.plans.findIndex(
            (p) => p.name === plan.name
          );

          if (planIndex !== -1 && this.user.plans[planIndex]) {
            this.user.plans[planIndex] = updatedPlan;

            this.service.updateOrder(this.user).subscribe(() => {
              this.service
                .getUserOrCoach(this.user.id!, 'users')
                .subscribe((updatedUser) => {
                  this.getExercises();
                  this.cd.detectChanges();
                });
            });
          }
        }
      }
    }
  }
  deleteRequestedPlan(plan:RequestedPlan){
      this.service.deleteRequestedPlan(plan, this.id!, plan.coachId)
      this.service.getUserOrCoach(this.id!, 'users').subscribe((user) => {
        this.user = user;
        this.getExercises();
        this.cd.detectChanges();
      });
  }
  navigate(plan:Plan){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        coach:plan.creatorId,
        plan:plan.planId,
      }
    }
    this.router.navigate([`/plan/${plan.planId}`], navigationExtras)

  }
}
