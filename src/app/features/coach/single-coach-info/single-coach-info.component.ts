import { ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Exercise } from 'src/app/shared/interfaces/exercise';
import { Plan } from 'src/app/shared/interfaces/plan';
import { User } from 'src/app/shared/interfaces/user';
import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';

@Component({
  selector: 'app-single-coach-info',
  templateUrl: './single-coach-info.component.html',
  styleUrls: ['./single-coach-info.component.scss'],
})
export class SingleCoachInfoComponent {
  public id = 0;
  public userPlans!: Observable<User>;
  coach!: Coach;
  public selectedPlan!: Plan | null;

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
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.service.loggedUser.subscribe((coach) => {
      this.coach = coach;
      this.id = coach.id!;
    });
    this.getExercises();
  }
  getExercises() {
    if (this.coach) {
      this.userPlans = this.service.getUserOrCoach(this.coach.id!, 'coaches');
    }
  }
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  deletePlan(plan: Plan) {
    this.service.deletePlan(plan, this.id, 'coaches').subscribe(() => {
      this.getExercises();
      this.cd.detectChanges();
    });
  }
  deleteExercise(plan: Plan, exercise: Exercise) {
    this.service
      .deleteExercise(plan, exercise, this.id, 'coaches')
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
}
