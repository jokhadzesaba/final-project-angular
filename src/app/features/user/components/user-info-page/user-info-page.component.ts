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
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-user-info-page',
  templateUrl: './user-info-page.component.html',
  styleUrls: ['./user-info-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoPageComponent implements OnInit {
  public id?: number;
  public userPlans!: Observable<User>;
  user!: User;
  public selectedPlan!: Plan | null;
  addExercise(plan: Plan) {
    this.service.selectedPlan = plan;
    this.router.navigate(['/exercises']);
    this.getExercises();
  }
  hasLikedPlans(): boolean {
    return !!this.user?.likedPlans?.length;
  }
  showPlan(plan: Plan) {
    if (this.selectedPlan && this.selectedPlan.name === plan.name) {
      this.selectedPlan = null;
    } else {
      this.selectedPlan = plan;
    }
  }

  constructor(
    private service: RegistrationUpdateDeleteEditService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.service.loggedUser.subscribe((user) => {
      this.user = user;
      this.id = user.id!;
    });
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
    this.service
      .deleteExercise(plan, exercise, this.id!, 'users')
      .subscribe(() => {
        this.getExercises();
        this.userPlans.subscribe((res) => {
          this.selectedPlan =
            res.plans?.find((p) => (plan.name = p.name)) || null;
        });
        console.log(this.selectedPlan?.exercises);
        this.cd.detectChanges();
      });
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
}
