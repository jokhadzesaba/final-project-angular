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
  public userPlans!: Observable<User>;
  public user!: User;
  public selectedPlan!: Plan | null;
  public changingImage?:Boolean = false
  public selectedImage?:string = "";
  public images?:string[] = []
  constructor(
    private service: RegistrationUpdateDeleteEditService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private router: Router,
    private sharedService: SharedService

  ) {}

  addExercise(plan: Plan) {
    this.service.selectedPlan = plan;
    this.sharedService.addexercise(true);
    this.sharedService.ifchanged(false);
    this.router.navigate(['/exercises']);
    this.getExercises();
  }

  ngOnInit(): void {
    this.service.loggedUser.subscribe((user) => {
      this.user = user;
      this.images = this.sharedService.images
    });
    this.sharedService.wasChanged$.subscribe((value) => {
      if (value === true) {
        this.getExercises();
        this.cd.markForCheck();
      }
    });
    this.getExercises();
  }
  getExercises() {
    if (this.user) {
      this.userPlans = this.service.getUserOrCoach(this.service.firebaseId, 'users');
    }
  }
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  deletePlan(plan: Plan, planType:"personal" | "liked") {
    this.service.deletePlan(plan, 'users', planType).subscribe(() => {
      this.getExercises();
      this.cd.detectChanges();
    });
  }
  deleteExercise(plan: Plan, exercise: Exercise) {
    this.service.deleteExercise(plan, exercise, 'users').subscribe(() => {
      this.getExercises();
      this.cd.detectChanges();
    });
  }

  // moveExercise(plan: Plan, exercise: Exercise, offset: number) {
  //   if (plan && plan.exercises) {
  //     const currentIndex = plan.exercises.indexOf(exercise);
  //     const newIndex = currentIndex + offset;

  //     if (
  //       plan.exercises &&
  //       currentIndex !== -1 &&
  //       newIndex >= 0 &&
  //       newIndex < plan.exercises.length
  //     ) {
  //       const updatedExercises = [...plan.exercises];
  //       const movedExercise = updatedExercises[currentIndex];
  //       updatedExercises.splice(currentIndex, 1);
  //       updatedExercises.splice(newIndex, 0, movedExercise);
  //       const updatedPlan = { ...plan, exercises: updatedExercises };

  //       if (this.user && this.user.plans) {
  //         const planIndex = this.user.plans.findIndex(
  //           (p) => p.name === plan.name
  //         );

  //         if (planIndex !== -1 && this.user.plans[planIndex]) {
  //           this.user.plans[planIndex] = updatedPlan;

  //           this.service.updateOrder(this.user).subscribe(() => {
  //             this.service
  //               .getUserOrCoach(this.user.id!, 'users')
  //               .subscribe((updatedUser) => {
  //                 this.getExercises();
  //                 this.cd.detectChanges();
  //               });
  //           });
  //         }
  //       }
  //     }
  //   }
  // }
  deleteRequestedPlan(plan: RequestedPlan) {
    // this.service.deleteRequestedPlan(plan, this.id!, plan.coachId)
    this.service.getUserOrCoach('this.id!', 'users').subscribe((user) => {
      // id fix
      this.user = user;
      this.getExercises();
      this.cd.detectChanges();
    });
  }
  navigate(plan: Plan) {
    this.sharedService.navigateToPlan(plan.planId)
  }
  selectImage(img: string) {
    this.selectedImage = img;
  }
  change(){
    this.changingImage = true
  }
  cancel(){
    this.changingImage = false
  }
  changeProgilePhoto(url: string) {
    this.service.changePrfileImg(url, 'users').subscribe(() => {
      this.changingImage = false
      this.getExercises()
      this.cd.detectChanges()
    });
  }
}
