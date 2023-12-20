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
      this.cd.detectChanges()
    }
  }
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  deletePlan(plan: Plan, planType:"personal" | "liked") {
    this.service.deletePlan(plan, 'users', planType).subscribe(() => {
      this.getExercises();
    });
  }
  deleteExercise(plan: Plan, exercise: Exercise) {
    this.service.deleteExercise(plan, exercise, 'users').subscribe(() => {
      this.getExercises();
    });
  }
  deleteRequestedPlan(plan: RequestedPlan) {
    this.service.deleteRequestedPlan(plan).subscribe(()=>{
      this.getExercises()
    })
    
  }
  navigate(plan: Plan | RequestedPlan) {
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
      this.service.loggedUser.value.profileImgUrl = url
      this.getExercises()
      this.cd.detectChanges()
    });
  }
}
