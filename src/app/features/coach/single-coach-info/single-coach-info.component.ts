import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Exercise } from 'src/app/shared/interfaces/exercise';
import { Plan } from 'src/app/shared/interfaces/plan';
import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { NavigationExtras, Router } from '@angular/router';
import { SharedService } from '../../sharedServices/shared.service';

@Component({
  selector: 'app-single-coach-info',
  templateUrl: './single-coach-info.component.html',
  styleUrls: ['./single-coach-info.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class SingleCoachInfoComponent {
  public id = 0;
  public coachPlans!: Observable<Coach>;
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
    private cd: ChangeDetectorRef,
    private router:Router,
    private sharedService:SharedService
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
      this.coachPlans = this.service.getUserOrCoach(this.coach.id!, 'coaches');
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
        this.coachPlans.subscribe((res) => {
          this.selectedPlan =
            res.plans?.find((p) => (plan.name = p.name)) || null;
        });
        console.log(this.selectedPlan?.exercises);

        this.cd.detectChanges();
      });
  }
  makePlan(userId:number){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        userId: userId,
        coachId:this.coach.id,
        coachName:this.coach.name,
        coachlastName:this.coach.lastname,
        nickName:this.coach.nickName
      }
    };
    this.sharedService.setCreatingPlan(true);
    this.router.navigate(['/exercises'], navigationExtras);
  }
  deleteRequest(id:string){
    this.service.deleteUserRequest(this.id,id).subscribe(()=>{
      this.getExercises();
      this.cd.detectChanges();
    })    
  }
}
