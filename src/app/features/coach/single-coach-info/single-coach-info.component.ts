import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Plan } from 'src/app/shared/interfaces/plan';
import { RegistrationUpdateDeleteEditService } from '../../sharedServices/registration-update-delete-edit.service';
import { Coach } from 'src/app/shared/interfaces/coach';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SharedService } from '../../sharedServices/shared.service';

@Component({
  selector: 'app-single-coach-info',
  templateUrl: './single-coach-info.component.html',
  styleUrls: ['./single-coach-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleCoachInfoComponent implements OnInit {
  public loggedId?: string;
  public status?: string;
  public coachPlans!: Observable<Coach>;
  public coach!: Coach;
  public selectedPlan!: Plan | null;
  public images?: string[];
  public selectedImage?: string = '';
  public changingImage:boolean = false
  public img:string = 'assets/exer3.jpg'
  constructor(
    private service: RegistrationUpdateDeleteEditService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private router: Router,
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getExercises();
  }
  selectImage(img: string) {
    this.selectedImage = img;
  }
  getExercises() {
    const coachId = this.route.snapshot.paramMap.get('id');
    this.service.loggedUser.subscribe((log) => {
      this.loggedId = log.id;
      this.status = log.status;
    });
    this.service
      .getUserOrCoach(coachId!, 'coaches')
      .subscribe((coach: Coach) => {
        this.coach = coach;
        this.images = this.sharedService.images;
        this.cd.detectChanges();
      });
  }
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  deletePlan(plan: Plan) {
    this.service.deletePlan(plan, 'coaches', 'personal').subscribe(() => {
      this.getExercises();
      this.cd.detectChanges();
    });
  }
  makePlan(userId: string, requestId: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        userId: userId,
        coachId: this.coach.id,
        coachName: this.coach.nickName,
        requestId: requestId,
      },
    };
    this.sharedService.setCreatingPlan(true);
    this.sharedService.makingplanForUser(true);
    this.router.navigate(['/exercises'], navigationExtras);
  }
  deleteRequest(id: string) {
    this.service.deleteUserRequest(id).subscribe(() => {
      this.cd.detectChanges();
    });
  }
  likePlan(plan: Plan) {
    this.service.likePlan(plan, this.coach.id).subscribe(() => {
      this.sharedService.likedPlans.push(plan.planId);
      this.cd.detectChanges()
    });
  }
  unlikePlan(plan: Plan) {
    this.service.unlikePlan(plan, this.coach.id).subscribe(() => {
      this.sharedService.likedPlans = this.sharedService.likedPlans.filter(
        (planid) => planid !== plan.planId
      );
      this.cd.detectChanges()
    });
  }
  isPlanLiked(plan:Plan){
    return this.sharedService.likedPlans.some((e) => e === plan.planId);
  }
  showPlan(plan: Plan) {
    this.sharedService.navigateToPlan(plan.planId);
  }
  change(){
    this.changingImage = true
  }
  cancel(){
    this.changingImage = false
  }
  changeProgilePhoto(url: string) {
    this.service.changePrfileImg(url, 'coaches').subscribe(() => {
      this.changingImage = false
      this.service.loggedUser.value.profileImgUrl = url
      this.getExercises()
    });
  }
}
